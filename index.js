const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon API!');
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});


const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM my_table');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});