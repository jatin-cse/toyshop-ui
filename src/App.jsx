import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/v1/toys";

function App() {
  const [toys, setToys] = useState([]);
  const [editingToy, setEditingToy] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // CREATE form
  const [newToy, setNewToy] = useState({
    name: "",
    price: "",
    category: "",
  });

  // Validation
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // UI
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search & filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ================= FETCH =================
  const fetchToys = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setToys(data);
    } catch (e) {
      console.error("Backend not connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToys();
  }, []);

  // ================= FILTER =================
  const filteredToys = toys.filter((toy) => {
    const matchesSearch = toy.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      toy.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ================= CREATE =================
  const validateToy = () => {
    const e = {};
    if (!newToy.name.trim()) e.name = "Name is required";
    if (!newToy.price || Number(newToy.price) <= 0)
      e.price = "Price must be greater than 0";
    if (!newToy.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addToy = async () => {
    if (!validateToy()) return;
    setSubmitting(true);

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newToy.name,
        price: Number(newToy.price),
        category: newToy.category,
      }),
    });

    setNewToy({ name: "", price: "", category: "" });
    setErrors({});
    setSubmitting(false);
    fetchToys();
  };

  // ================= EDIT =================
  const validateEditToy = () => {
    const e = {};
    if (!editingToy.name.trim()) e.name = "Name is required";
    if (!editingToy.price || Number(editingToy.price) <= 0)
      e.price = "Price must be greater than 0";
    if (!editingToy.category.trim()) e.category = "Category is required";
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateToy = async () => {
    if (!validateEditToy()) return;
    setSubmitting(true);

    await fetch(`${API_URL}/${editingToy.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingToy),
    });

    setEditingToy(null);
    setEditErrors({});
    setSubmitting(false);
    fetchToys();
  };

  // ================= DELETE =================
  const deleteToy = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchToys();
  };

  const categories = [
  "all",
  ...Array.from(
    new Set(toys.map((toy) => toy.category))
  ),
];


  // ================= UI =================
  return (
    <div style={styles.container}>
      <h2>🧸 Toy Shop</h2>

      {/* CREATE */}
      <div style={styles.card}>
        <h3>Add New Toy</h3>

        <input
          style={styles.input}
          placeholder="Name"
          value={newToy.name}
          onChange={(e) =>
            setNewToy({ ...newToy, name: e.target.value })
          }
        />
        {errors.name && <p style={styles.error}>{errors.name}</p>}

        <input
          style={styles.input}
          type="number"
          placeholder="Price"
          value={newToy.price}
          onChange={(e) =>
            setNewToy({ ...newToy, price: e.target.value })
          }
        />
        {errors.price && <p style={styles.error}>{errors.price}</p>}

        <input
          style={styles.input}
          placeholder="Category"
          value={newToy.category}
          onChange={(e) =>
            setNewToy({ ...newToy, category: e.target.value })
          }
        />
        {errors.category && (
          <p style={styles.error}>{errors.category}</p>
        )}

        <button onClick={addToy} disabled={submitting}>
          {submitting ? "Adding..." : "Add Toy"}
        </button>
      </div>

      {/* SEARCH */}
      <div style={styles.card}>
        <h3>Search & Filter</h3>

        <input
          style={styles.input}
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      <select
  style={styles.input}
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
>
  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat === "all" ? "All Categories" : cat}
    </option>
  ))}
</select>

      </div>

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div style={styles.card}>
          <p>
            Delete <b>{confirmDelete.name}</b>?
          </p>
          <button
            onClick={async () => {
              await deleteToy(confirmDelete.id);
              setConfirmDelete(null);
            }}
          >
            Yes
          </button>
          <button onClick={() => setConfirmDelete(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* LIST */}
      <h3>Available Toys</h3>

      {loading && <p>Loading toys...</p>}

      {!loading && filteredToys.length === 0 && (
        <p style={{ opacity: 0.6 }}>
          No toys match your search
        </p>
      )}

      {!loading &&
        filteredToys.map((toy) => (
          <div key={toy.id} style={styles.item}>
            <span>
              {toy.name} – ₹{toy.price} ({toy.category})
            </span>
            <span>
              <button onClick={() => setEditingToy(toy)}>
                Edit
              </button>
              <button onClick={() => setConfirmDelete(toy)}>
                Delete
              </button>
            </span>
          </div>
        ))}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial",
    color: "#fff",
  },
  card: {
  background: "#2a2a2a",
  padding: "16px",
  marginBottom: "20px",
  borderRadius: "10px",
  border: "1px solid #3a3a3a",
  boxSizing: "border-box",
  },

  input: {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  background: "#1f1f1f",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "6px",
  boxSizing: "border-box",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#2a2a2a",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};

export default App;
