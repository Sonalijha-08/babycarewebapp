import React, { useState } from "react";
import "./sleepLog.css";

const SleepLog = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    start: "",
    end: "",
    duration: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLogs([...logs, form]);
    setForm({ start: "", end: "", duration: "" });
  };

  return (
    <div className="sleep-wrapper">
      <div className="sleep-card">
        <h1 className="sleep-title">Sleep Log</h1>
        <p className="sleep-desc">
          Track your baby’s peaceful sleep cycles
        </p>

        <div className="sleep-grid">
          {/* FORM */}
          <form className="sleep-form" onSubmit={handleSubmit}>
            <input
              type="time"
              name="start"
              value={form.start}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="end"
              value={form.end}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g. 1h 30m)"
              value={form.duration}
              onChange={handleChange}
              required
            />

            <button type="submit">Add Sleep Record</button>
          </form>

          {/* LOGS */}
          <div className="sleep-log-list">
            {logs.length === 0 ? (
              <p className="sleep-empty">No sleep records yet</p>
            ) : (
              logs.map((log, index) => (
                <div className="sleep-log-item" key={index}>
                  <div>
                    <strong>🛌 Sleep</strong>
                    <span>{log.duration}</span>
                  </div>
                  <p>
                    {log.start} – {log.end}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepLog;
