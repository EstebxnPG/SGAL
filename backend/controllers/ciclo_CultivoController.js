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

const obtenerCicloCultivos = (req, res) => {
    db.query('SELECT id, nombre FROM ciclo_cultivo', (err, result) => {
      if (err) {
        console.error('❌ Error al obtener ciclo de cultivos:', err);
        return res.status(500).json({ error: 'Error al obtener ciclo de cultivos' });
      }
      res.json(result); // Esto devolverá los datos de los cultivos
    });
  };

module.exports = { 
    insertarCicloCultivo,
    obtenerCicloCultivos
};
