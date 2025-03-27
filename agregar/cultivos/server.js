const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sgal_project'  
});

db.connect(err => {
    if (err) {
        console.log('Error conectando a la BD: ', err);
        return;
    }
    console.log('Conectado a la BD - FULL');
});

app.post('/cultivo', (req, res) => {
    const { type, name, identifier, size, address, description, image, state } = req.body;

    if (!type || !name || !identifier || !size || !address || !description || !image || !state) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = "INSERT INTO cultivos (type, name, identifier, size, address, description, image, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [type, name, identifier, size, address, description, image, state];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error insertando usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }
        res.status(201).json({ id: result.insertId, type, name, identifier, size, address, description, image, state });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
