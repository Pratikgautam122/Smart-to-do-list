import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, boxShadow: "0 2px 18px #0003",
        width: 320, padding: "38px 34px", display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <h1 style={{ marginBottom: 18, color: "#11998e", fontWeight: 700, fontSize: 26 }}>Smart To-Do List</h1>
        <p style={{ marginBottom: 30, color: "#444" }}>Organize your tasks efficiently.</p>
        <Link to="/login" style={{
          background: "#38ef7d", color: "#fff", textDecoration: "none", fontWeight: "bold", borderRadius: 6,
          padding: "10px 0", width: "100%", display: "block", textAlign: "center", fontSize: 16
        }}>Get Started</Link>
      </div>
    </div>
  );
}