import { useCallback, useEffect, useState } from "react";
import * as api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function PickupsStatusPage() {
  const { session } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPickups = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const payload = await api.fetchPickups(session.token);
        const nextPickups = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.pickups)
            ? payload.pickups
            : [];

        setPickups(nextPickups);
        setError("");
      } catch (err) {
        setError(`Unable to load pickups: ${err.message || "Unknown error"}`);
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [session.token],
  );

  useEffect(() => {
    loadPickups();
  }, [loadPickups]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>Scheduled Pickups</h2>
        <button
          type="button"
          className="button secondary"
          onClick={() => loadPickups({ silent: true })}
          disabled={loading || refreshing}
          title="Refresh pickup status"
          aria-label="Refresh pickup status"
        >
          {refreshing ? "Refreshing..." : "↻ Refresh Status"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading scheduled pickups...</p>
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
              </tr>
            </thead>
            <tbody>
              {pickups.map((pickup, index) => (
                <tr key={pickup?.id || pickup?._id || `pickup-${index}`}>
                  <td>{pickup.name}</td>
                  <td>{pickup.email}</td>
                  <td>{pickup.address}</td>
                  <td>{pickup.center}</td>
                  <td>{pickup.pincode}</td>
                  <td>{pickup.contact}</td>
                  <td>{pickup.wasteType}</td>
                  <td>{pickup.date}</td>
                  <td>{pickup.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
