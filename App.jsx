import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId ? { ...task, text: input } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), text: input, completed: false },
      ]);
    }

    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const editTask = (task) => {
    setInput(task.text);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1 className="title">To-Do App</h1>
      <p className="subtitle">Organize your day, stay productive ✨</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="no-tasks">No Tasks Found</div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <span>{task.text}</span>
              </div>

              <div className="actions">
                <button onClick={() => editTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
