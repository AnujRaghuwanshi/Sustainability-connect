import { useEffect, useState } from 'react';
import * as api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function ProviderPage() {
  const { session } = useAuth();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadCenters() {
      try {
        const payload = await api.fetchCenters(session.token);
        if (active) {
          if (Array.isArray(payload)) {
            setCenters(payload.filter(c => c && c.id)); // Ensure all centers have id
          } else {
            setCenters([]);
            setError('Invalid providers data received from server');
          }
        }
      } catch (err) {
        if (active) setError(`⚠️ Unable to load providers: ${err.message || 'Unknown error'}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCenters();
    return () => {
      active = false;
    };
  }, [session.token]);

  const removeCenter = async (id) => {
    if (!id) {
      setError('❌ Invalid provider ID');
      return;
    }
    try {
      await api.deleteCenter(id, session.token);
      setCenters((current) => current.filter((center) => center.id !== id));
      setError(''); // Clear on success
    } catch (err) {
      const errorMsg = err.message || 'Unable to delete provider';
      setError(`❌ ${errorMsg}`);
    }
  };

  return (
    <div>
      <h2>Provider Management</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading providers…</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Website</th>
                <th>Dist</th>
                <th>State</th>
                <th>Country</th>
                <th>Pincode</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center, index) => (
                <tr key={center?.id || `provider-${index}`}>
                  <td>{center.name}</td>
                  <td>{center.address}</td>
                  <td>{center.phone_no}</td>
                  <td>{center.email}</td>
                  <td>
                    <a href={center.website} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  </td>
                  <td>{center.dist}</td>
                  <td>{center.state}</td>
                  <td>{center.country}</td>
                  <td>{center.pincode}</td>
                  <td>{center.city}</td>
                  <td>
                    <button className="button danger" onClick={() => removeCenter(center.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
