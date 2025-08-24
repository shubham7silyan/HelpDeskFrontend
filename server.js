import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Check if dist directory exists, create fallback if not
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.warn('Warning: dist directory not found. Creating fallback response.');
  // Create a simple fallback response instead of crashing
  app.get('*', (req, res) => {
    res.status(503).send(`
      <html>
        <body>
          <h1>Service Temporarily Unavailable</h1>
          <p>The application is building. Please try again in a few moments.</p>
        </body>
      </html>
    `);
  });
} else {
  // Serve static files from dist directory
  app.use(express.static(distPath));
  
  // Handle client-side routing - serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dist path: ${distPath}`);
  console.log(`Dist exists: ${fs.existsSync(distPath)}`);
});
