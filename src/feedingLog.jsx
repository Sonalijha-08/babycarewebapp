import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./feeding.css";

const FeedingLog = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    type: "",
    amount: "",
    time: "",
    notes: "",
  });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id); // Assuming the payload has 'id'
      fetchLogs(decoded.id);
    }
  }, []);

  const fetchLogs = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/feeding/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/feeding/add", {
        userId,
        ...form,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ type: "", amount: "", time: "", notes: "" });
      fetchLogs(userId); // Refresh logs
    } catch (error) {
      console.error("Error adding log:", error);
      alert("Failed to add feeding log");
    }
  };

  return (
    <div className="feeding-wrapper">
      <div className="feeding-card-main">
        <h1 className="feeding-heading">Feeding Log</h1>
        <p className="feeding-desc">
          A gentle way to track your baby’s nourishment
        </p>

        <div className="feeding-grid">
          {/* FORM */}
          <form className="feeding-form-animated" onSubmit={handleSubmit}>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Feeding Type</option>
              <option>Breastmilk</option>
              <option>Formula</option>
              <option>Solid</option>
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount (ml)"
              value={form.amount}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />

            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
            />

            <button type="submit">Add Entry</button>
          </form>

          {/* LOG LIST */}
          <div className="feeding-log-list">
            {logs.length === 0 ? (
              <p className="empty-log">No feeding records yet</p>
            ) : (
              logs.map((log, index) => (
                <div className="feeding-log-item" key={index}>
                  <div>
                    <strong>{log.type}</strong>
                    <span>{log.amount}</span>
                  </div>
                  <p>{log.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedingLog;
