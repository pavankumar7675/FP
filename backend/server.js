const express = require("express");

const app = express();
const PORT = 9000; // Change port if needed

// Middleware
app.use(express.json()); // Allows parsing JSON request bodies

// Basic Route to Check Server
app.get("/", (req, res) => {
  res.send("Server is running successfully! 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
