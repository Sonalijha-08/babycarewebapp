import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const modules = [
    { 
      id: 1, 
      icon: "🍼", 
      title: "Feeding Log", 
      color: "module-pink",
      route: "/feedingLog"
    },
    { 
      id: 2, 
      icon: "😴", 
      title: "Sleep Tracker", 
      color: "module-purple",
      route: "/sleeplog"
    },
    { 
      id: 3, 
      icon: "💉", 
      title: "Vaccination", 
      color: "module-blue",
      route: "/vaccinations"
    },
    { 
      id: 4, 
      icon: "🧷", 
      title: "Diaper Log", 
      color: "module-green",
      route: "/diaperLog"
    },
    { 
      id: 5, 
      icon: "📈", 
      title: "Growth Tracker", 
      color: "module-orange",
      route: "/growthTracker"
    },
    { 
      id: 6, 
      icon: "📝", 
      title: "Tips & Guidance", 
      color: "module-red",
      route: "#"
    }
  ];

  const benefits = [
    { icon: "🎯", text: "Easy to Use" },
    { icon: "🔒", text: "Secure & Private" },
    { icon: "📊", text: "Smart Insights" }
  ];

  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="logo pulse-animation">
            <span className="logo-icon">💗</span>
            <span className="logo-text">babi</span>
          </Link>

          <ul className="nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#modules">Modules</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <Link to="/profile" className="profile-btn">
            👤
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-card slide-up">
          <div className="hero-content">
            <h1 className="hero-title">
              Smart Baby <br />
              Care Starts <br />
              With <span className="hero-title-highlight pulse-animation">babi</span>
            </h1>
            <p className="hero-description">
              Track your baby's daily routine, health, and growth —
              all in one loving space 💕
            </p>
            <button className="cta-btn">
              Get Started
            </button>
          </div>

          <div className="hero-image-container float-animation">
            <div className="hero-image-glow pulse-animation"></div>
            <img
              src="https://i.pinimg.com/736x/5b/ff/98/5bff986de937c8694f96e53cbc766c94.jpg"
              alt="baby"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features fade-in" id="features">
        <div className="features-container scale-in">
          <div className="features-icon pulse-animation">✨</div>
          <h2 className="features-title">Why Parents Love babi</h2>
          <p className="features-subtitle">Simple. Caring. Reliable.</p>
          <p className="features-description">
            Designed to help parents manage baby care without stress,
            confusion, or missed moments. Every feature is crafted with
            love and care to make your parenting journey smoother.
          </p>
          
          <div className="features-benefits">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="benefit-item bounce-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <div className="benefit-text">{benefit.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="modules" id="modules">
        <div className="modules-container">
          <div className="modules-header">
            <h2 className="modules-title"> Hello parents! ✨</h2>
            <p className="modules-subtitle">
              Everything you need to track and care for your little one
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module, index) => (
              <Link
                key={module.id}
                to={module.route}
                className={`module-card ${module.color}`}
                onMouseEnter={() => setActiveModule(module.id)}
                onMouseLeave={() => setActiveModule(null)}
              >
                <div className="module-card-content">
                  <div className="module-icon">
                    {module.icon}
                  </div>
                  <h3 className="module-title">
                    {module.title}
                  </h3>
                </div>

                {activeModule === module.id && (
                  <div className="module-overlay">
                    <span className="module-overlay-text">
                      Click to explore →
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MESSAGE SECTION */}
      <section className="message">
        <div className="message-card">
          <div className="message-content">
            <h2 className="message-title">
              To All Loving Parents 💕
            </h2>
            <p className="message-text">
              Every smile, every tear, every milestone matters.
              babi is here to walk with you in this beautiful journey.
              Together, we'll celebrate the precious moments and navigate
              the challenges of parenthood with confidence and care.
            </p>
            <div className="message-icons">
              <span className="message-icon pulse-animation">👶</span>
              <span 
                className="message-icon pulse-animation" 
                style={{ animationDelay: '0.2s' }}
              >
                💖
              </span>
              <span 
                className="message-icon pulse-animation" 
                style={{ animationDelay: '0.4s' }}
              >
                🌟
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <p className="footer-text">
            © 2026 babi — Built with love for parents 👶💖
          </p>
          <div className="footer-icons">
            <span className="footer-icon">📧</span>
            <span className="footer-icon">📱</span>
            <span className="footer-icon">🌐</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;