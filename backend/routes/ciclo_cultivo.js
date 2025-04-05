const express = require('express');
const router = express.Router();
const { insertarCicloCultivo } = require('../controllers/ciclo_CultivoController');

// Ruta POST
router.post('/', insertarCicloCultivo);

module.exports = router;
