// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//Import routes
var appRoutes = require('./routes/app');
var appUser = require('./routes/user');
var loginRoutes = require('./routes/login');

// Inicializar variables
var app = express();

//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/projectDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')

});

//Rutas
app.use('/', appRoutes);
app.use('/user', appUser);
app.use('/login', loginRoutes);



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')
});