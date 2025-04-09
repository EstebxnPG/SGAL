const express = require('express');
const router = express.Router();
const { registrarInsumo } = require('../controllers/insumoController');

// Ruta POST para registrar insumo
router.post('/', registrarInsumo);

module.exports = router;
