const { Schema, model, Types } = require('mongoose');

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: 'default.jpg'
    }
})

ArticuloSchema.statics.validateId = function (id) {
    return Types.ObjectId.isValid(id);
};

module.exports = model('Articulo', ArticuloSchema)