const db = require('../config/db.js');

const registrarInsumo = (req, res) => {
  const {
    nombre, estado, tipo, unidad_medida,
    cantidad, valor_unitario, valor_total, descripcion
  } = req.body;

  // Validación
  if (!nombre || !estado || !tipo || !unidad_medida || !cantidad || !valor_unitario || !valor_total || !descripcion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    INSERT INTO insumo (nombre, estado, tipo, unidad_medida, cantidad, valor_unitario, valor_total, descripcion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombre, estado, tipo, unidad_medida,
    cantidad, valor_unitario, valor_total, descripcion
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error insertando insumo:', err);
      return res.status(500).json({ error: 'Error al registrar el insumo.' });
    }

    res.status(201).json({
      id: result.insertId,
      nombre, estado, tipo, unidad_medida,
      cantidad, valor_unitario, valor_total, descripcion
    });
  });
};

module.exports = {
  registrarInsumo
};
