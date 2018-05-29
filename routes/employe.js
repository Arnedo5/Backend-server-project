var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//Models
var Employe = require('../models/employe');

// ===============================================
// Obtener todos los empleados
// ===============================================

app.get('/', (req, res, next) => {

    var skip = req.query.skip || 0;
    skip = Number(skip);

    Employe.find({})
        .skip(skip)
        .limit(5)
        .populate('user', 'name email')
        .populate('company')
        .exec(
            (err, employees) => {
                if (err) {
                    res.status(500).json({ ok: false, message: 'Error al cargar los empleados.', errors: err });
                } else {
                    Employe.count({}, (err, count) => {
                        if (err) {
                            res.status(500).json({ ok: false, message: 'Error al buscar el total de empleados.', errors: err });
                        } else {
                            res.status(200).json({ ok: true, total: count, employees: employees });
                        }
                    })
                }
            });
});


// ===============================================
// Crear un nuevo empleado
// ===============================================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {

    var body = req.body;

    var employe = new Employe({
        name: body.name,
        description: body.description,
        img: body.img,
        user: req.user._id,
        company: body.company,
        active: body.active
    });

    employe.save((err, employeSaved) => {
        if (err) {
            res.status(400).json({ ok: false, message: 'Error el crear el empleado.', errors: err });
        } else {
            res.status(201).json({ ok: true, employe: employeSaved, userToken: req.user });
        }

    });

});


// ===============================================
// Actualizar empleado
// ===============================================

app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Employe.findById(id, (err, employe) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error al buscar el empleado.', errors: err });
        }

        if (!employe) {
            res.status(400).json({ ok: false, message: 'El empleado con la id: ' + id + ' no etiste.', errors: { message: 'No existe el empleado con ese ID.' } });
        } else {
            employe.name = body.name;
            employe.description = body.description;
            employe.img = body.img;
            employe.user = req.user._id;
            employe.company = body.company;
            employe.active = body.active;

            employe.save((err, employeSaved) => {
                if (err) {
                    res.status(400).json({ ok: false, message: 'Error al actualizar el empleado.', errors: err });
                } else {
                    res.status(200).json({ ok: true, employe: employeSaved });
                }
            });
        }
    })

});

// ===============================================
// Borrar un empleado
// ===============================================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;

    Employe.findByIdAndRemove(id, (err, employeRemoved) => {
        if (err) {
            res.status(500).json({ ok: false, message: 'Error el empleado.', errors: err });
        } else {}
        if (!employeRemoved) {
            res.status(400).json({ ok: false, message: 'No existe un empleado con esta id.', errors: { message: 'No existe un empleado con esta id.' } });
        } else {
            res.status(200).json({ ok: true, employe: employeRemoved });
        }
    })
});


module.exports = app;