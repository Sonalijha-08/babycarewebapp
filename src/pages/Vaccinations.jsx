import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "./vaccinations.css";

const Vaccination = () => {
  const [activeTab, setActiveTab] = useState("log");
  const [logs, setLogs] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    vaccineName: '',
    amount: '',
    duration: '',
    side: '',
    notes: ''
  });

  const addVaccination = async (date, time, vaccineName, amount, duration, side, notes) => {
    try {
      await api.post("/vaccinations/add", {
        date,
        time,
        vaccineName,
        amount,
        duration,
        side,
        notes,
      });
      fetchVaccinations();
    } catch (error) {
      console.error("Error adding vaccination", error);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const res = await api.get(`/vaccinations/${decoded.id}`);
      setVaccinations(res.data);
    } catch (error) {
      console.error("Error fetching vaccinations", error);
    }
  };

  // 👇 Call it when page loads
  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addVaccination(formData.date, formData.time, formData.vaccineName, formData.amount, formData.duration, formData.side, formData.notes);
    setFormData({
      date: '',
      time: '',
      vaccineName: '',
      amount: '',
      duration: '',
      side: '',
      notes: ''
    });
  };

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const todayVaccinations = vaccinations.filter(vaccination => vaccination.date === today).length;
  const totalVaccinations = vaccinations.length;
  const lastVaccination = vaccinations.length > 0 ? vaccinations[vaccinations.length - 1].time : 'No vaccinations yet';
  return (
    <div className="vaccine-page">
      <div className="vaccine-container">

        {/* Header */}
        <div className="vaccine-header">
          <h1>💉 Vaccination Log</h1>
          <p>Track your baby's vaccination schedule and records</p>
        </div>

        {/* Stats Cards */}
        <div className="vaccine-stats">
          <div className="stat-card">
            <span className="stat-title">Today's Vaccinations</span>
            <span className="stat-value">{todayVaccinations}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Vaccinations</span>
            <span className="stat-value">{totalVaccinations}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Last Vaccination</span>
            <span className="stat-value">{lastVaccination}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="vaccine-actions">
          <button
            onClick={() => setActiveTab("log")}
            className={`tab ${activeTab === "log" ? "active" : ""}`}
          >
            Vaccination Log
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
            + Add Vaccination
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "log" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Add New Vaccination</h2>
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
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Vaccine Name</label>
                  <input
                    type="text"
                    name="vaccineName"
                    value={formData.vaccineName}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    placeholder="e.g. MMR"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Amount (ml)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    placeholder="e.g. 0.5"
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
                Save Vaccination
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div className="vaccine-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Vaccine Name</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Side</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaccinations.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="8">No vaccination records yet</td>
                  </tr>
                ) : (
                  vaccinations.map((vaccination) => (
                    <tr key={vaccination._id}>
                      <td>{vaccination.date}</td>
                      <td>{vaccination.time}</td>
                      <td>{vaccination.vaccineName}</td>
                      <td>{vaccination.amount} ml</td>
                      <td>{vaccination.duration}</td>
                      <td>{vaccination.side}</td>
                      <td>{vaccination.notes}</td>
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
};

export default Vaccination;
