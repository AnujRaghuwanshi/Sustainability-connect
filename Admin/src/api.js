const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const useMock = !API_BASE;
const MOCK_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@platform.com';
const MOCK_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'secure123';

const mockData = {
  products: [
    {
      id: 1,
      name: 'EcoBamboo Toothbrush',
      description: 'Introducing the Bamboo Fresh Nano Toothbrush, a revolution in oral care that combines the natural elegance of bamboo with advanced nano-technology.',
      price: 25,
      categoryID: 1,
      image_url: [
        'https://bambooindia.com/cdn/shop/products/DSC_8483-Edit_700x.jpg?v=1764616802',
        'https://bambooindia.com/cdn/shop/products/DSC_8483-Edit_1200x.jpg?v=1764616802'
      ]
    },
    {
      id: 2,
      name: 'Plastic Bottle',
      description: 'Reusable plastic bottle for eco-friendly hydration.',
      price: 10,
      categoryID: 2,
      image_url: []
    },
  ],
  users: [
    {
      id: 1,
      name: 'Anuj Raghuwanshi',
      email: 'anujraghuwanshi147@gmail.com',
      password: '$2a$10$VJqAJNjSCfI7UOWsox9E7O9m6kkJvM1rgdmep07mTWp7oBna.vmYG',
      phone: '9876543210',
      gender: 'male',
      city: 'Bhopal',
      role: 'customer'
    },
  ],
  centers: [
    {
      id: 1,
      name: 'Kawadiwala',
      address: '806 Anna Nagar, Near Career College, Govindpura',
      phone_no: '+91-76972 60260',
      email: 'contact@thekabadiwala.com',
      website: 'https://www.thekabadiwala.com/',
      dist: 'Bhopal',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '462011',
      city: 'Bhopal'
    },
    {
      id: 2,
      name: 'Northside Eco Hub',
      address: '23 Eco Park Road',
      phone_no: '+91-98765 43210',
      email: 'info@northsidehub.com',
      website: 'https://www.northsidehub.com/',
      dist: 'Bhopal',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '462020',
      city: 'Bhopal'
    },
  ],
  pickups: [
    {
      id: 1,
      name: 'Anuj Raghuwanshi',
      email: 'anujraghuwanshi147@gmail.com',
      address: 'Gandhinagar',
      center: 'kawadiwala',
      pincode: '462036',
      contact: '09340026873',
      wasteType: 'Electronics',
      date: '2026-03-31',
      status: 'Scheduled',
      pickupDate: null
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      address: '123 Eco Street',
      center: 'Northside Eco Hub',
      pincode: '462020',
      contact: '9876543210',
      wasteType: 'Plastic',
      date: '2026-05-16',
      status: 'Picked Up',
      pickupDate: '2026-05-16'
    },
  ],
  orders: [
    { id: 1, customerId: 1, customerName: 'Jane Doe', items: ['Plastic Bottle', 'Aluminum Can'], total: '4.20', status: 'In Transit', placedAt: '2026-04-08' },
    { id: 2, customerId: 1, customerName: 'Harry', items: ['Glass Jar'], total: '1.80', status: 'Delivered', placedAt: '2026-04-01' },
  ],
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildLocalAdminSession(email) {
  return {
    token: 'mock-token',
    user: { id: 0, name: 'Admin', email, role: 'admin' },
  };
}

async function loginWithLocalFallback(email, password) {
  await delay();
  if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
    return buildLocalAdminSession(email);
  }
  throw new Error('Invalid login credentials');
}

// Normalize MongoDB _id to id for consistency
function normalizeData(data) {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizeItem(item));
  }
  
  return normalizeItem(data);
}

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  
  const normalized = { ...item };
  
  // Convert _id to id if it exists and id doesn't
  if (normalized._id && !normalized.id) {
    normalized.id = normalized._id;
  }
  
  return normalized;
}

// Parse error responses for better error messages
function parseErrorResponse(errorText) {
  try {
    const parsed = JSON.parse(errorText);
    if (parsed.error) return parsed.error;
    if (parsed.message) return parsed.message;
  } catch {
    // If not JSON, return as is
  }
  return errorText || 'API request failed';
}

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(options.token),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = parseErrorResponse(errorText);
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType?.includes('application/json')) {
      return null;
    }

    const data = await response.json();
    return normalizeData(data);
  } catch (err) {
    // If it's a network error, provide a helpful message
    if (err instanceof TypeError) {
      throw new Error('Network error: Unable to reach the server. Make sure the backend is running on port 4000.');
    }
    throw err;
  }
}

export async function login(email, password) {
  if (useMock) {
    return loginWithLocalFallback(email, password);
  }

  try {
    return await request('/auth/login', { method: 'POST', body: { email, password } });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    const shouldFallback =
      message.includes('network error') ||
      message.includes('cannot post') ||
      message.includes('not found') ||
      message.includes('failed to fetch') ||
      message.includes('route');

    if (shouldFallback) {
      return loginWithLocalFallback(email, password);
    }

    throw error;
  }
}

export async function fetchProducts(token) {
  if (useMock) {
    await delay();
    return [...mockData.products];
  }
  return request('/products', { token });
}

export async function createProduct(product, token) {
  if (useMock) {
    await delay();
    const newProduct = { id: Date.now(), ...product };
    mockData.products.push(newProduct);
    return newProduct;
  }
  return request('/products', { method: 'POST', body: product, token });
}

export async function deleteProduct(productId, token) {
  if (useMock) {
    await delay();
    mockData.products = mockData.products.filter((p) => p.id !== productId);
    return null;
  }
  return request(`/products/${productId}`, { method: 'DELETE', token });
}

export async function fetchUsers(token) {
  if (useMock) {
    await delay();
    return [...mockData.users];
  }
  return request('/users/allUsers', { token });
}


export async function deleteUser(userId, token) {
  if (useMock) {
    await delay();
    mockData.users = mockData.users.filter((user) => user.id !== userId);
    return null;
  }
  return request(`/users/${userId}`, { method: 'DELETE', token });
}

export async function fetchCenters(token) {
  if (useMock) {
    await delay();
    return [...mockData.centers];
  }
  return request('/recycling-centers', { token });
}


export async function deleteCenter(centerId, token) {
  if (useMock) {
    await delay();
    mockData.centers = mockData.centers.filter((center) => center.id !== centerId);
    return null;
  }
  return request(`/recyclingcenters/${centerId}`, { method: 'DELETE', token });
}

export async function fetchPickups(token) {
  if (useMock) {
    await delay();
    return [...mockData.pickups];
  }
  return request('/allPickups', { token });
}

export async function updatePickup(id, data, token) {
  return request(`/pickups/${id}`, {
    method: 'PATCH',
    token,
    body: data
  });
}

export async function fetchOrders(token, filters = {}) {
  const { userId } = filters;

  if (useMock) {
    await delay();
    return mockData.orders.filter(o =>
      userId ? o.customerId === Number(userId) : true
    );
  }

  // 🔥 Call correct API
  if (userId) {
    return request(`/orders/${userId}`, { token }); // ✅ correct
  }

  return request('/orders', { token });
}
