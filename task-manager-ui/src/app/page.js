'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  async function fetchTasks() {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const res = await fetch(`${API}/api/task?${params.toString()}`);
    const data = await res.json();
    setTasks(data);
  }

  async function createTask(e) {
    e.preventDefault();
    if (!title) return alert('Title is required');

    await fetch(`${API}/api/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    setTitle('');
    setDescription('');
    fetchTasks();
  }

  async function updateStatus(id, newStatus) {
    await fetch(`${API}/api/task/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/api/task/${id}`, { method: 'DELETE' });
    fetchTasks();
  }

  const statusColors = {
    pending: "badge bg-warning text-dark",
    "in-progress": "badge bg-info text-dark",
    completed: "badge bg-success"
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">📝 Task Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={createTask} className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success w-100">
            Add Task
          </button>
        </div>
      </form>

      {/* Search & Filter */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="🔍 Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-2">
          <button onClick={fetchTasks} className="btn btn-secondary w-100">
            Refresh
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="list-group">
        {tasks.length > 0 ? (
          tasks.map(t => (
            <div key={t._id} className="list-group-item mb-2 shadow-sm rounded">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-1">{t.title}</h5>
                <span className={statusColors[t.status] || "badge bg-secondary"}>
                  {t.status}
                </span>
              </div>
              <p className="mb-2">{t.description}</p>
              <div className="d-flex gap-2">
                {["pending", "in-progress", "completed"].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(t._id, s)}
                    className="btn btn-sm btn-outline-primary"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => deleteTask(t._id)}
                  className="btn btn-sm btn-outline-danger ms-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No tasks found.</p>
        )}
      </div>
    </div>
  );
}
