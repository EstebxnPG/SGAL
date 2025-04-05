const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/usuarioController');

// Ruta POST para registrar usuario
router.post('/', registrarUsuario);

module.exports = router;
