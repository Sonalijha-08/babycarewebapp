import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">BabyCare</div>
        <ul className="nav-links">
          <li>Dashboard</li>
          <li>Logs</li>
          <li>Health</li>
          <li>Growth</li>
          <li>Community</li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome Back</h1>
          <p>
            A calm, simple space designed to support you through every step
            of your parenting journey.
          </p>
        </div>

        <div className="hero-image">
          <img
            src="https://i.pinimg.com/736x/aa/39/d0/aa39d0dff0aaa00d6fafe2146ef4e914.jpg"
            alt="Baby Illustration"
          />
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="soft-description">
        <p>
          Every baby is unique, and every moment matters.  
          Care with confidence, love with patience, and let each day
          build a healthy and happy future.
        </p>
      </section>

      {/* MODULES */}
      <section className="modules">
        <Link to="/feedingLog" className="module-circle" title="Feeding Log">🍼</Link>
        <Link to="/sleeplog" className="module-circle" title="Sleep Log">😴</Link>
        <Link to="/diaperLog" className="module-circle" title="Diaper Log">🧷</Link>
        <Link to="/growthTracker" className="module-circle" title="Growth Tracker">📈</Link>
        <Link to="/vaccinations" className="module-circle" title="Vaccinations">💉</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 BabyCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
