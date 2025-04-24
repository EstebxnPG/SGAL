const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/usuarioController');
const { obtenerOperadores } = require('../controllers/usuarioController');

// Ruta POST para registrar usuario
router.post('/', registrarUsuario);
router.get('/', obtenerOperadores);

module.exports = router;
