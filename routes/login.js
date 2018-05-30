var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var PASSWORD = require('../config/config').PASSWORD;
var TOKEN_EXPIRATION = require('../config/config').TOKEN_EXPIRATION;

var app = express();

// Models
var User = require('../models/user');

// Google 
const { OAuth2Client } = require('google-auth-library');
const auth = new OAuth2Client(GOOGLE_CLIENT_ID);

var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

// ==========================================
//  Autenticación De Google
// ==========================================
app.post('/google', async(req, res) => {

    let token = req.body.token;

    const ticket = await auth.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
    }).catch(e => {
        return res.status(403).json({ ok: false, mensaje: 'Token no válido', err: e });
    })

    const googleUser = ticket.getPayload();

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({ ok: false, error: { message: "Error al buscar el ususario en la base de datos." }, errors, err });
        } else {
            if (userDB) {
                if (userDB.google === false) {
                    return res.status(400).json({ ok: false, error: { message: 'Debe de usar su autenticación normal.' } });
                } else {
                    console.log('No existe usuario');

                    //Create token
                    let token = jwt.sign({ user: userDB }, SEED, { expiresIn: TOKEN_EXPIRATION }); // 4 horas

                    return res.json({ ok: true, user: userDB, token: token, id: userDB._id });
                }
            } else {

                // Si el usuario no existe en nuestra base de datos, lo creamos
                let user = new User();

                user.name = googleUser.name;
                user.email = googleUser.email;
                user.img = googleUser.picture;
                user.google = true;
                user.password = PASSWORD;

                user.save((err, userDB) => {
                    if (err) {
                        return res.status(500).json({ ok: false, error: { message: 'Error al guardar el usuario en la base de datos.' }, errors, err });
                    } else {
                        if (userDB) {
                            //Create token
                            let token = jwt.sign({ user: userDB }, SEED, { expiresIn: TOKEN_EXPIRATION }); // 4 horas

                            return res.json({ ok: true, user: userDB, token: token, id: userDB._id });
                        } else {
                            return res.status(500).json({ ok: false, error: { message: 'Error al guardar el usuario en la base de datos.' }, errors, err });
                        }
                    }
                })
            }
        }
    });
});

// ===============================================
// Login - Normal
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
                    var token = jwt.sign({ user: userDB }, SEED, { expiresIn: TOKEN_EXPIRATION }); //4 Horas

                    res.status(200).json({ ok: true, usuario: userDB, token: token, id: userDB._id });
                }
            }
        }
    });

});




module.exports = app;