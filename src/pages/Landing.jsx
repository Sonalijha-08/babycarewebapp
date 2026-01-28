import { useNavigate } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>BabyCare+</h1>
          <p className="subtitle">
            A modern baby care management platform for parents.
          </p>

          <p className="description">
            BabyCare+ helps you securely track feeding schedules, sleep patterns,
            growth milestones, and health records — all in one organized system.
          </p>
        </div>

        <div className="hero-visual">
          {/* Professional abstract illustration (replace later if you want) */}
          <div className="abstract-shape"></div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <Feature
          title="Feeding Management"
          text="Log and review daily feeding schedules with clarity and accuracy."
        />
        <Feature
          title="Sleep Tracking"
          text="Monitor sleep cycles to understand your baby’s rest patterns."
        />
        <Feature
          title="Growth Records"
          text="Track height, weight, and growth milestones over time."
        />
        <Feature
          title="Health Notes"
          text="Maintain vaccination and health-related records securely."
        />
      </section>

      {/* FOOTER / LOGIN */}
      <footer className="landing-footer">
        <button onClick={() => navigate("/login")} className="login-btn">
          Login
        </button>
      </footer>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="feature-slide">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
