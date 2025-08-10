import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig"; // ✅ Use the same Firebase config file

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Redirect if already signed in with Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/todo");
    });
    return unsubscribe;
  }, [auth, navigate]);

  // Email/password login
  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { username, password })
      .then(() => {
        setMessage("Login successful!");
        navigate("/todo");
      })
      .catch(() => {
        setMessage("Invalid username or password.");
      });
  }

  // Google login
  async function handleGoogleSignIn() {
    try {
      await signInWithPopup(auth, provider);
      navigate("/todo");
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 18px #0003",
          width: 320,
          padding: "34px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{ marginBottom: 16, color: "#11998e", fontWeight: 600, fontSize: 22 }}>
          Smart To-Do
        </h2>
        <div style={{ color: "#444", marginBottom: 24 }}>
          Log in to continue to Smart To-Do.
        </div>

        {/* Email/Password Login */}
        <form style={{ width: "100%" }} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 9,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #e3e3e3",
              fontSize: 15
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 9,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #e3e3e3",
              fontSize: 15
            }}
          />
          <button
            type="submit"
            style={{
              background: "#38ef7d",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              width: "100%",
              padding: "10px 0",
              marginBottom: 10,
              fontSize: 16
            }}
          >
            Sign In
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ margin: "10px 0", fontSize: 13, color: "#888" }}>OR</div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            background: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            width: "100%",
            padding: "10px 0",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Sign in with Google
        </button>

        {/* Link to Signup */}
        <div style={{ fontSize: 13, marginTop: 12 }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#11998e" }}>
            Sign up
          </Link>
        </div>

        {/* Error/Success Message */}
        <div style={{ color: "#d32f2f", marginTop: 12, fontWeight: 500 }}>
          {message}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: 12, color: "#38ef7d" }}>
          © 2025 Smart To-Do. All rights reserved.
        </div>
      </div>
    </div>
  );
}
