const db = require('../config/db.js');

const registrarSensor = (req, res) => {
  const { nombre, estado, tipo, unidad_medida, fotografia, descripcion } = req.body;

  if (!nombre || !estado || !tipo || !unidad_medida || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    INSERT INTO sensor (nombre, estado, tipo, unidad_medida, fotografia, descripcion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [nombre, estado, tipo, unidad_medida, fotografia || null, descripcion];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error insertando sensor:', err);
      return res.status(500).json({ error: 'Error al registrar el sensor.' });
    }

    res.status(201).json({
      id: result.insertId,
      nombre, estado, tipo, unidad_medida, fotografia, descripcion
    });
  });
};

module.exports = {
  registrarSensor
};
