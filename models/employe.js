var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: [true, 'El id de la compañia es un campo obligatorio'] },
    active: { type: Boolean, required: [true, 'El campo "active", es necesario'] }
}, { collection: 'employees' });

module.exports = mongoose.model('Employe', employeSchema);