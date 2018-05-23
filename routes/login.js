var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

//Models
var User = require('../models/usuario');

// ===============================================
// Login
// ===============================================

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al buscar usuarios.', errors: err });
        } else {
            if (!userDB) {
                res.status(400).json({ ok: false, message: 'Credenciales incorrectas - email.', errors: err });
            } else {
                if (!bcrypt.compareSync(body.password, userDB.password)) {
                    res.status(400).json({ ok: false, message: 'Credenciales incorrectas - password.', errors: err });
                } else {

                    userDB.password = 'fake_password';

                    // Create token
                    var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); //4 Horas

                    res.status(200).json({ ok: true, usuario: userDB, token: token, id: userDB._id });
                }
            }
        }
    });

});


module.exports = app;