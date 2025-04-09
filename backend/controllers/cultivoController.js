const db = require('../config/db.js');


const registrarCultivo = (req, res) => {
  const {
    tipo, nombre, identificador, tamano,
    ubicacion, descripcion, fotografia, estado
  } = req.body;

  if (!tipo || !nombre || !identificador || !tamano || !ubicacion || !descripcion || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    INSERT INTO cultivo (tipo, nombre, identificador, tamano, ubicacion, descripcion, fotografia, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    tipo, nombre, identificador, tamano,
    ubicacion, descripcion, fotografia || null, estado
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error insertando cultivo:', err);
      return res.status(500).json({ error: 'Error al registrar el cultivo.' });
    }

    res.status(201).json({
      id: result.insertId,
      tipo, nombre, identificador, tamano,
      ubicacion, descripcion, fotografia, estado
    });
  });
};

module.exports = {
  registrarCultivo
};
