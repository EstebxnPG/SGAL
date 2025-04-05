const express = require('express');
const router = express.Router();
const { registrarSensor } = require('../controllers/sensorController');

// Ruta POST para registrar sensor
router.post('/', registrarSensor);

module.exports = router;
