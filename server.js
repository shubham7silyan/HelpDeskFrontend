const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(__dirname, "dist");

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error("Error: dist directory not found. Build may have failed.");
  console.error("Please ensure 'npm run build' completes successfully before starting the server.");
  process.exit(1);
}

// Check if index.html exists
const indexPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error("Error: index.html not found in dist directory.");
  console.error("Build appears incomplete. Please run 'npm run build' first.");
  process.exit(1);
}

app.use(express.static(distPath));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${distPath}`);
});
