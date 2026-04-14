import { useCallback, useEffect, useState } from "react";
import * as api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function PickupsPage() {
  const { session } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPickups() {
      try {
        const payload = await api.fetchPickups(session.token);
        console.log("Fetched pickups payload:", payload); // Debug log
        if (active) {
          if (active) {
            if (payload && Array.isArray(payload.pickups)) {
              setPickups(payload.pickups); // ✅ FIXED
            } else {
              setPickups([]);
              setError("Invalid pickups data received from server");
            }
          }
        }
      } catch (err) {
        if (active)
          setError(
            `⚠️ Unable to load pickups: ${err.message || "Unknown error"}`,
          );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPickups();
    return () => {
      active = false;
    };
  }, [session.token]);

  const handleStatusChange = (id, status) => {
    setPickups(pickups.map((p) => (p.id === id ? { ...p, status } : p)));
  };


  const handleSave = async (id) => {
    const pickup = pickups.find((p) => p._id === id);
    if (!pickup) {
      setError("❌ Pickup not found");
      return;
    }
    try {
      await api.updatePickup(
        id,
        { status: pickup.status},
        session.token,
      );
       setPickups(prev =>
      prev.map(p =>
        p._id === id ? { ...p, status: pickup.status } : p
      )
    );
      setEditing({ ...editing, [id]: false });
      setError(""); // Clear on success
    } catch (err) {
      const errorMsg = err.message || "Unable to update pickup";
      setError(`❌ ${errorMsg}`);
    }
  };

  const toggleEdit = (id) => {
    setEditing({ ...editing, [id]: !editing[id] });
  };

  return (
    <div>
      <h2>Scheduled Pickups</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading scheduled pickups…</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Center</th>
                <th>Pincode</th>
                <th>Contact</th>
                <th>Waste Type</th>
                <th>Scheduled Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pickups.map((pickup, index) => (
                <tr key={pickup?.id || `pickup-${index}`}>
                  <td>{pickup.name}</td>
                  <td>{pickup.email}</td>
                  <td>{pickup.address}</td>
                  <td>{pickup.center}</td>
                  <td>{pickup.pincode}</td>
                  <td>{pickup.contact}</td>
                  <td>{pickup.wasteType}</td>
                  <td>{pickup.date}</td>
                  <td>
                    {editing[pickup.id] ? (
                      <select
                        value={pickup.status}
                        onChange={(e) =>
                          handleStatusChange(pickup.id, e.target.value)
                        }
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      pickup.status
                    )}
                  </td>
                  <td>
                    {editing[pickup.id] ? (
                      <button onClick={() => handleSave(pickup._id)}>
                        Save
                      </button>
                    ) : (
                      <button onClick={() => toggleEdit(pickup.id)}>
                        Edit
                      </button>
                    )}
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
