import React, { useState, useEffect } from "react";
import api from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // reuse same css

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation immediately
    setIsVisible(true);

    // Trigger container slide animation
    const splitTimer = setTimeout(() => {
      setIsSplit(true);
    }, 400);

    return () => {
      clearTimeout(splitTimer);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/auth/register",
        { name, email, password }
      );

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.msg || "Signup failed";
      alert(msg);
    }
  };

  return (
    <div className={`login-wrapper ${isVisible ? 'visible' : ''}`}>
      <div className={`login-container ${isSplit ? 'split' : ''}`}>
        {/* Logo/Icon */}
        <div className="login-icon"></div>

        {/* Header */}
        <div className="login-header">
          <h2>Create Account</h2>
          <p>Join us today and get started</p>
        </div>

        {/* Signup Form */}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

       
        {/* Login Link */}
        <p className="signup-text">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>

        {/* Decorative Element */}
        <div className="decorative-circle-1"></div>
      </div>
    </div>
  );
};

export default Signup;