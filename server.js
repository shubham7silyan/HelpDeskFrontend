const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dist path: ${distPath}`);
});
