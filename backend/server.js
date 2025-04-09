const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const cicloCultivoRoutes = require('./routes/ciclo_cultivo');
const cultivoRoutes = require('./routes/cultivoRoutes');
const insumoRoutes = require('./routes/insumoRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use('/ciclo_cultivo', cicloCultivoRoutes);
app.use('/cultivo', cultivoRoutes);
app.use('/insumo', insumoRoutes);
app.use('/sensor', sensorRoutes);
app.use('/usuario', usuarioRoutes);

// Servidor
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});
