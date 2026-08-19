import { useEffect, useState } from "react";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetch("http://localhost:4242/orders", {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
  },
}) 
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unable to load orders:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <section className="orders-dashboard">
      <h2>DEEZ TEEZ ORDERS</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.sessionId}>
            <h3>{order.customerEmail || "No customer email"}</h3>

            <p>
              <strong>Total Paid:</strong> ${order.amountPaid}
            </p>

            <p>
              <strong>Order Time:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.items.map((item, index) => (
              <div className="order-item" key={index}>
                <p><strong>Product:</strong> {item.product}</p>
                <p><strong>Style:</strong> {item.style || "N/A"}</p>
                <p><strong>Size:</strong> {item.size || "N/A"}</p>
                <p><strong>Color:</strong> {item.color || "N/A"}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Amount:</strong> ${item.amount}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </section>
  );
}

export default OrdersDashboard;