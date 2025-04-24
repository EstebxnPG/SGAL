const express = require('express');
const router = express.Router();
const { registrarInsumo } = require('../controllers/insumoController');
const { obtenerInsumos } = require('../controllers/insumoController');

// Ruta POST para registrar insumo
router.post('/', registrarInsumo);
router.get('/', obtenerInsumos);

module.exports = router;
