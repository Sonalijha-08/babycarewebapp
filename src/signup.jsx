import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // reuse same css

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation for smooth page open
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("User already exists or signup failed");
    }
  };

  return (
    <div className={`login-wrapper ${isVisible ? 'visible' : ''}`}>
      {/* LEFT SIDE - FORM */}
      <div className="login-left">
        <h2>Create Account</h2>
        <p>Please fill in the details to sign up</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="login-right">
        <img
          className={isVisible ? 'animate' : ''}
          src="https://i.pinimg.com/736x/bd/63/76/bd637657c95c2b21dbadeb7c15dea05b.jpg"
          alt="Baby Illustration"
        />
      </div>
    </div>
  );
};

export default Signup;
