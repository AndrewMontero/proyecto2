const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/noticias', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión correcta a la base de datos'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = mongoose;
