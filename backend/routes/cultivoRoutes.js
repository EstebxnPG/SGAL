const express = require('express');
const router = express.Router();
const { registrarCultivo } = require('../controllers/cultivoController');

// Ruta POST para registrar un cultivo
router.post('/', registrarCultivo);

module.exports = router;
