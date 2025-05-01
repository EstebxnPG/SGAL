const express = require('express');
const cors = require('cors');
const app = express();

// Middleware para archivos form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Servir archivos estáticos 
app.use('/uploads', express.static('uploads'));

// Rutas
const cicloCultivoRoutes = require('./routes/ciclo_cultivo');
const cultivoRoutes = require('./routes/cultivoRoutes');
const insumoRoutes = require('./routes/insumoRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const integracionRoutes = require('./routes/integracionRoutes');

app.use('/ciclo_cultivo', cicloCultivoRoutes);
app.use('/cultivo', cultivoRoutes);
app.use('/insumo', insumoRoutes);
app.use('/sensor', sensorRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/integracion', integracionRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
