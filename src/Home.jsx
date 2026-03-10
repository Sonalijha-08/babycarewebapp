import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./api/axios";
import "./home.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/login");
  };

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
      route: "/tips"
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

          <div className="profile-container" ref={menuRef}>
            <button
              className="profile-btn"
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {userProfile && userProfile.profilePicture ? (
                <img
                  src={userProfile.profilePicture.startsWith('http')
                    ? userProfile.profilePicture
                    : `${BASE_URL}${userProfile.profilePicture}`}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <span>👤</span>
              )}
            </button>

            {menuOpen && (
              <div className="profile-menu">
                <Link to="/profile" className="profile-menu-item" onClick={() => setMenuOpen(false)}>
                  View Profile
                </Link>
                <button className="profile-menu-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
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
            {/* <button className="cta-btn">
              Get Started
            </button> */}
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
     <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">BABI</h2>
          <p className="footer-tagline">
            Caring for your little one, every step of the way 💕
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/feedingLog">Feeding Log</Link></li>
            <li><Link to="/sleeplog">Sleep Log</Link></li>
            <li><Link to="/diaperLog">Diaper Log</Link></li>
            <li><Link to="/vaccinations">Vaccination</Link></li>
            <li><Link to="/growthTracker">Growth Tracker</Link></li>
            <li><Link to="/tips">Tips & Guidance</Link></li>
            
          </ul>
        </div>

        {/* Features */}
        <div className="footer-features">
          <h4>Features</h4>
          <ul>
            <li>🍼 Smart Feeding Tracking</li>
            <li>😴 Sleep Monitoring</li>
            <li>🚼 Diaper Alerts</li>
            <li>📊 Growth Tracker</li>
            <li>💡 Tips & Guidance</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact" id="contact">
          <h4>Contact</h4>
          <p>Email: jhasonali208@gmail.com</p>
          <p>Made with ❤️ for parents</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BABI Baby Care. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default Home;