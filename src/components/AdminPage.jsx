import { useEffect, useState } from "react";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(sessionStorage.getItem("adminToken"))
  );
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOrders = async (token) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4242/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Orders error:", error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    if (token) {
      loadOrders(token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4242/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        setError("Incorrect password.");
        setPassword("");
        return;
      }

      const data = await response.json();

      sessionStorage.setItem("adminToken", data.token);
      setIsLoggedIn(true);
      setPassword("");

      await loadOrders(data.token);
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Unable to connect to admin login.");
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("adminToken");

    try {
      await fetch("http://localhost:4242/admin-logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    sessionStorage.removeItem("adminToken");
    setOrders([]);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <section className="admin-login">
        <h2>DEEZ TEEZ ADMIN</h2>
        <p>Enter your admin password to view orders.</p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">LOGIN</button>
        </form>

        {error && <p className="admin-error">{error}</p>}
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <p>DEEZ TEEZ</p>
          <h2>ADMIN ORDERS</h2>
        </div>

        <div>
          <button
            type="button"
            onClick={() =>
              loadOrders(sessionStorage.getItem("adminToken"))
            }
          >
            REFRESH ORDERS
          </button>

          <button type="button" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && orders.length === 0 && (
        <p>No orders have been received yet.</p>
      )}

      <div className="admin-orders-list">
        {orders.map((order, index) => (
          <article
            className="admin-order-card"
            key={order.id || order.sessionId || index}
          >
            <h3>
              Order {order.id || order.sessionId || `#${index + 1}`}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {order.customer_email ||
                order.customerEmail ||
                order.customer_details?.email ||
                "Not provided"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.payment_status || order.status || "Received"}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              {typeof order.amount_total === "number"
                ? `$${(order.amount_total / 100).toFixed(2)}`
                : order.total || "See order details"}
            </p>

            <details>
              <summary>View complete order</summary>
              <pre>{JSON.stringify(order, null, 2)}</pre>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminPage;