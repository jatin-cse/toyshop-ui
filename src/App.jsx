import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [toys, setToys] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/toys")
      .then((res) => res.json())
      .then((data) => setToys(data))
      .catch(() => setError("Backend not connected"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Toy Shop</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {toys.map((toy) => (
        <div
          key={toy.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{toy.name}</h3>
          <p>Category: {toy.category}</p>
          <p>Price: ₹{toy.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
