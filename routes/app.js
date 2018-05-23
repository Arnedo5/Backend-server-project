var express = require('express');

var app = express();


//Rutas
app.get('/', (req, rest, next) => {

    rest.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });

});

module.exports = app;