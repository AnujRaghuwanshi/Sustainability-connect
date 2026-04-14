import { useEffect, useState } from "react";
import * as api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function OrdersPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadInitialData() {
      try {
        const [userPayload, orderPayload] = await Promise.all([
          api.fetchUsers(session.token),
          api.fetchOrders(session.token),
        ]);
        if (active) {
          setUsers(
            Array.isArray(userPayload)
              ? userPayload.filter((u) => u && u.id)
              : [],
          );
          setOrders(
            Array.isArray(orderPayload)
              ? orderPayload.filter((o) => o && o.id)
              : [],
          );
        }
      } catch (err) {
        if (active)
          setError(
            `⚠️ Unable to load order data: ${err.message || "Unknown error"}`,
          );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, [session.token]);

  

  useEffect(() => {
    let active = true;
    async function loadOrders() {
      try {
        const orderPayload = await api.fetchOrders(session.token, {
          userId: userIdFilter || undefined,
        });
        let filtered = orderPayload;
        // 🔥 Status filter
        if (statusFilter) {
          filtered = filtered.filter(
            (order) =>
              order.status?.toLowerCase() === statusFilter.toLowerCase(),
          );
        }

        // 🔥 Date filter
        if (orderDate) {
          filtered = filtered.filter(
            (order) => order.date?.split("T")[0] === orderDate,
          );
        }

      setOrders(filtered);
      } catch (err) {
        if (active)
          setError(
            `⚠️ Unable to load filtered orders. ${err.message || "Unknown error"}`,
          );
      }
    }

    if (!loading) loadOrders();
    return () => {
      active = false;
    };
  }, [userIdFilter, statusFilter, orderDate, session.token, loading]);

  return (
    <div>
      <h2>Order Tracking</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-card" style={{ marginBottom: "24px" }}>
        <h3>Filter orders</h3>
        <label>
          Customer ID
          <input
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            type="text"
            placeholder="Enter customer ID"
          />
        </label>
        <label>
          Status
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Placed">Placed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </label>
        </label>
        <label>
          Order date
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </label>
      </div>
      {loading ? (
        <p>Loading orders…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order?._id || `order-${index}`}>
                <td>{order._id}</td>
                <td>{order.userId}</td>
                <td>
                  {order.items
                    ?.map((item) => item.productId?.name)
                    .join(", ") || "N/A"}
                </td>
                <td>Rs {order.totalAmount}</td>
                <td>{order.status}</td>
                <td>{order.date.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
