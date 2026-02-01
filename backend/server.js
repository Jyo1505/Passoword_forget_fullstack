require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Default page → forgot-password.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/forgot-password.html"));
});

// API routes
app.use("/api", authRoutes);

// Port
const PORT = process.env.PORT || 2000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
