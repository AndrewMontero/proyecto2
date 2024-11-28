const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'cliente' },
  fechaRegistro: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
