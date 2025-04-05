const db = require('../config/db.js');

const registrarUsuario = (req, res) => {
  const { tipo_usuario, tipo_documento, num_documento, nombre, correo, num_telefono, estado, contrasena } = req.body;

  if (!tipo_usuario || !tipo_documento || !num_documento || !nombre || !correo || !num_telefono || !estado || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    INSERT INTO usuario (tipo_usuario, tipo_documento, num_documento, nombre, correo, num_telefono, estado, contrasena)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [tipo_usuario, tipo_documento, num_documento, nombre, correo, num_telefono, estado, contrasena];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error insertando usuario:', err);
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }

    res.status(201).json({
      id: result.insertId,
      tipo_usuario, tipo_documento, num_documento, nombre, correo, num_telefono, estado, contrasena
    });
  });
};

module.exports = {
  registrarUsuario
};
