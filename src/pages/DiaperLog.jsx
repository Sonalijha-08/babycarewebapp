import "./Diperlog.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function DiaperLog() {
  const [activeTab, setActiveTab] = useState("log");
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    time: '',
    type: '',
    notes: ''
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
      const response = await axios.get(`http://localhost:5000/api/diaperlog/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching diaper logs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/diaperlog/add', {
        userId,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ time: '', type: '', notes: '' });
      fetchLogs();
    } catch (error) {
      console.error('Error adding diaper log:', error);
    }
  };

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const todayDiapers = logs.filter(log => log.date === today).length;
  const wetDiapers = logs.filter(log => log.type === 'Wet').length;
  const dirtyDiapers = logs.filter(log => log.type === 'Dirty').length;

  return (
    <div className="diaper-page">
      <div className="diaper-container">

        {/* Header */}
        <div className="diaper-header">
          <h1>🧷 Diaper Log</h1>
          <p>Track diaper changes & baby comfort</p>
        </div>

        {/* Stats Cards */}
        <div className="diaper-stats">
          <div className="stat-card">
            <span className="stat-title">Today's Diapers</span>
            <span className="stat-value">{todayDiapers}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Wet Diapers</span>
            <span className="stat-value">{wetDiapers}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Dirty Diapers</span>
            <span className="stat-value">{dirtyDiapers}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="diaper-actions">
          <button
            onClick={() => setActiveTab("log")}
            className={`tab ${activeTab === "log" ? "active" : ""}`}
          >
            Diaper Log
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
            + Add Diaper
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "log" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Add New Diaper Change</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  >
                    <option value="">Select Diaper Type</option>
                    <option value="Wet">Wet</option>
                    <option value="Dirty">Dirty</option>
                    <option value="Both">Wet & Dirty</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Notes</label>
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  value={formData.notes}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '60px' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #ff5fa2, #ff85b2)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '16px' }}
              >
                Save Diaper Change
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="diaper-table">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="4">No diaper records yet</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.time}</td>
                      <td>{log.type}</td>
                      <td>{log.notes}</td>
                      <td>
                        <button style={{ color: '#ff5fa2', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
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
 
