require("./tracing")();

const express = require("express");
const app = express();

app.use(express.json());

app.get("/orders", (req, res) => {
  res.json({
    service: "order-service",
    message: "Orders fetched successfully",

    // identity propagated from gateway
    user: {
      id: req.headers["x-user-id"],
      email: req.headers["x-user-email"],
      role: req.headers["x-user-role"],
    },

    orders: [
      { id: 1, item: "Laptop", price: 1200 },
      { id: 2, item: "Phone", price: 800 },
    ],
  });
});

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
