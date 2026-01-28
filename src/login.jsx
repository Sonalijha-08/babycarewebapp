import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSplit, setIsSplit] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageAnimate, setImageAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation immediately
    setIsVisible(true);

    // Trigger image animation after a short delay
    const imageTimer = setTimeout(() => {
      setImageAnimate(true);
    }, 300);

    // Trigger split animation after a longer delay
    const splitTimer = setTimeout(() => {
      setIsSplit(true);
    }, 800);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(splitTimer);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
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
      {/* LEFT SIDE - FORM */}
      <div className={`login-left ${isSplit ? 'split' : ''}`}>
        <h2>Welcome Back</h2>
        <p>Please sign in to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="signup-text">
          Don’t have an account?
          <Link to="/signup"> Sign up</Link>
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="login-right">
        <img
          src="https://i.pinimg.com/1200x/94/72/7d/94727d6107f33521d79d130e8eb29757.jpg"
          alt="Baby Illustration"
        />
      </div>
    </div>
  );
};

export default Login;
