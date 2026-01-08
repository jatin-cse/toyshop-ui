import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading from backend...");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Backend not connected"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Toy Shop UI</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
