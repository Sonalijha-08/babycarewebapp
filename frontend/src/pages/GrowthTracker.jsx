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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this growth record?')) return;

    try {
      await api.delete(`/growthtracker/${id}`);
      fetchRecords(userId);
    } catch (error) {
      console.error('Error deleting record:', error);
      alert(error.response?.data?.message || 'Failed to delete record');
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!form.height) {
      newErrors.height = 'Height is required';
    } else if (Number(form.height) < 10) {
      newErrors.height = 'Height must be at least 10 cm';
    }

    if (!form.weight) {
      newErrors.weight = 'Weight is required';
    } else if (Number(form.weight) < 0.1) {
      newErrors.weight = 'Weight must be at least 0.1 kg';
    }

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
      alert(error.response?.data?.message || 'Failed to save growth record. Please check validation rules.');
    }
  };

  // Calculate summary (table log order should remain newest first)
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today).length;
  const totalRecords = records.length;
  const averageHeight = records.length > 0 ? (records.reduce((sum, r) => sum + r.height, 0) / records.length).toFixed(1) : 0;
  const averageWeight = records.length > 0 ? (records.reduce((sum, r) => sum + r.weight, 0) / records.length).toFixed(1) : 0;

  // Chart records must be chronological (oldest to newest)
  const chartRecords = [...records].reverse();

  const heightColors = chartRecords.map((_, i) =>
    ['#ff5fa2', '#ff7eb3', '#ec4899', '#f472b6', '#db2777', '#ff85c1'][i % 6]
  );
  const weightColors = chartRecords.map((_, i) =>
    ['#6366f1', '#818cf8', '#a78bfa', '#7c3aed', '#8b5cf6', '#4f46e5'][i % 6]
  );

  const barChartData = {
    labels: chartRecords.map(r => r.date),
    datasets: [
      {
        label: 'Height (cm)',
        data: chartRecords.map(r => r.height),
        backgroundColor: heightColors,
        borderColor: heightColors,
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.45,
      },
      {
        label: 'Weight (kg)',
        data: chartRecords.map(r => r.weight),
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
          <div className="growth-card growth-form-section">
            <h2>Add New Growth Record</h2>
            <form onSubmit={addGrowth} className="growth-form">
              <div className="growth-form-grid">
                <div className="form-group">
                  <label htmlFor="date-input">Date</label>
                  <input
                    id="date-input"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`growth-input ${errors.date ? 'input-error' : ''}`}
                    required
                  />
                  {errors.date && <span className="field-error-message">{errors.date}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="height-input">Height (cm)</label>
                  <input
                    id="height-input"
                    type="number"
                    step="any"
                    name="height"
                    placeholder="Height (cm) - Min 10"
                    value={form.height}
                    onChange={handleChange}
                    className={`growth-input ${errors.height ? 'input-error' : ''}`}
                    required
                  />
                  {errors.height && <span className="field-error-message">{errors.height}</span>}
                </div>
              </div>
              <div className="growth-form-grid">
                <div className="form-group">
                  <label htmlFor="weight-input">Weight (kg)</label>
                  <input
                    id="weight-input"
                    type="number"
                    step="any"
                    name="weight"
                    placeholder="Weight (kg) - Min 0.1"
                    value={form.weight}
                    onChange={handleChange}
                    className={`growth-input ${errors.weight ? 'input-error' : ''}`}
                    required
                  />
                  {errors.weight && <span className="field-error-message">{errors.weight}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="notes-input">Notes</label>
                  <textarea
                    id="notes-input"
                    name="notes"
                    placeholder="Notes (optional)"
                    value={form.notes}
                    onChange={handleChange}
                    className="growth-textarea"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="growth-submit-btn"
              >
                Save Growth Record
              </button>
            </form>
          </div>
        )}

        {activeTab === "chart" && (
          <div className="growth-card growth-chart-section">
            <h2>Growth Chart</h2>

            {/* Custom Legend */}
            <div className="custom-legend">
              <span className="legend-item">
                <span className="legend-dot height-dot"></span>
                Height (cm)
              </span>
              <span className="legend-item">
                <span className="legend-dot weight-dot"></span>
                Weight (kg)
              </span>
            </div>

            <div className="chart-container-wrapper">
              {isLoading ? (
                <div className="chart-placeholder loading">
                  Loading chart...
                </div>
              ) : records.length === 0 ? (
                <div className="chart-placeholder empty">
                  <div className="empty-icon">📊</div>
                  <h3>No growth data yet</h3>
                  <p>Add some growth records to see the chart!</p>
                </div>
              ) : (
                <Bar data={barChartData} options={barChartOptions} />
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
                    <tr key={r._id || i}>
                      <td>{r.date}</td>
                      <td>{r.height} cm</td>
                      <td>{r.weight} kg</td>
                      <td>{r.notes}</td>
                      <td>
                        <button 
                          onClick={() => deleteRecord(r._id)}
                          className="growth-delete-btn"
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
