import "./landing.css";
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">babi 💗</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#get-started">Get Started</a>
          <button className="nav-btn" onClick={() => navigate('/login')}>Let's Go</button>
        </div>
      </nav>
      {/* HERO SECTION */}
<section className="hero">
  <div className="hero-left">
    <h1>
      Smart Baby <br />
      Health & <br />
      Parenting Support
    </h1>

    <p>
      Track, monitor, and manage your baby's daily care,
      health records, and growth with ease. BabyCare+
      makes parenting organized and stress-free.
    </p>

    <div className="hero-buttons">
      <button className="primary-btn">Get Started Free</button>
    </div>

    <div className="hero-tags">
      <span>🍼 Daily Tracking</span>
      <span>📊 Growth Charts</span>
      <span>💉 Vaccination Alerts</span>
      <span>📁 Health Records</span>
    </div>
  </div>

  <div className="hero-right">
    <div className="dashboard-card">
      <h3>👶 Baby Dashboard</h3>
      <p>
        Monitor feeding, sleep, and growth all in one place
      </p>
      <div className="dashboard-icon">📱</div>
    </div>
  </div>
</section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="feature-card">
          <img src="/health.png" alt="Health" />
          <h3>Health Records</h3>
          <p>
            Store medical checkups, doctor visits, and prescriptions
            with easy access to complete health history.
          </p>
        </div>

        <div className="feature-card">
          <img src="/parenting.png" alt="Parenting" />
          <h3>Parenting Guidance</h3>
          <p>
            Age-specific tips, baby care suggestions, and health
            articles for informed parenting.
          </p>
        </div>

        <div className="feature-card">
          <img src="report.png" alt="Reports" />
          <h3>Reports & Visualization</h3>
          <p>
            Interactive graphs for growth trends and comprehensive
            monthly/weekly activity summaries.
          </p>
        </div>

        <div className="feature-card">
          <img src="/export.png" alt="Export" />
          <h3>Export & Backup</h3>
          <p>
            Export records as PDF/CSV and backup data securely
            to cloud storage for peace of mind.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="get-started">
        <h1>Ready to Make Parenting Easier?</h1>
        <p>
          Join thousands of parents who trust BabyCare+ to keep their
          baby's health records organized and accessible anytime,
          anywhere.
        </p>

        <div className="cta-buttons">
          <button className="cta-primary" onClick={() => navigate('/login')}>Start Your Free Trial</button>
          <button className="cta-secondary" onClick={() => navigate('/login')}>Watch Demo</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 BabyCare+ | Making Parenting Easier, One Day at a Time</p>
        <p>Built with MongoDB, Express.js, React, and Node.js</p>
      </footer>
    </>
  );
}
