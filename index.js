const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const path = require('path');


// Load environment variables
dotenv.config();

const app = express();

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log('\n=== REQUEST ===');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  
  // Log query parameters if they exist
  if (Object.keys(req.query).length > 0) {
    console.log('Query Parameters:', req.query);
  }
  
  // Log request body if it exists
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }

  // Store the original res.json method
  const originalJson = res.json;
  
  // Override the json method to log the response
  res.json = function(body) {
    console.log('\n=== RESPONSE ===');
    console.log(`Status: ${res.statusCode}`);
    console.log('Response Body:', body);
    return originalJson.call(this, body);
  };

  // Log response completion
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('\n=== REQUEST COMPLETE ===');
    console.log(`Duration: ${duration}ms`);
    console.log('========================================\n');
  });

  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n=== ERROR ===');
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 