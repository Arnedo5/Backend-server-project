var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    active: { type: Boolean, required: [true, 'El campo "active", es necesario'] }
}, { collection: 'companies' });

module.exports = mongoose.model('Company', companySchema);