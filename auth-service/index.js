require("./tracing")();

const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  const { username } = req.body;

  setTimeout(() => {
    res.json({
      status: "ok",
      user: username,
      token: "jwt-token-123",
    });
  }, 100);
});

app.post("/verify", (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.json({ valid: false });
  }

  const token = auth.replace("Bearer ", "");

  if (token !== "jwt-token-123") {
    return res.json({ valid: false });
  }

  res.json({
    valid: true,
    user: {
      id: "u-101",
      email: "test@test.com",
      role: "user"
    }
  });
});






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
