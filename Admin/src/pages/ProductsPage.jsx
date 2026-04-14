import { useEffect, useState } from 'react';
import * as api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function ProductsPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', categoryID: '', price: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const payload = await api.fetchProducts(session.token);
        if (active) {
          if (Array.isArray(payload)) {
            setProducts(payload.filter(p => p && p.id)); // Ensure all products have id
          } else {
            setProducts([]);
            setError('Invalid products data received from server');
          }
        }
      } catch (err) {
        if (active) setError(`⚠️ Unable to load products: ${err.message || 'Unknown error'}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [session.token]);

  const addProduct = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    
    if (!newProduct.name || !newProduct.categoryID || !newProduct.price || !newProduct.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if product already exists (case-insensitive)
    const productExists = products.some(
      (p) => p.name.toLowerCase() === newProduct.name.toLowerCase()
    );
    if (productExists) {
      setError('❌ Product already exist');
      return;
    }

    const productToCreate = {
      ...newProduct,
      categoryID: Number(newProduct.categoryID),
      price: Number(newProduct.price),
      image_url: newProduct.image_url ? newProduct.image_url.split(',').map(url => url.trim()) : [],
    };

    try {
      const created = await api.createProduct(productToCreate, session.token);
      if (created && created.id) {
        setProducts((current) => [...current, created]);
        setNewProduct({ name: '', categoryID: '', price: '', description: '', image_url: '' });
        setError(''); // Clear form
      } else {
        setError('Product created but response was invalid. Refreshing...');
        // Reload products to sync
        const updated = await api.fetchProducts(session.token);
        setProducts(updated);
      }
    } catch (err) {
      const errorMsg = err.message || 'Unable to add product';
      setError(`❌ ${errorMsg}`);
    }
  };

  const removeProduct = async (id) => {
    if (!id) {
      setError('❌ Invalid product ID');
      return;
    }
    
    try {
      await api.deleteProduct(id, session.token);
      setProducts((current) => current.filter((product) => product.id !== id));
      setError(''); // Clear on success
    } catch (err) {
      const errorMsg = err.message || 'Unable to delete product';
      setError(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="products-layout">

        <section className="form-card form-card--wide">
        <div className="section-header">
          <div>
            <h3>Add a product</h3>
            <p>Use a rich product entry form to add an item with price, category, and images.</p>
          </div>
        </div>

        <form onSubmit={addProduct} className="product-form">
          <div className="form-grid">
            <label>
              Name
              <input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                type="text"
                placeholder="EcoBamboo Toothbrush"
                required
              />
            </label>
            <label>
              Category ID
              <input
                value={newProduct.categoryID}
                onChange={(e) => setNewProduct({ ...newProduct, categoryID: e.target.value })}
                type="number"
                placeholder="1"
                required
              />
            </label>
            <label>
              Price (Rs)
              <input
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                type="number"
                step="0.01"
                placeholder="25"
                required
              />
            </label>
            <label>
              Image URLs comma separated
              <input
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                type="text"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </label>
          </div>

          <label className="full-width-field">
            Description
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows="4"
              placeholder="Enter a short product description"
              required
            />
          </label>

          <div className="form-actions">
            <button className="button primary button-block" type="submit">
              Add Product
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </section>
      <br></br>

      <section className="table-card">
        <div className="section-header">
          <div>
            <h2>Product Management</h2>
          </div>
          <span className="badge">{products.length} products</span>
        </div>

        {loading ? (
          <p>Loading products…</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category ID</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product?.id || `product-${index}`}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.categoryID}</td>
                    <td>Rs {product.price}</td>
                    <td>
                      <button className="button danger" onClick={() => removeProduct(product.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>


    </div>
  );
}
