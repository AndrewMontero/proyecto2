const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('./conexion'); // Importa la conexión a MongoDB

// Importa rutas
const indexRoutes = require('./routes/index'); // Rutas principales
const usuarioRoutes = require('./routes/usuario'); // Rutas para usuarios
const agregarRoutes = require('./routes/agregar'); // Rutas para agregar noticias

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // Parseo de datos enviados por formularios
app.use(express.json()); // Para manejar JSON en las solicitudes
app.use(
  session({
    secret: 'miSecreto', // Clave secreta para la sesión
    resave: false, // No guarda la sesión si no hay cambios
    saveUninitialized: false, // No guarda sesiones no inicializadas
  })
);

// Configuración del motor de vistas
app.set('view engine', 'ejs'); // Usa EJS como motor de vistas
app.set('views', './views'); // Define la carpeta donde están las vistas

// Configurar archivos estáticos
app.use(express.static('public')); // Carpeta para archivos estáticos como CSS, JS, imágenes

// Rutas
app.use('/', indexRoutes); // Ruta principal (página inicial)
app.use('/usuario', usuarioRoutes); // Rutas para registro y login de usuarios
app.use('/agregar', agregarRoutes); // Rutas para agregar noticias

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render('404', { url: req.originalUrl }); // Renderiza la vista 404.ejs
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
