import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All Tasks", "Work", "Personal", "School"];

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState("All Tasks");
  const [showNew, setShowNew] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", date: "", category: "", reminder: false });
  const [editIdx, setEditIdx] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks(token);
    // eslint-disable-next-line
  }, [category]);

  function fetchTasks(token) {
    axios.get("http://localhost:5000/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (category === "All Tasks") setTasks(res.data);
      else setTasks(res.data.filter(task => task.category === category));
    });
  }

  function handleAddTask(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    axios.post("http://localhost:5000/tasks", newTask, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setShowNew(false);
      setNewTask({ text: "", date: "", category: "", reminder: false });
      fetchTasks(token);
    });
  }

  function handleEditTask(idx, updated) {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:5000/tasks/${idx}`, updated, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchTasks(token));
  }

  function handleDeleteTask(idx) {
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:5000/tasks/${idx}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchTasks(token));
  }

  function handleToggleTask(idx) {
    const token = localStorage.getItem("token");
    axios.post(`http://localhost:5000/tasks/${idx}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchTasks(token));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fafbfc" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: "#fff", borderRight: "1px solid #e5e7eb",
        padding: "30px 18px", boxShadow: "0 1px 6px #0f0f0f0a"
      }}>
        <div style={{ fontWeight: "bold", fontSize: 20, color: "#11998e", marginBottom: 24 }}>
          <span style={{ marginRight: 6, fontSize: 18 }}>✅</span>Smart To-Do List
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat} style={{ marginBottom: 11 }}>
            <button
              style={{
                background: category === cat ? "linear-gradient(90deg,#38ef7d,#11998e)" : "none",
                color: category === cat ? "#fff" : "#222",
                fontWeight: category === cat ? 600 : 500,
                border: "none", width: "100%", textAlign: "left", padding: "9px 12px",
                borderRadius: 7, cursor: "pointer", boxShadow: category === cat ? "0 2px 8px #11998e33" : "none"
              }}
              onClick={() => setCategory(cat)}
            >
              {category === cat && <span style={{ marginRight: 8 }}>🟢</span>}
              {cat}
            </button>
          </div>
        ))}
        <button
          style={{
            marginTop: 40, background: "#e7f8ef", color: "#11998e", border: "none",
            fontWeight: "bold", padding: "8px 18px", borderRadius: 6, width: "100%"
          }}
        >Export History</button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "38px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, color: "#11998e", fontWeight: "bold" }}>Task List</div>
          <button
            style={{
              background: "#38ef7d", color: "#fff", border: "none",
              fontWeight: "bold", borderRadius: "50%", width: 42, height: 42, fontSize: 26,
              boxShadow: "0 2px 12px #11998e33", cursor: "pointer"
            }}
            onClick={() => setShowNew(true)}
          >+</button>
        </div>

        {/* Task List */}
        <div>
          {tasks.length === 0 && (
            <div style={{ color: "#aaa", fontSize: 16, marginTop: 40 }}>No tasks in this category.</div>
          )}
          {tasks.map((task, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff", marginBottom: 18, padding: "16px 22px",
                borderRadius: 10, boxShadow: "0 2px 12px #11998e22", display: "flex", alignItems: "center"
              }}
            >
              <div style={{
                fontWeight: "bold", fontSize: 16, flex: 1, color: "#222"
              }}>
                {task.text}
                <div style={{ fontSize: 13, color: "#888", fontWeight: 500, marginTop: 2 }}>
                  Date: {task.date}
                </div>
              </div>
              {task.reminder && <span style={{ fontSize: 19, marginRight: 8, color: "#ff9800" }}>🔔</span>}
              <button onClick={() => handleToggleTask(idx)} style={{ marginLeft: 10, border: "none", background: "none", cursor: "pointer" }}>
                {task.done ? "✔️" : "▲"}
              </button>
              <button
                onClick={() => {
                  setEditIdx(idx);
                  setNewTask(task);
                  setShowNew(true);
                }}
                style={{ marginLeft: 10, border: "none", background: "none", cursor: "pointer" }}>✏️</button>
              <button onClick={() => handleDeleteTask(idx)} style={{ marginLeft: 10, border: "none", background: "none", cursor: "pointer" }}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* New/Edit Task Modal */}
      {showNew && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "#0004", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99
        }}>
          <form
            style={{
              background: "#fff", borderRadius: 12, padding: 36, minWidth: 340,
              boxShadow: "0 2px 18px #11998e33", position: "relative"
            }}
            onSubmit={e => {
              if (editIdx !== null) {
                handleEditTask(editIdx, newTask);
                setEditIdx(null);
                setShowNew(false);
                setNewTask({ text: "", date: "", category: "", reminder: false });
                fetchTasks(localStorage.getItem("token"));
              } else {
                handleAddTask(e);
              }
            }}
          >
            <span
              style={{
                position: "absolute", right: 18, top: 18, cursor: "pointer", fontSize: 17, color: "#888"
              }}
              onClick={() => {
                setShowNew(false);
                setEditIdx(null);
                setNewTask({ text: "", date: "", category: "", reminder: false });
              }}
            >✖</span>
            <h3 style={{ marginBottom: 16, color: "#11998e", fontWeight: 600, fontSize: 18 }}>
              {editIdx !== null ? "Edit Task" : "New Task"}
            </h3>
            <label style={{ fontSize: 15, color: "#222", marginBottom: 7 }}>Task Name</label>
            <input
              type="text"
              value={newTask.text}
              onChange={e => setNewTask({ ...newTask, text: e.target.value })}
              placeholder="Enter task name"
              style={{ width: "100%", marginBottom: 14, padding: 9, borderRadius: 6, border: "1px solid #eee", fontSize: 15 }}
              required
            />
            <label style={{ fontSize: 15, color: "#222", marginBottom: 7 }}>Due Date</label>
            <input
              type="date"
              value={newTask.date}
              onChange={e => setNewTask({ ...newTask, date: e.target.value })}
              style={{ width: "100%", marginBottom: 14, padding: 9, borderRadius: 6, border: "1px solid #eee", fontSize: 15 }}
            />
            <label style={{ fontSize: 15, color: "#222", marginBottom: 7 }}>Category</label>
            <select
              value={newTask.category}
              onChange={e => setNewTask({ ...newTask, category: e.target.value })}
              style={{ width: "100%", marginBottom: 14, padding: 9, borderRadius: 6, border: "1px solid #eee", fontSize: 15 }}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.slice(1).map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <label style={{ display: "block", marginBottom: 10 }}>
              Set Reminder
              <input
                type="checkbox"
                checked={newTask.reminder}
                onChange={e => setNewTask({ ...newTask, reminder: e.target.checked })}
                style={{ marginLeft: 8, accentColor: "#38ef7d" }}
              />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                style={{ background: "#38ef7d", color: "#fff", border: "none", padding: "9px 24px", borderRadius: 6, fontWeight: "bold", fontSize: 16 }}
              >{editIdx !== null ? "Update" : "Add"}</button>
              <button
                type="button"
                style={{ background: "#e5e7eb", color: "#222", border: "none", padding: "9px 24px", borderRadius: 6, fontSize: 16 }}
                onClick={() => {
                  setShowNew(false);
                  setEditIdx(null);
                  setNewTask({ text: "", date: "", category: "", reminder: false });
                }}
              >Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}