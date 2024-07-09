const mongoose = require('mongoose');
const conexion = async () => {

    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/mi_blog");
        //parametros dentro de objeto
        //useNewUrlParser: true
        //useUnifiedTopology: true
        //useCreateIndex: true
        //console.log('Base de datos conectada');
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

module.exports = {
    conexion
}