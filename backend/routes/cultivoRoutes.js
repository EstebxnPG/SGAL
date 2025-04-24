const express = require('express');
const router = express.Router();
const { registrarCultivo } = require('../controllers/cultivoController');
const { obtenerCultivos } = require('../controllers/cultivoController');

// Ruta POST para registrar un cultivo
router.post('/', registrarCultivo);
router.get('/', obtenerCultivos);

module.exports = router;
