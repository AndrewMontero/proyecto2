const express = require('express');
const router = express.Router();
const Noticia = require('../models/noticia'); // Asegúrate de que este modelo existe

// Ruta para la página principal
router.get('/', async (req, res) => {
  try {
    const noticias = await Noticia.find(); // Obtiene todas las noticias de la base de datos
    res.render('index', { noticias }); // Renderiza la vista 'index.ejs' con las noticias
  } catch (error) {
    res.status(500).send('Error al cargar las noticias');
  }
});

module.exports = router;
