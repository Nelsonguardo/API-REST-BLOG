const fs = require('fs');
const path = require('path');
const { ValidarArticulo } = require('../helpers/validar');
const Articulo = require('../modelos/Articulo');

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba"
    });
};

const datos_personales = (req, res) => {
    return res.status(200).send({
        nombre: "Nelson",
        apellido: "Guardo",
        edad: 24
    });
}

const crear = async (req, res) => {
    // Recoger parámetros por post a guardar
    const parametros = req.body;
    // Validar datos
    try {
        ValidarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }
    try {
        // Crear el objeto a guardar
        const articulo = new Articulo(parametros);
        // Guardar en la base de datos
        const articuloGuardado = await articulo.save();
        // Retornar respuesta
        return res.status(200).json({
            status: "success",
            articuloGuardado,
            mensaje: "Articulo guardado correctamente"
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el articulo"
        });
    }
}

const listar = async (req, res) => {
    try {
        let query = Articulo.find({});
        if (req.params.ultimos) {
            query = query.limit(req.params.ultimos);
        }

        query = query.sort({ fecha: -1 });
        const articulos = await query.exec();

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }
        return res.status(200).json({
            status: "success",
            parametero: req.params.ultimos,
            contador: articulos.length,
            articulos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar artículos"
        });
    }
}


const uno = async (req, res) => {
    try {
        // Recoger id por url
        let id = req.params.id;
        // Validar id
        if (Articulo.validateId(id)) {
            // Buscar el artículo
            const articulo = await Articulo.findById(id);
            // Devolver el artículo
            return res.status(200).json({
                status: "success",
                articulo
            });
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            });
        }
    } catch (error) {
        // Si hay un error, devolver un mensaje de error genérico
        console.log(error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar el artículo"
        });
    }
}

const borrar = async (req, res) => {
    try {
        let id = req.params.id;
        if (Articulo.validateId(id)) {
            // Buscar el artículo
            const articulo_borrado = await Articulo.findOneAndDelete({ _id: id });
            // Devolver el artículo
            return res.status(200).json({
                status: "success",
                articulo_borrado,
                mensaje: "Articulo borrado"
            });
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para borrar",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
}

const editar = async (req, res) => {
    try {
        let id = req.params.id;
        let parametros = req.body;

        try {
            ValidarArticulo(parametros);
        } catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }
        if (Articulo.validateId(id)) {
            // Buscar el artículo y actualizarlo
            const articulo_actualizado = await Articulo.findOneAndUpdate({ _id: id }, req.body, { new: true });
            // Devolver el artículo
            return res.status(200).json({
                status: "success",
                articulo_actualizado,
                mensaje: "Articulo Editado"
            });
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para editar",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
}

const subir = async (req, res) => {
    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            mensaje: "Peticion invalida"
        });
    }

    //Nombre del archivo
    let archivo = req.file.originalname;

    //extension del archivo
    let archivo_split = archivo.split('\.');
    let archivo_extension = archivo_split[1];

    //Comprobar  existe correcta
    if (archivo_extension != 'png' && archivo_extension != 'jpg' &&
        archivo_extension != 'jpeg' && archivo_extension != 'gif') {
        //borrar el archivo y dar respuesta
        fs.unlink(req.file.path, (err) => {
            return res.status(400).json({
                status: "error",
                mensaje: "La extension del archivo no es correcta"
            });
        })
    } else {
        //actualizar el articulo
        try {
            let id = req.params.id;
            if (Articulo.validateId(id)) {
                // Buscar el artículo y actualizarlo
                const articulo_actualizado = await Articulo.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true });
                // Devolver el artículo
                return res.status(200).json({
                    status: "success",
                    articulo_actualizado,
                    fichero: req.file,
                    mensaje: "Articulo Editado"
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró el artículo para editar",
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: error.message,
            });
        }
    }
}

const imagen = async (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = './imagenes/articulos/' + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            res.sendFile(path.resolve(ruta_fisica));
        } else {
            res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            });
        }
    })
}

const buscar = async (req, res) => {
    try {
        // Sacar el string de búsqueda
        let busqueda = req.params.busqueda;

        // Encontrar artículos que coincidan con el título o contenido
        const articulosEncontrados = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } },
            ]
        }).sort({ fecha: -1 });

        // Si no se encontraron artículos, retornar un error 404
        if (!articulosEncontrados || articulosEncontrados.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos"
            });
        }

        // Si se encontraron artículos, retornarlos
        return res.status(200).json({
            status: "success",
            articulos:articulosEncontrados
        });
    } catch (error) {
        // Manejar cualquier error
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno del servidor"
        });
    }
}


module.exports = {
    prueba,
    datos_personales,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
}