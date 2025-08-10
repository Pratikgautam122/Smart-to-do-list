import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav
      style={{
        width: "100%", // Don't use 100vw here
        maxWidth: "100%", // Prevent overflow
        background: "#e7f8ef",
        padding: "0 42px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px #11998e11",
        fontFamily: "Inter, Arial, sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 99,
        boxSizing: "border-box", // critical for padding alignment
      }}
    >
      {/* Left links */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#11998e",
            fontWeight: 700,
            fontSize: 19,
          }}
        >
          Home
        </Link>
        {token && (
          <Link
            to="/todo"
            style={{
              textDecoration: "none",
              color: "#11998e",
              fontWeight: 700,
              fontSize: 19,
            }}
          >
            Task List
          </Link>
        )}
      </div>

      {/* Right buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {token ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={{
              background: "linear-gradient(90deg,#38ef7d,#11998e)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px #11998e22",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#11998e")}
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg,#38ef7d,#11998e)")
            }
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                background: "#38ef7d",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                padding: "8px 22px",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 8px #11998e22",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#11998e")}
              onMouseOut={(e) => (e.target.style.background = "#38ef7d")}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                background: "none",
                color: "#11998e",
                textDecoration: "none",
                border: "2px solid #38ef7d",
                borderRadius: 8,
                padding: "8px 22px",
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 2px 8px #11998e22",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#38ef7d";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "none";
                e.target.style.color = "#11998e";
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
