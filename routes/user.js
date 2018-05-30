var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//Models
var User = require('../models/user');

// ===============================================
// Obtener todos los ususarios
// ===============================================

app.get('/', (req, res, next) => {

    var skip = req.query.skip || 0;
    skip = Number(skip);

    User.find({}, 'name email img role')
        .skip(skip)
        .limit(5)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).json({ ok: false, message: 'Error al cargar usuarios.', errors: err });
                } else {
                    User.count({}, (err, count) => {
                        if (err) {
                            res.status(500).json({ ok: false, message: 'Error al buscar el total de usuarios.', errors: err });
                        } else {
                            res.status(200).json({ ok: true, total: count, users: users });
                        }
                    })
                }
            });
});

// ===============================================
// Crear un nuevo usuario
// ===============================================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        google: body.google
    });

    user.save((err, userSaved) => {
        if (err) {
            res.status(400).json({ ok: false, message: 'Error el crear un usuario.', errors: err });
        } else {
            res.status(201).json({ ok: true, user: userSaved, userToken: req.user });
        }

    });

});


// ===============================================
// Actualizar usuario
// ===============================================

app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al buscar usuario.', errors: err });
        }

        if (!user) {
            res.status(400).json({ ok: false, message: 'El usuario con la id: ' + id + ' no etiste.', errors: { message: 'No existe un usuario con ese ID.' } });
        } else {
            user.name = body.name;
            user.email = body.email;
            user.role = body.role;

            user.save((err, userSaved) => {
                if (err) {
                    res.status(400).json({ ok: false, message: 'Error al actualizar el usuario.', errors: err });
                } else {
                    userSaved.password = 'fake_password';
                    res.status(200).json({ ok: true, user: userSaved });
                }
            });
        }
    })

});

// ===============================================
// Borrar un usuario por el id
// ===============================================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userRemoved) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al borrar usuario', errors: err });
        } else {}

        if (!userRemoved) {
            res.status(400).json({ ok: false, message: 'No existe un usuario con ese id', errors: { message: 'No existe un usuario con ese id' } });

        } else {
            res.status(200).json({ ok: true, user: userRemoved });
        }
    })
});

module.exports = app;