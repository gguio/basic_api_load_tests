// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// GET endpoint to return a test message with the current time
app.get('/api/test', (req, res) => {
    setTimeout(() => {
        res.json({
            message: 'Test successful',
            time: new Date().toISOString()
        });
    }, 100);
});

// POST endpoint to echo the received data
app.post('/api/test', (req, res) => {
    setTimeout(() => {
        const { data } = req.body;
        res.json({
            receivedData: data
        });
    }, 100);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Save this as index.js and run with: node index.js
// You can test it with a tool like Postman or curl!

