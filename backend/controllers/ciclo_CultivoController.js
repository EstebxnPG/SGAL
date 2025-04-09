const db = require('../config/db.js');

const insertarCicloCultivo = (req, res) => {
    const { nombre, estado, fecha_inicial, fecha_final, descripcion } = req.body;

    if (!nombre || !estado || !fecha_inicial || !fecha_final || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const sql = "INSERT INTO ciclo_cultivo (nombre, estado, fecha_inicial, fecha_final, descripcion) VALUES (?, ?, ?, ?, ?)";
    const values = [nombre, estado, fecha_inicial, fecha_final, descripcion];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error insertando ciclo cultivo:', err);
            return res.status(500).json({ error: 'Error al registrar.' });
        }

        res.status(201).json({ id: result.insertId, nombre, estado, fecha_inicial, fecha_final, descripcion });
    });
};

module.exports = { insertarCicloCultivo };
