import io from "socket.io-client";
import "./App.css";
import { useState, useEffect } from "react";

// Coneccion al Backend.
const socket = io("/");

function App() {
  const [getMensaje, setMensaje] = useState("");
  const [getMensajes, setMensajes] = useState([]);

  const enviarMensaje = (e) => {
    e.preventDefault();
    // Antes de mandarlo guardo el mensaje en un array de mensajes para poder verlo por pantalla.
    setMensajes([...getMensajes, { body: getMensaje, from: "Me" }]);
    // Le envio al back la variable de getMensaje por medio del "nombre del evento, mensaje"
    socket.emit("mensajeBack", getMensaje);
  };

  useEffect(() => {
    // Recibo el mensaje desde el Front y lo guardo en el arreglo de mensajes.
    socket.on("mensajeFront", (mensaje) => {
      recibirMensaje(mensaje);
    });

    return () => {
      socket.off("mensajeFront");
    };
  });

  // Actualiza los mensajes sin necesidad de resetear la variable.
  const recibirMensaje = (mensaje) =>
    setMensajes((state) => [...state, mensaje]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={enviarMensaje} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2"> Socket.io Practice</h1>
        <input
          type="text"
          placeholder="Escribí tu mensaje..."
          onChange={(e) => setMensaje(e.target.value)}
          className=" text-black border-2 border-zinc-500 p-2 w-full"
        />
        <button>Send</button>

        <ul>
          {getMensajes.map((mensaje, i) => (
            <li key={i} className="my-2 p-2 table text-sm rounded-md bg-sky-700">
              {mensaje.from}:{mensaje.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
