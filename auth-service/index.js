require("./tracing");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
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

// Railway provides the port via environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
