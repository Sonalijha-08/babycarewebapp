import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import "./GrowthTracker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GrowthTracker() {
  const [activeTab, setActiveTab] = useState("log");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    date: "",
    height: "",
    weight: "",
    notes: "",
  });

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      fetchRecords(decoded.id);
    }
  }, []);

  const fetchRecords = async (id) => {
    const res = await axios.get(
      `http://localhost:5000/api/growthtracker/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setRecords(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addGrowth = async (e) => {
    e.preventDefault();
    if (!form.date || !form.height || !form.weight) return alert("Fill all fields");

    try {
      const token = localStorage.getItem('token');
      await axios.post("http://localhost:5000/api/growthtracker/add", {
        ...form,
        userId,
        height: Number(form.height),
        weight: Number(form.weight),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ date: "", height: "", weight: "", notes: "" });
      fetchRecords(userId);
    } catch (error) {
      console.error('Error adding growth record:', error);
    }
  };

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today).length;
  const totalRecords = records.length;
  const averageHeight = records.length > 0 ? (records.reduce((sum, r) => sum + r.height, 0) / records.length).toFixed(1) : 0;
  const averageWeight = records.length > 0 ? (records.reduce((sum, r) => sum + r.weight, 0) / records.length).toFixed(1) : 0;

  const chartData = {
    labels: records.map(r => r.date),
    datasets: [
      {
        label: "Height (cm)",
        data: records.map(r => r.height),
        borderColor: "#ec4899",
        tension: 0.4,
      },
      {
        label: "Weight (kg)",
        data: records.map(r => r.weight),
        borderColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="growth-page">
      <div className="growth-container">

        {/* Header */}
        <div className="growth-header">
          <h1>📈 Growth Tracker</h1>
          <p>Track your baby's growth and development</p>
        </div>

        {/* Stats Cards */}
        <div className="growth-stats">
          <div className="stat-card">
            <span className="stat-title">Today's Records</span>
            <span className="stat-value">{todayRecords}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Total Records</span>
            <span className="stat-value">{totalRecords}</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Avg Height</span>
            <span className="stat-value">{averageHeight} cm</span>
          </div>

          <div className="stat-card">
            <span className="stat-title">Avg Weight</span>
            <span className="stat-value">{averageWeight} kg</span>
          </div>
        </div>

        {/* Actions */}
        <div className="growth-actions">
          <button
            onClick={() => setActiveTab("log")}
            className={`tab ${activeTab === "log" ? "active" : ""}`}
          >
            Growth Log
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`tab ${activeTab === "chart" ? "active" : ""}`}
          >
            Chart
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
            + Add Growth
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "log" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Add New Growth Record</h2>
            <form onSubmit={addGrowth} style={{ display: 'grid', gap: '15px' }}>
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
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={form.height}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={form.weight}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '60px' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ background: 'linear-gradient(135deg, #ff5fa2, #ff85b2)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '16px' }}
              >
                Save Growth Record
              </button>
            </form>
          </div>
        )}

        {activeTab === "chart" && (
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
            <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Growth Chart</h2>
            <Line data={chartData} />
          </div>
        )}

        {activeTab === "history" && (
          <div className="growth-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Height</th>
                  <th>Weight</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="5">No growth records yet</td>
                  </tr>
                ) : (
                  records.map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.height} cm</td>
                      <td>{r.weight} kg</td>
                      <td>{r.notes}</td>
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
