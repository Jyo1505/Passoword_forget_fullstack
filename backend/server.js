// require("dotenv").config(); // MUST be first

// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const authRoutes = require("./routes/authRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// const cors = require("cors");

// app.use(cors({
//   origin: [
//     "https://password-forget-fullstack.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("*", cors());

// app.use(express.json());

// // Serve frontend folder
// app.use(express.static(path.join(__dirname, "../frontend")));

// // Default page → forgot-password.html
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/forgot-password.html"));
// });

// // API routes
// app.use("/api", authRoutes);

// // Port
// const PORT = process.env.PORT || 2000;

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

/* =========================
   MIDDLEWARE (ORDER MATTERS)
========================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 👇 THIS IS THE KEY FIX (preflight support)
app.options("*", cors());

/* =========================
   ROUTES
========================= */
app.use("/api", authRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
