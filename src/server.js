const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
    setTimeout(() => {
        res.json({
            message: 'Test successful',
            time: new Date().toISOString()
        });
    }, 100);
});

app.post('/api/test', (req, res) => {
    setTimeout(() => {
        const { data } = req.body;
        res.json({
            receivedData: data
        });
    }, 100);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


