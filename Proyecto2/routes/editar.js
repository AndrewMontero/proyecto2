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
router.get('/agregar', verificarAdmin, (req, res) => {
  res.render('agregar'); // Renderiza la vista agregar.ejs
});

// Procesar el formulario para agregar noticia
router.post('/agregar', verificarAdmin, async (req, res) => {
  try {
    const nuevaNoticia = new Noticia(req.body); // Crea una nueva noticia con los datos del formulario
    await nuevaNoticia.save(); // Guarda la noticia en la base de datos
    res.redirect('/'); // Redirige a la página principal
  } catch (error) {
    console.error('Error al agregar noticia:', error);
    res.status(500).send('¡Algo salió mal en el servidor!');
  }
});

// Mostrar formulario para editar noticia
router.get('/editar/:id', verificarAdmin, async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id); // Busca la noticia por su ID
    res.render('editar', { noticia }); // Renderiza la vista editar.ejs con los datos de la noticia
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Procesar el formulario para editar noticia
router.post('/editar/:id', verificarAdmin, async (req, res) => {
  try {
    await Noticia.findByIdAndUpdate(req.params.id, req.body); // Actualiza la noticia en la base de datos
    res.redirect('/'); // Redirige a la página principal después de editar la noticia
  } catch (error) {
    console.error('Error al editar noticia:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
