const express = require('express');
const app = express();
const port = 3000

app.use(express.json());

// Exemple d'endpoint
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});