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

app.post('/user', (req, res) => {
    const { name, email, address, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = "INSERT INTO user (name, email, address, phone) VALUES (?, ?, ?, ?)";
    const values = [name, email, address, phone];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error insertando usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }
        res.status(201).json({ id: result.insertId, name, email });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
