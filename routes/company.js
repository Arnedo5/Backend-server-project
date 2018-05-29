var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


//Models
var Company = require('../models/company');


// ===============================================
// Obtener todas las compañias
// ===============================================

app.get('/', (req, res, next) => {

    var skip = req.query.skip || 0;
    skip = Number(skip);

    Company.find({})
        .skip(skip)
        .limit(5)
        .populate('user', 'name email')
        .exec(
            (err, companies) => {
                if (err) {
                    res.status(500).json({ ok: false, message: 'Error al cargar las empresas.', errors: err });
                } else {
                    Company.count({}, (err, count) => {
                        if (err) {
                            res.status(500).json({ ok: false, message: 'Error al buscar el total de empresas', errors: err });
                        } else {
                            res.status(200).json({ ok: true, total: count, companies: companies });
                        }
                    })
                }
            });

});


// ===============================================
// Crear nueva empresa
// ===============================================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {

    var body = req.body;

    var company = new Company({
        name: body.name,
        description: body.description,
        img: body.img,
        user: req.user._id,
        active: body.active
    });

    company.save((err, companySaved) => {
        if (err) {
            res.status(400).json({ ok: false, message: 'Error el crear la empresa.', errors: err });
        } else {
            res.status(201).json({ ok: true, company: companySaved, userToken: req.user });
        }

    });

});


// ===============================================
// Actualizar empresa
// ===============================================

app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Company.findById(id, (err, company) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al buscar la empresa.', errors: err });
        }

        if (!company) {
            res.status(400).json({ ok: false, message: 'La empresa con la id: ' + id + ' no etiste.', errors: { message: 'No existe la empresa con ese ID.' } });
        } else {
            company.name = body.name;
            company.description = body.description;
            company.img = body.img;
            company.user = req.user._id;
            company.active = body.active;

            company.save((err, companySaved) => {
                if (err) {
                    res.status(400).json({ ok: false, message: 'Error al actualizar la empresa.', errors: err });
                } else {
                    res.status(200).json({ ok: true, company: companySaved });
                }
            });
        }
    })

});


// ===============================================
// Borrar una empresa por el id
// ===============================================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;

    Company.findByIdAndRemove(id, (err, companyRemoved) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al borrar la empresa.', errors: err });
        } else {}

        if (!companyRemoved) {
            res.status(400).json({ ok: false, message: 'No existe una empresa con esta id.', errors: { message: 'No existe una empresa con esta id.' } });

        } else {
            res.status(200).json({ ok: true, company: companyRemoved });
        }
    })
});

module.exports = app;