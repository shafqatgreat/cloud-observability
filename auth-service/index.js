require("./tracing");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login",(req,res)=>{
    const { username } = req.body;
    // Simulate authentication
    setTimeout(() => {
        res.json({
            status: "ok",
            user: username,
            token: "jwt-token-123"
        });
    },100);
});



app.listen(3000, () => {
  console.log("Auth Service running on port 3000");
});