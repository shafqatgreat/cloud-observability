require("./tracing")();

const express = require("express");
const app = express();

app.use(express.json());

app.post("/order", (req, res) => {
  const userId = req.headers["x-user-id"];
    
  if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
  }
  
  setTimeout(() => {
    res.json({
        orderId: "ORD-123",
        userId,
        status: "created",
    });
  }, 100);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
