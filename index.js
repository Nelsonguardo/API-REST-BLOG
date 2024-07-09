const { conexion } = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

//Conectar a la base de datos
conexion();

//Crear servidor
const app = express();
const puerto = 3900;

//configur cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());//recibir datos en formato json
app.use(express.urlencoded({ extended: true }));//recibir datos en formato urlencoded

//crear rutas
const rutas_articulo = require('./rutas/Articulo');

//cargo las rutas
app.use('/api', rutas_articulo);

//Rutas de prueba
app.get("/", (req, res) => {
    console.log("se ha ejecutado el  endpoint Probando");
    return res.status(200).send( "<h1>Hola</h1>" );
});

//crear servidor y escuchar peticiones
app.listen(puerto, () => {
    //console.log('Servidor corriendo en el puerto ' + puerto);
})