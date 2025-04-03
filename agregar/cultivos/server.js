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
  database: 'sgal_lembo',
});

db.connect(err => {
    if (err) {
        console.log('Error conectando a la BD: ', err);
        return;
    }
    console.log('Conectado a la BD - FULL');
});

app.post('/cultivo', (req, res) => {
    const { id, tipo, nombre, identificador, tamano, ubicacion, descripcion, fotografia, estado } = req.body;

    // Validación sin 'fotografia'
    if (!tipo || !nombre || !identificador || !tamano || !ubicacion || !descripcion || !estado) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = "INSERT INTO cultivo (tipo, nombre, identificador, tamano, ubicacion, descripcion, fotografia, estado) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Si fotografía es null, usa NULL en la base de datos
    const values = [tipo, nombre, identificador, tamano, ubicacion, descripcion, fotografia || null, estado ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error insertando cultivo:', err);
            return res.status(500).json({ error: 'Error al registrar el cultivo.' });
        }
        res.status(201).json({ id: result.insertId, tipo, nombre, identificador, tamano, ubicacion, descripcion, fotografia, estado });
    });
});


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
