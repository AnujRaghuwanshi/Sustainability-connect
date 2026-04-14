import { useEffect, useState } from 'react';
import * as api from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function UsersPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const customerUsers = users; // Show all users


  useEffect(() => {
    let active = true;
    async function loadUsers() {
      try {
        const payload = await api.fetchUsers(session.token);
        if (active) {
          // Backend returns { success: true, users: [...] }
          if (payload && payload.users && Array.isArray(payload.users)) {
            // Don't filter here - normalization happens in api.js
            setUsers(payload.users);
          } else {
            console.log('Invalid payload structure:', payload); // Debug log
            setUsers([]);
            setError('Invalid users data received from server');
          }
        }
      } catch (err) {
        console.log('Error loading users:', err); // Debug log
        if (active) setError(`⚠️ Unable to load users: ${err.message || 'Unknown error'}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      active = false;
    };
  }, [session.token]);

  const removeUser = async (id) => {
    if (!id) {
      setError('❌ Invalid user ID');
      return;
    }
    try {
      await api.deleteUser(id, session.token);
      setUsers((current) => current.filter((user) => user.id !== id));
      setError(''); // Clear on success
    } catch (err) {
      const errorMsg = err.message || 'Unable to delete user';
      setError(`❌ ${errorMsg}`);
    }
  };

  return (
    <div>
      <h2>User Account Management</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading users…</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>City</th>
                {/* <th>Role</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customerUsers.map((user, index) => (
                <tr key={user?.id || `user-${index}`}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password || 'N/A'}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender}</td>
                  <td>{user.city}</td>
                  {/* <td>{user.role || 'N/A'}</td> */}
                  <td>
                    <button className="button danger" onClick={() => removeUser(user.id)}>
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
