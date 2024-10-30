const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Exemple d'endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});