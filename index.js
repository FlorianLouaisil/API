// index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie');
  }
});

// Créer une table pour l'exemple
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)`);

// Routes
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Démarrage du serveur localement
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});