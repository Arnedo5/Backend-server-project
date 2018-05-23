var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ===============================================
// Verificar token
// ===============================================
exports.verifyToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({ ok: false, message: 'Token incorrecto.', errors: err });
        } else {

            req.user = decoded.user;

            next();
            //res.status(200).json({ ok: true, decoded: decoded });
        }

    });

};