import "./sleepLog.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SleepLog() {
  const [activeTab, setActiveTab] = useState("log");
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    date: "",
    sleepTime: "",
    wakeTime: "",
    duration: "",
    notes: "",
  });
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      fetchLogs(decoded.id);
    }
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/sleeplog/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching sleep logs:', error);
    }
  };

  const deleteSleepLog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/sleeplog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLogs();
    } catch (error) {
      console.error('Error deleting sleep log:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sleeplog/add', {
        userId,
        ...form
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ date: "", sleepTime: "", wakeTime: "", duration: "", notes: "" });
      fetchLogs();
    } catch (error) {
      console.error('Error adding sleep log:', error);
    }
  };

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const todaySleeps = logs.filter(log => log.date === today).length;
  const totalSleeps = logs.length;
  const averageDuration = logs.length > 0 ? (logs.reduce((sum, log) => sum + parseFloat(log.duration.split('h')[0]) * 60 + parseFloat(log.duration.split('h')[1]?.split('m')[0] || 0), 0) / logs.length).toFixed(0) : 0;

  return (
    <div className="sleep-page">
      <div className="sleep-container">

        {/* Header */}
        <div className="sleep-header">
          <h1>😴 Sleep Log</h1>
          <p>Track your baby's sleep schedule and patterns</p>
        </div>

        {/* Stats Cards */}
        <div className="sleep-stats">
          <div className="stat-card">
            <span className="stat-title">Today's Sleeps</span>
            <span className="stat-value">{todaySleeps}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Sleeps</span>
            <span className="stat-value">{totalSleeps}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Avg Duration</span>
            <span className="stat-value">{averageDuration} min</span>
          </div>
        </div>

        {/* Actions */}
        <div className="sleep-actions">
          <button
            onClick={() => setActiveTab("log")}
            className={`tab ${activeTab === "log" ? "active" : ""}`}
          >
            Sleep Log
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`tab ${activeTab === "history" ? "active" : ""}`}
          >
            History
          </button>

          <button
            onClick={() => setActiveTab("log")}
            className="add-btn"
          >
            + Add Sleep
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "log" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Add New Sleep</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Sleep Time</label>
                  <input
                    type="time"
                    name="sleepTime"
                    placeholder="Start Time"
                    value={form.sleepTime}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Wake Time</label>
                  <input
                    type="time"
                    name="wakeTime"
                    placeholder="End Time"
                    value={form.wakeTime}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration (e.g. 2h 30m)"
                    value={form.duration}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Notes</label>
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '60px' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #ff5fa2, #ff85b2)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '16px' }}
              >
                Save Sleep
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="sleep-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sleep Time</th>
                  <th>Wake Time</th>
                  <th>Duration</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No sleep records yet</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.date}</td>
                      <td>{log.sleepTime}</td>
                      <td>{log.wakeTime}</td>
                      <td>{log.duration}</td>
                      <td>{log.notes}</td>
                      <td>
                        <button
                          style={{ color: '#ff5fa2', border: 'none', background: 'none', cursor: 'pointer' }}
                          onClick={() => deleteSleepLog(log._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
