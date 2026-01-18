'use strict';

// 🔹 Load tracing FIRST (must be before express)
require("./tracing");

const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Health check (IMPORTANT for Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Routes
app.post("/login", async (req, res) => {
  const { username } = req.body;

  // Simulate authentication
  setTimeout(() => {
    res.json({
      status: "ok",
      user: username,
      token: "jwt-token-123",
    });
  }, 100);
});

// Railway provides the port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
























// require("./tracing");
// const express = require("express");
// const app = express();

// app.use(express.json());

// app.post("/login", (req, res) => {
//   const { username } = req.body;
//   // Simulate authentication
//   setTimeout(() => {
//     res.json({
//       status: "ok",
//       user: username,
//       token: "jwt-token-123",
//     });
//   }, 100);
// });

// // Railway provides the port via environment variable
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Auth Service running on port ${PORT}`);
// });
