const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario'); // Modelo de usuario

// Mostrar formulario de login
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza login.ejs
});

// Procesar login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ username });
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(401).render('login', { error: 'Usuario o contraseña incorrectos' });
        }
        req.session.user = { id: usuario._id, role: usuario.role };
        res.redirect('/'); // Redirige al inicio
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).render('login', { error: 'Error interno del servidor' });
    }
});

// Mostrar formulario de registro de usuario
router.get('/registro', (req, res) => {
    res.render('registro'); // Renderiza registro.ejs
});

// Ruta para registrar un nuevo usuario con rol 'cliente'
router.post('/registro', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).render('registro', { error: 'Todos los campos son obligatorios' });
    }
    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ username });
        if (usuarioExistente) {
            return res.status(400).render('registro', { error: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario con rol 'cliente' y contraseña encriptada
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ username, password: hashedPassword });
        await nuevoUsuario.save();

        res.status(201).render('registro', { success: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).render('registro', { error: 'Error interno del servidor' });
    }
});

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/usuario/login'); // Redirige al login si no está autenticado
    }
}

// Ejemplo de ruta protegida
router.get('/perfil', isAuthenticated, (req, res) => {
    res.render('perfil', { user: req.session.user });
});

module.exports = router;
