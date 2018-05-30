var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roleValidation = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VAlUE} no es un rol permitido'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necessario'] },
    password: { type: String, required: [true, 'La contraseña es necessaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roleValidation },
    google: { type: Boolean, required: false, default: false },
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('User', userSchema);