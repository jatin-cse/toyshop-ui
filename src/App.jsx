import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8080/api/v1/toys";

export default function App() {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);

  // create
  const [newToy, setNewToy] = useState({ name: "", price: "", category: "" });
  const [errors, setErrors] = useState({});

  // edit
  const [editingToy, setEditingToy] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  // delete confirm
  const [confirmDelete, setConfirmDelete] = useState(null);

  // search & filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ---------------- FETCH ----------------
  const fetchToys = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setToys(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToys();
  }, []);

  // ---------------- VALIDATION ----------------
  const validate = (toy, setErr) => {
    const e = {};
    if (!toy.name.trim()) e.name = "Name required";
    if (!toy.price || Number(toy.price) <= 0) e.price = "Price > 0";
    if (!toy.category.trim()) e.category = "Category required";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- CREATE ----------------
  const addToy = async () => {
    if (!validate(newToy, setErrors)) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, price: Number(newToy.price) }),
    });

    setNewToy({ name: "", price: "", category: "" });
    setErrors({});
    fetchToys();
  };

  // ---------------- UPDATE ----------------
  const updateToy = async () => {
    if (!validate(editingToy, setEditErrors)) return;

    await fetch(`${API_URL}/${editingToy.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingToy),
    });

    setEditingToy(null);
    setEditErrors({});
    fetchToys();
  };

  // ---------------- DELETE ----------------
  const deleteToy = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchToys();
  };

  // ---------------- FILTER LOGIC ----------------
  const categories = useMemo(() => {
    return ["all", ...new Set(toys.map(t => t.category))];
  }, [toys]);

  const filteredToys = toys.filter(t => {
    const matchName = t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === "all" ||
      t.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchName && matchCat;
  });

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#0d0d14] text-gray-100 px-4 py-8">
     <div className="max-w-screen-xl mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="text-4xl font-bold flex items-center gap-3">
          🧸 Toy Shop
        </h1>

        {/* ADD */}
        <div className="bg-[#16162a] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold">Add New Toy</h2>

          <input
            className="w-full p-3 rounded-xl bg-[#1e1e38]"
            placeholder="Name"
            value={newToy.name}
            onChange={e => setNewToy({ ...newToy, name: e.target.value })}
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <input
            type="number"
            className="w-full p-3 rounded-xl bg-[#1e1e38]"
            placeholder="Price"
            value={newToy.price}
            onChange={e => setNewToy({ ...newToy, price: e.target.value })}
          />
          {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}

          <input
            className="w-full p-3 rounded-xl bg-[#1e1e38]"
            placeholder="Category"
            value={newToy.category}
            onChange={e => setNewToy({ ...newToy, category: e.target.value })}
          />
          {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}

          <button
            onClick={addToy}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500"
          >
            Add Toy
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-[#16162a] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold">Search & Filter</h2>

          <input
            className="w-full p-3 rounded-xl bg-[#1e1e38]"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-xl bg-[#1e1e38]"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* LIST */}
        <div className="bg-[#16162a] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold">Available Toys</h2>

          {loading && <p className="opacity-60">Loading…</p>}
          {!loading && filteredToys.length === 0 && (
            <p className="opacity-60">No toys found</p>
          )}

          {filteredToys.map(toy => (
            <div
              key={toy.id}
              className="flex justify-between items-center bg-[#1e1e38] p-4 rounded-xl"
            >
              <span>
                {toy.name} – ₹{toy.price} ({toy.category})
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingToy({ ...toy })}
                  className="px-4 py-2 bg-cyan-500/20 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(toy)}
                  className="px-4 py-2 bg-red-500/20 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MODAL */}
        {editingToy && (
          <div className="bg-[#16162a] p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-semibold">Edit Toy</h2>

            <input
              className="w-full p-3 rounded-xl bg-[#1e1e38]"
              value={editingToy.name}
              onChange={e => setEditingToy({ ...editingToy, name: e.target.value })}
            />
            {editErrors.name && <p className="text-red-400 text-sm">{editErrors.name}</p>}

            <input
              type="number"
              className="w-full p-3 rounded-xl bg-[#1e1e38]"
              value={editingToy.price}
              onChange={e => setEditingToy({ ...editingToy, price: e.target.value })}
            />
            {editErrors.price && <p className="text-red-400 text-sm">{editErrors.price}</p>}

            <input
              className="w-full p-3 rounded-xl bg-[#1e1e38]"
              value={editingToy.category}
              onChange={e => setEditingToy({ ...editingToy, category: e.target.value })}
            />
            {editErrors.category && <p className="text-red-400 text-sm">{editErrors.category}</p>}

            <div className="flex gap-3">
              <button
                onClick={updateToy}
                className="px-6 py-3 bg-emerald-600 rounded-xl"
              >
                Update
              </button>
              <button
                onClick={() => setEditingToy(null)}
                className="px-6 py-3 bg-gray-600 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        {confirmDelete && (
          <div className="bg-[#16162a] p-6 rounded-2xl space-y-4">
            <p>
              Delete <b>{confirmDelete.name}</b>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteToy(confirmDelete.id)}
                className="px-6 py-3 bg-red-600 rounded-xl"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-6 py-3 bg-gray-600 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
