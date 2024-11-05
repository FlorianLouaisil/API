const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware pour permettre l'accès à l'API (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware pour traiter le corps des requêtes en JSON
app.use(express.json());

// Chemin vers le fichier data.json
const dataFilePath = path.join(__dirname, 'data.json');

// Endpoint GET pour récupérer les données
app.get('/api/users', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier de données' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint POST pour ajouter un nouvel utilisateur
app.post('/api/users', (req, res) => {
    const newUser = req.body; // L'utilisateur à ajouter

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier de données' });
        }

        const users = JSON.parse(data);
        newUser.id = users.length + 1; // Générer un nouvel ID basé sur la longueur actuelle
        users.push(newUser);

        // Écrire les données mises à jour dans le fichier
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'écriture dans le fichier de données' });
            }
            res.status(201).json(newUser);
        });
    });
});

// Endpoint PUT pour mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier de données' });
        }

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id == id);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les informations de l'utilisateur
        const updatedUser = { id: parseInt(id), ...req.body };
        users[userIndex] = updatedUser;

        // Écrire les données mises à jour dans le fichier
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'écriture dans le fichier de données' });
            }
            res.json(updatedUser);
        });
    });
});

// Endpoint DELETE pour supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la lecture du fichier de données' });
        }

        let users = JSON.parse(data);
        users = users.filter(user => user.id != id); // Filtrer l'utilisateur à supprimer

        // Écrire les données mises à jour dans le fichier
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'écriture dans le fichier de données' });
            }
            res.status(204).send(); // Répondre sans contenu
        });
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;