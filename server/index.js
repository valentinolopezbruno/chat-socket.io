import express from "express";
import logger from "morgan";
import http from "http";
import {Server as SocketServer} from "socket.io";

const port = process.env.PORT ?? 3000

const app = express();

// Primero creo el sv, porque es lo que pide Socket.io
const server = http.createServer(app);
const io = new SocketServer(server);

// Modulo para las peticiones de morgan.
app.use(logger("dev"))

app.get("/", (req,res) => {
    res.send("ez")
})

io.on("connection", socket => {
    // Cada socket tiene un ID
    console.log("Cliente Conectado, ID: ", socket.id)

    socket.on("usuarioBack", (data) => {
        // Le asigno un nombre de usuario al socket.id
        console.log("Usuario: ", data)
        // io.emit hace que TODOS los usuarios reciban la alerta de que alguien entro al chat, es decir
        // alguien entro a la url y por lo tanto se lo envio al front.
        io.emit("usuarioFront", {
            nombre: data,
            from: socket.id,
            mensajes:[]
        })
    })

    // Recibo los datos desde el front con "mensajeBack, como nombre del evento"
    // se llama mensajeBack porque el backend es quien lo recibe.
    socket.on("mensajeBack", (data) => {
        // Esto se lo estoy enviando nuevamente al front
        socket.broadcast.emit("mensajeFront", {
            body: data.mensaje,
            from: data.destinatario,
            emisor: data.emisor
        })
    })
})

server.listen(port, () => {
    console.log("Server Corriendo en Puerto: ", port)
})