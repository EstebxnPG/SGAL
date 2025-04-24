const express = require('express');
const router = express.Router();
const { crearIntegracion } = require('../controllers/integracionController');

router.post('/', crearIntegracion);

module.exports = router;