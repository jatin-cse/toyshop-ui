import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/v1/toys";

function App() {
  const [toys, setToys] = useState([]);
  const [editingToy, setEditingToy] = useState(null);

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setToys(data);
  };

  const deleteToy = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchToys();
  };

  const startEdit = (toy) => {
    setEditingToy(toy);
  };

  const updateToy = async () => {
    await fetch(`${API_URL}/${editingToy.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingToy),
    });

    setEditingToy(null);
    fetchToys();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧸 Toy Shop</h2>

      {editingToy && (
        <div>
          <h3>Edit Toy</h3>
          <input
            placeholder="Name"
            value={editingToy.name}
            onChange={(e) =>
              setEditingToy({ ...editingToy, name: e.target.value })
            }
          />
          <input
            placeholder="Price"
            type="number"
            value={editingToy.price}
            onChange={(e) =>
              setEditingToy({ ...editingToy, price: Number(e.target.value) })
            }
          />
          <input
            placeholder="Category"
            value={editingToy.category}
            onChange={(e) =>
              setEditingToy({ ...editingToy, category: e.target.value })
            }
          />
          <br />
          <button onClick={updateToy}>Update</button>
          <button onClick={() => setEditingToy(null)}>Cancel</button>
        </div>
      )}

      <ul>
        {toys.map((toy) => (
          <li key={toy.id}>
            {toy.name} - ₹{toy.price} ({toy.category})
            <button onClick={() => startEdit(toy)}>Edit</button>
            <button onClick={() => deleteToy(toy.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
