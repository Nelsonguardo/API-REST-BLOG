const express = require('express');
const multer = require('multer');

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/');
    },

    filename: (req, file, cb) => {
        cb(null,"articulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({ storage: almacenamiento });

const ArticuloController = require('../controladores/Articulo');
//Rutas de prueba
router.get('/ruta-de-prueba', ArticuloController.prueba);
router.get('/datos-personales', ArticuloController.datos_personales);

//ruta util
router.post('/crear', ArticuloController.crear);
router.post('/subir-imagen/:id', [subidas.single("file0")] ,ArticuloController.subir);
router.get('/imagen/:fichero', ArticuloController.imagen);
router.get('/articulos/:ultimos?', ArticuloController.listar);
router.get('/articulo/:id', ArticuloController.uno);
router.get('/buscar/:busqueda', ArticuloController.buscar);
router.put('/articulo/:id', ArticuloController.editar);
router.delete('/articulo/:id', ArticuloController.borrar);

module.exports = router
