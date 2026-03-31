import React, { useState, useEffect } from "react";
import api from "./api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        { email, password }
      );

      // Save login data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);

      navigate("/home");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={`login-wrapper ${isVisible ? 'visible' : ''}`}>
      <div className={`login-container ${isSplit ? 'split' : ''}`}>
        {/* Logo/Icon */}
        <div className="login-icon"></div>

        {/* Header */}
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to continue</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
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
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

       

        {/* Signup Link */}
        <p className="signup-text">
          Don't have an account?
          <Link to="/signup">Sign up</Link>
        </p>

        {/* Decorative Element */}
        <div className="decorative-circle-1"></div>
      </div>
    </div>
  );
};

export default Login;