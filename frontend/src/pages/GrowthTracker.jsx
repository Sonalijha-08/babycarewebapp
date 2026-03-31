import { useEffect, useState } from "react";
import api from "../api/axios";
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
import { Line, Bar } from "react-chartjs-2";
import { BarElement } from 'chart.js';
import "./GrowthTracker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      fetchRecords(decoded.id);
    }
  }, []);

  const fetchRecords = async (id) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/growthtracker/${id}`);
      setRecords(res.data);
    } catch (error) {
      console.error('Failed to fetch growth records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this growth record?')) return;

    try {
      await api.delete(`/growthtracker/${id}`);
      fetchRecords(userId);
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.date) newErrors.date = 'Date is required';
    if (!form.height || form.height <= 0) newErrors.height = 'Height must be > 0';
    if (!form.weight || form.weight <= 0) newErrors.weight = 'Weight must be > 0';
    if (form.headCircumference && form.headCircumference <= 0) newErrors.headCircumference = 'Head circumference must be > 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addGrowth = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post("/growthtracker/add", {
        ...form,
        userId,
        height: Number(form.height),
        weight: Number(form.weight),
      });

      setForm({ date: "", height: "", weight: "", notes: "" });
      setErrors({});
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

  const heightColors = records.map((_, i) =>
  ['#ff5fa2','#ff7eb3','#ec4899','#f472b6','#db2777','#ff85c1'][i % 6]
);
const weightColors = records.map((_, i) =>
  ['#6366f1','#818cf8','#a78bfa','#7c3aed','#8b5cf6','#4f46e5'][i % 6]
);

const barChartData = {
  labels: records.map(r => r.date),
  datasets: [
    {
      label: 'Height (cm)',
      data: records.map(r => r.height),
      backgroundColor: heightColors,
      borderColor: heightColors,
      borderRadius: 10,
      borderSkipped: false,
      barPercentage: 0.45,
    },
    {
      label: 'Weight (kg)',
      data: records.map(r => r.weight),
      backgroundColor: weightColors,
      borderColor: weightColors,
      borderRadius: 10,
      borderSkipped: false,
      barPercentage: 0.45,
    },
  ],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#ff5fa2',
      bodyColor: '#555',
      borderColor: '#ffb3d4',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#aaa' }, border: { display: false } },
    y: { grid: { color: 'rgba(255,180,220,0.15)' }, ticks: { color: '#aaa' }, border: { display: false } },
  },
  animation: {
    duration: 1000,
  },
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
                disabled={Object.keys(errors).length > 0}
                style={{ 
                  background: Object.keys(errors).length > 0 ? '#ccc' : 'linear-gradient(135deg, #ff5fa2, #ff85b2)', 
                  color: 'white', padding: '10px 20px', border: 'none', borderRadius: '25px', cursor: Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer', fontSize: '16px' 
                }}
              >
                {Object.keys(errors).length > 0 ? 'Fix errors above' : 'Save Growth Record'}
              </button>
              {Object.keys(errors).length > 0 && (
                <div style={{ color: '#ff5fa2', fontSize: '14px', textAlign: 'center' }}>
                  Please fix the errors above before submitting
                </div>
              )}
            </form>
          </div>
        )}

{activeTab === "chart" && (
  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.2)', marginTop: '20px' }}>
    <h2 style={{ color: '#ff5fa2', marginBottom: '20px' }}>Growth Chart</h2>

    {/* Custom Legend */}
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: '#888' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ec4899', display: 'inline-block' }}></span>
        Height (cm)
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6366f1', display: 'inline-block' }}></span>
        Weight (kg)
      </span>
    </div>

    <div style={{ height: '400px', position: 'relative' }}>
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
          Loading chart...
        </div>
      ) : records.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3>No growth data yet</h3>
          <p>Add some growth records to see the chart!</p>
        </div>
      ) : (
        <>
          {console.log('Chart records:', records)}
          <Bar data={barChartData} options={barChartOptions} />
        </>
      )}
    </div>
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
                        <button 
                          onClick={() => deleteRecord(r._id)}
                          style={{ color: '#ff5fa2', border: 'none', background: 'none', cursor: 'pointer' }}
                          title="Delete record"
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
