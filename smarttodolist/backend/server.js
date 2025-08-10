import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// ✅ CORS with credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.json());

// ✅ Session config
app.use(session({
  secret: "yoursecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,  // false for localhost
    sameSite: "lax" // so cookies work cross-origin
  }
}));

// Fake DB for example
const users = [];

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.json({ message: "Signup successful" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // ✅ Save user in session
  req.session.user = { username: user.username };
  res.json({ message: "Login successful" });
});

// Check session
app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));