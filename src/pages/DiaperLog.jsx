
import { useState, useEffect } from "react";
import "./Diperlog.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function DiaperLog() {
  const [activeTab, setActiveTab] = useState("log");
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    notes: '',
    setReminder: false,
    reminderMinutes: 15
  });
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLogs(userId);
    }
  }, [userId]);

  const fetchLogs = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/diaperlog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching diaper logs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
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
      setFormData({ date: '', time: '', type: '', notes: '', setReminder: false, reminderMinutes: 15 });
      fetchLogs(userId);
    } catch (error) {
      console.error('Error adding diaper log:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/diaperlog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLogs(userId);
    } catch (error) {
      console.error('Error deleting diaper log:', error);
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
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}> Reminder Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
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
              
              {/* Email Reminder Section */}
              <div style={{ background: '#fff5f9', padding: '15px', borderRadius: '10px', border: '1px solid #ffc8dd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    id="setReminder"
                    name="setReminder"
                    checked={formData.setReminder}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="setReminder" style={{ color: '#ff5fa2', fontWeight: '500', cursor: 'pointer' }}>
                    📧 Send me an email reminder
                  </label>
                </div>
                
                {formData.setReminder && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '14px' }}>
                      Remind me before:
                    </label>
                    <select
                      name="reminderMinutes"
                      value={formData.reminderMinutes}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    
                    </select>
                  </div>
                )}
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
                        <button 
                          onClick={() => handleDelete(log._id)} 
                          style={{ color: '#ff5fa2', border: 'none', background: 'none', cursor: 'pointer' }}
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
 
