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
  database: 'sgal_lembo'
});

db.connect(err => {
    if (err) {
        console.log('Error conectando a la BD: ', err);
        return;
    }
    console.log('Conectado a la BD - FULL');
});

app.post('/insumo', (req, res) => {
    const { id, nombre, estado, tipo, unidad_medida, cantidad, valor_unitario, valor_total, descripcion} = req.body;

    if (!nombre || !estado || !tipo || !unidad_medida || !cantidad || !valor_unitario|| !valor_total|| !descripcion) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = "INSERT INTO insumo (nombre, estado, tipo, unidad_medida, cantidad, valor_unitario, valor_total, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [ nombre, estado, tipo, unidad_medida, cantidad, valor_unitario, valor_total, descripcion];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error insertando usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }
        res.status(201).json({ id: result.insertId,id, nombre, estado, tipo, unidad_medida, cantidad, valor_unitario, valor_total, descripcion });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
