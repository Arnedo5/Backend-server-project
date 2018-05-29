var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

// Models
/*
var Company = require('../models/company');
var Employe = require('../models/employe');
var Users = require('../models/user');
*/

// default options
app.use(fileUpload());


//Rutas
app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;


    //Tipos de colección
    var validTypes = ['user', 'company', 'employe'];

    if (!req.files) {
        res.status(400).json({ ok: false, message: 'No subio nada.', errors: { message: 'Debe seleccionar una imagen.' } });
    } else {
        // obtener nombre del archivo
        var file = req.files.image;
        var cutName = file.name.split('.');
        var extension = cutName[cutName.length - 1];

        // Solo estas extensiones acepttamos;
        var correctExtentions = ['png', 'jpg', 'gif', 'jpeg'];

        if (correctExtentions.indexOf(extension) < 0) {
            res.status(400).json({ ok: false, message: 'Extensión no válida', errors: { message: 'Las exptensiones válidas son: ' + correctExtentions.join(', ') } });
        } else {
            if (validTypes.indexOf(type) < 0) {
                res.status(400).json({ ok: false, message: 'Tipo de colección no es válida.', errors: { message: 'Las colecciones validas son ' + validTypes.join(', ') } });
            } else {

                // Si no existe la carpeta - se crea
                if (!fs.existsSync(`./uploads/${ type }`)) {
                    fs.mkdir(`./uploads/${ type }`);
                }

                // Nombre de archivo personalizado
                var fileName = `${id}-${ new Date().getMilliseconds()}.${extension}`;

                //Mover el archivo
                var path = `./uploads/${ type }/${fileName}`;

                file.mv(path, err => {
                    if (err) {
                        res.status(500).json({ ok: false, message: 'Error al mover el archivo.', errors: err });
                    } else {
                        uploadImgType(type, id, fileName, path, res)
                            //res.status(200).json({ ok: true, message: 'Archivo movido.', extension: extension });
                    }
                })
            }
        }
    }

});

function uploadImgType(type, id, fileName, path, res) {

    var Model = require(`../models/${ type }`);
    //res.status(400).json({ ok: false, capitalize: capitalize });

    Model.findById(id, (err, model) => {

        if (err) {
            fs.unlink(path);
            res.status(500).json({ ok: false, message: `Error el buscar el ${ type }`, errors: { message: `No existe el ${ type } con la id: ${ id }` } });
        } else {

            if (model) {
                //Si existe elimina la imagen anterior
                if (model.img) {
                    var oldPath = `./uploads/${ type }/${ model.img }`;

                    if (fs.existsSync(oldPath)) {
                        fs.unlink(oldPath);
                    }
                }

                model.img = fileName;

                model.save((err, modelUpdated) => {
                    if (err) {
                        res.status(400).json({ ok: false, message: 'Error al actualizar el usuario', errors: { message: 'No se pudo actualizar el nombre del usuario en el registro de la BBDD.' } });
                    } else {
                        res.status(200).json({ ok: true, message: 'Imagen de ususario actualizada.', user: modelUpdated });
                    }
                });
            } else {
                fs.unlink(path);
                res.status(400).json({ ok: false, message: `Error el buscar el ${ type }`, errors: { message: `No existe el ${ type } con la id: ${ id }` }, path: path });
            }

        }
    })

    //res.status(400).json({ ok: false, message: 'Tipos de busqueda incorrecto.', error: { message: 'Tipo de tabla/coleccion no válido.' } });

}

module.exports = app;