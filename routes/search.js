var express = require('express');

var app = express();

// Models
var Company = require('../models/company');
var Employe = require('../models/employe');
var User = require('../models/user');

// ===============================================
// Busqueda por colección
// ===============================================
app.get('/colection/:table/:search', (req, res, next) => {

    var table = req.params.table;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {

        case 'companies':
            promise = searchCompanies(search, regex);
            break;
        case 'employees':
            promise = searchEmployees(search, regex);
            break;
        case 'users':
            promise = searchUsers(search, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'Tipos de busqueda incorrecto.',
                error: { message: 'Tipo de tabla/coleccion no válido.' }
            });
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })




});

// ===============================================
// Busqueda general
// ===============================================

app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([
        searchCompanies(search, regex),
        searchEmployees(search, regex),
        searchUsers(search, regex)
    ]).then(responses => {
        res.status(200).json({
            ok: true,
            companies: responses[0],
            employees: responses[1],
            users: responses[2]
        });
    });

});

function searchCompanies(search, regex) {

    return new Promise((resolve, reject) => {
        Company.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, companies) => {

                if (err) {
                    reject('Error al cargar las compañias. ', err)
                } else {
                    resolve(companies);
                }
            });
    });

};

function searchEmployees(search, regex) {

    return new Promise((resolve, reject) => {
        Employe.find({ name: regex })
            .populate('user', 'name email')
            .populate('company')
            .exec((err, employees) => {

                if (err) {
                    reject('Error al cargar los empleados. ', err)
                } else {
                    resolve(employees);
                }
            });
    });

};

function searchUsers(search, regex) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([
                { 'name': regex },
                { 'email': regex }
            ]).exec((err, users) => {
                if (err) {
                    reject('Error al cargar los usuarios. ', err)
                } else {
                    resolve(users);
                }
            });
    });

}

module.exports = app;