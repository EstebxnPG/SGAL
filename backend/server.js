// 📌 Importación de módulos necesarios
const express = require('express'); // Framework para crear el servidor
const cors = require('cors'); // Middleware para manejar políticas de CORS

require('dotenv').config(); // Carga las variables de entorno desde un archivo .env
const usersRoutes = require('./routes/registerRoutes'); // Importa las rutas de registro

// 📌 Creación de la aplicación Express
const app = express();

// 📌 Middlewares
app.use(express.json()); // Habilita el soporte para recibir JSON en las solicitudes

app.use(express.static('frontend/public'));

// app.use(cors()); // Habilita CORS para permitir solicitudes desde otros dominios
app.use(cors({
    origin: '*', // Permitir todas las conexiones (solo para pruebas)
    // origin: 'http://localhost:3000', //Limita la conexián a solo esta
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// 📌 Rutas
app.use('/user', usersRoutes); // Asigna las rutas de usuario al prefijo '/user'

// // 📌 Configuración del puerto
const PORT = process.env.PORT || 3000; // Usa el puerto de las variables de entorno o el 3000 por defecto

// Pendiente por eliminar
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// 📌 Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhostttt:${PORT}`); // Mensaje de confirmación
});
