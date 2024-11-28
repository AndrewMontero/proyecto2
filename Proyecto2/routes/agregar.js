const express = require('express');
const router = express.Router();
const Noticia = require('../models/noticia');

// Middleware para verificar si es administrador
function verificarAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Acceso denegado: No eres administrador');
}

// Mostrar formulario para agregar noticia
router.get('/', verificarAdmin, (req, res) => {
  res.render('agregar'); // Renderiza la vista agregar.ejs
});

// Procesar el formulario para agregar noticia
router.post('/', verificarAdmin, async (req, res) => {
  try {
    const nuevaNoticia = new Noticia(req.body); // Crea una nueva noticia con los datos del formulario
    await nuevaNoticia.save(); // Guarda la noticia en la base de datos
    res.redirect('/'); // Redirige a la página principal
  } catch (error) {
    console.error('Error al agregar noticia:', error);
    res.status(500).send('¡Algo salió mal en el servidor!');
  }
});

module.exports = router;
