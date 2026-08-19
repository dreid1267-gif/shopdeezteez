import { useState } from "react";
import OrdersDashboard from "./OrdersDashboard.jsx";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4242/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setPassword("");
      } else {
        setError("Incorrect password.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Unable to connect to admin login.");
    }
  };

  if (isLoggedIn) {
    return <OrdersDashboard />;
  }

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
        />

        <button type="submit">LOGIN</button>
      </form>

      {error && <p className="admin-error">{error}</p>}
    </section>
  );
}

export default AdminPage;