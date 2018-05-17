// Requires
var express = require('express');
var mongoose = require('mongoose');




// Iicializar variables
var app = express();



// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/projectDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')

});


//Rutas
app.get('/', (req, rest, next) => {

    rest.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });

});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')
});