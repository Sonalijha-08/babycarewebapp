import React, { useState, useEffect } from "react";
import api from "../src/api/axios";
import { jwtDecode } from "jwt-decode";
import "./feedinglog.css";

const FeedingLog = () => {
  const [activeTab, setActiveTab] = useState("log");
  const [logs, setLogs] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    amount: '',
    duration: '',
    side: '',
    notes: ''
  });

  const addFeeding = async (date, time, type, amount, notes) => {
    try {
      await api.post("/feeding/add", {
        date,
        time,
        type,
        amount,
        notes,
      });
      fetchFeedings();
    } catch (error) {
      console.error("Error adding feeding", error);
    }
  };

  const fetchFeedings = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const res = await api.get(`/feeding/${decoded.id}`);
      setFeedings(res.data);
    } catch (error) {
      console.error("Error fetching feedings", error);
    }
  };

  // 👇 Call it when page loads
  useEffect(() => {
    fetchFeedings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFeeding(formData.date, formData.time, formData.type, formData.amount, formData.notes);
    setFormData({
      date: '',
      time: '',
      type: '',
      amount: '',
      duration: '',
      side: '',
      notes: ''
    });
  };

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const todayFeedings = feedings.filter(feeding => feeding.date === today).length;
  const totalAmount = feedings.reduce((sum, feeding) => sum + (parseFloat(feeding.amount) || 0), 0);
  const lastFeeding = feedings.length > 0 ? feedings[feedings.length - 1].time : 'No feedings yet';
  return (
    <div className="feeding-page">
      <div className="feeding-container">

        {/* Header */}
        <div className="feeding-header">
          <h1>🍼 Feeding Log</h1>
          <p>Track your baby's feeding schedule and patterns</p>
        </div>

        {/* Stats Cards */}
        <div className="feeding-stats">
          <div className="stat-card">
            <span className="stat-title">Today's Feedings</span>
            <span className="stat-value">{todayFeedings}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Amount</span>
            <span className="stat-value">{totalAmount} ml</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Last Feeding</span>
            <span className="stat-value">{lastFeeding}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="feeding-actions">
          <button
            onClick={() => setActiveTab("log")}
            className={`tab ${activeTab === "log" ? "active" : ""}`}
          >
            Feed Log
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
            + Add Feeding
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "log" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Add New Feeding</h2>
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
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Breastmilk">Breastmilk</option>
                    <option value="Formula">Formula</option>
                    <option value="Solid">Solid</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Amount (ml)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    placeholder="e.g. 120"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    placeholder="e.g. 15 min"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Side</label>
                  <select
                    name="side"
                    value={formData.side}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                  >
                    <option value="">Select Side</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '60px' }}
                  placeholder="Additional notes..."
                />
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #ff5fa2, #ff85b2)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '16px' }}
              >
                Save Feeding
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="feeding-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Side</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedings.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="8">No feeding records yet</td>
                  </tr>
                ) : (
                  feedings.map((feeding) => (
                    <tr key={feeding._id}>
                      <td>{feeding.date}</td>
                      <td>{feeding.time}</td>
                      <td>{feeding.type}</td>
                      <td>{feeding.amount} ml</td>
                      <td>{feeding.duration}</td>
                      <td>{feeding.side}</td>
                      <td>{feeding.notes}</td>
                      <td>
                        <button
                          style={{ color: '#ff5fa2', border: 'none', background: 'none', cursor: 'pointer' }}
                          onClick={() => deleteFeeding(feeding._id)}
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
};

export default FeedingLog;
