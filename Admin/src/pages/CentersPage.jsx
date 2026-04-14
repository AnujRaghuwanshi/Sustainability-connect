import { useEffect, useState } from 'react';
import * as api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function CentersPage() {
  const { session } = useAuth();
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({ name: '', location: '' });
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
            setError('Invalid centers data received from server');
          }
        }
      } catch (err) {
        if (active) setError(`⚠️ Unable to load centers: ${err.message || 'Unknown error'}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCenters();
    return () => {
      active = false;
    };
  }, [session.token]);

  const addCenter = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    if (!newCenter.name || !newCenter.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const created = await api.createCenter(newCenter, session.token);
      if (created && created.id) {
        setCenters((current) => [...current, created]);
        setNewCenter({ name: '', location: '' });
        setError(''); // Clear form
      } else {
        setError('Center created but response was invalid. Refreshing...');
        const updated = await api.fetchCenters(session.token);
        setCenters(updated);
      }
    } catch (err) {
      const errorMsg = err.message || 'Unable to add center';
      setError(`❌ ${errorMsg}`);
    }
  };

  const removeCenter = async (id) => {
    if (!id) {
      setError('❌ Invalid center ID');
      return;
    }
    try {
      await api.deleteCenter(id, session.token);
      setCenters((current) => current.filter((center) => center.id !== id));
      setError(''); // Clear on success
    } catch (err) {
      const errorMsg = err.message || 'Unable to delete center';
      setError(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="section-grid">
      <div>
        <h2>Recycling Center Management</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Loading centers…</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center, index) => (
                <tr key={center?.id || `center-${index}`}>
                  <td>{center.name}</td>
                  <td>{center.location}</td>
                  <td>
                    <button className="button danger" onClick={() => removeCenter(center.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="form-card">
        <h3>Add a recycling center</h3>
        <form onSubmit={addCenter}>
          <label>
            Name
            <input
              value={newCenter.name}
              onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
              type="text"
              required
            />
          </label>
          <label>
            Location
            <input
              value={newCenter.location}
              onChange={(e) => setNewCenter({ ...newCenter, location: e.target.value })}
              type="text"
              required
            />
          </label>
          <button className="button primary" type="submit">
            Add Center
          </button>
        </form>
      </div>
    </div>
  );
}
