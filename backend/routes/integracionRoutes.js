const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { 
  crearIntegracion, 
  obtenerIntegraciones,
  obtenerIntegracionPorId,
  actualizarIntegracion
} = require('../controllers/integracionController');

// Ruta para crear integración (POST)
router.post('/', upload.single('fotografia'), crearIntegracion);

// Rutas para obtener integraciones (GET)
router.get('/', obtenerIntegraciones); // Todas las integraciones
router.get('/integraciones', obtenerIntegraciones); // Ruta alternativa redundante
router.get('/:id', obtenerIntegracionPorId); // Integración específica por ID
router.put('/:id', upload.single('fotografia'), actualizarIntegracion);

module.exports = router;