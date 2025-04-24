const express = require('express');
const router = express.Router();
const { crearIntegracion } = require('../controllers/integracionController');
const { obtenerIntegraciones } = require('../controllers/integracionController');

router.post('/', crearIntegracion);
router.get('/', obtenerIntegraciones);
router.get('/integraciones', obtenerIntegraciones); 

module.exports = router;