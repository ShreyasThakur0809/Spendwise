import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return;

    try {
      if (editingId) {
        await axios.put(`/api/expenses/${editingId}`, form);
      } else {
        await axios.post("/api/expenses", form);
      }

      setForm({ title: "", amount: "", category: "", date: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split("T")[0], // ensure correct format for date input
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", amount: "", category: "", date: "" });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 mb-6 border p-4 rounded"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2"
        />

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Expense" : "Add Expense"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li key={exp._id} className="border p-3 rounded flex justify-between items-start">
            <div>
              <div className="font-semibold">{exp.title}</div>
              <div>₹{exp.amount}</div>
              <div>{exp.category || "No category"}</div>
              <div>{new Date(exp.date).toLocaleDateString()}</div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(exp)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp._id)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
