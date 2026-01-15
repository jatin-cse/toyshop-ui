import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/v1/toys";

function App() {
  const [toys, setToys] = useState([]);
  const [editingToy, setEditingToy] = useState(null);

  // CREATE form state
  const [newToy, setNewToy] = useState({
    name: "",
    price: "",
    category: "",
  });

  // Validation states
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setToys(data);
  };

  /* ---------------- CREATE VALIDATION ---------------- */
  const validateToy = () => {
    const newErrors = {};

    if (!newToy.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newToy.price || Number(newToy.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!newToy.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- CREATE TOY ---------------- */
  const addToy = async () => {
    if (!validateToy()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newToy.name,
        price: Number(newToy.price),
        category: newToy.category,
      }),
    });

    setNewToy({ name: "", price: "", category: "" });
    setErrors({});
    fetchToys();
  };

  /* ---------------- DELETE TOY ---------------- */
  const deleteToy = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchToys();
  };

  /* ---------------- START EDIT ---------------- */
  const startEdit = (toy) => {
    setEditingToy(toy);
    setEditErrors({});
  };

  /* ---------------- UPDATE VALIDATION ---------------- */
  const validateEditToy = () => {
    const newErrors = {};

    if (!editingToy.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!editingToy.price || Number(editingToy.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!editingToy.category.trim()) {
      newErrors.category = "Category is required";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- UPDATE TOY ---------------- */
  const updateToy = async () => {
    if (!validateEditToy()) return;

    await fetch(`${API_URL}/${editingToy.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingToy),
    });

    setEditingToy(null);
    setEditErrors({});
    fetchToys();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>🧸 Toy Shop</h2>

      {/* ---------------- CREATE FORM ---------------- */}
      <h3>Add New Toy</h3>

      <input
        placeholder="Name"
        value={newToy.name}
        onChange={(e) =>
          setNewToy({ ...newToy, name: e.target.value })
        }
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      <input
        placeholder="Price"
        type="number"
        value={newToy.price}
        onChange={(e) =>
          setNewToy({ ...newToy, price: e.target.value })
        }
      />
      {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}

      <input
        placeholder="Category"
        value={newToy.category}
        onChange={(e) =>
          setNewToy({ ...newToy, category: e.target.value })
        }
      />
      {errors.category && (
        <p style={{ color: "red" }}>{errors.category}</p>
      )}

      <button onClick={addToy}>Add Toy</button>

      <hr />

      {/* ---------------- EDIT FORM ---------------- */}
      {editingToy && (
        <div>
          <h3>Edit Toy</h3>

          <input
            value={editingToy.name}
            onChange={(e) =>
              setEditingToy({ ...editingToy, name: e.target.value })
            }
          />
          {editErrors.name && (
            <p style={{ color: "red" }}>{editErrors.name}</p>
          )}

          <input
            type="number"
            value={editingToy.price}
            onChange={(e) =>
              setEditingToy({
                ...editingToy,
                price: Number(e.target.value),
              })
            }
          />
          {editErrors.price && (
            <p style={{ color: "red" }}>{editErrors.price}</p>
          )}

          <input
            value={editingToy.category}
            onChange={(e) =>
              setEditingToy({
                ...editingToy,
                category: e.target.value,
              })
            }
          />
          {editErrors.category && (
            <p style={{ color: "red" }}>{editErrors.category}</p>
          )}

          <button onClick={updateToy}>Update</button>
          <button
            onClick={() => {
              setEditingToy(null);
              setEditErrors({});
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ---------------- TOY LIST ---------------- */}
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
