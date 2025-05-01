const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { crearIntegracion, obtenerIntegraciones } = require('../controllers/integracionController');

// Ruta para crear una integración, incluyendo la subida de una imagen
router.post('/', upload.single('fotografia'), crearIntegracion);

// Rutas para obtener integraciones
router.get('/', obtenerIntegraciones);
router.get('/integraciones', obtenerIntegraciones);

module.exports = router;
