const express = require('express');
const router = express.Router();
const { registrarSensor } = require('../controllers/sensorController');
const { obtenerSensores } = require('../controllers/sensorController');

// Ruta POST para registrar sensor
router.post('/', registrarSensor);
router.get('/', obtenerSensores);

module.exports = router;
