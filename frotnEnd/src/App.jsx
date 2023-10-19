import io from "socket.io-client";
import "./App.css";
import { useState, useEffect } from "react";

// Coneccion al Backend.
const socket = io("/");

function App() {
  const [getMensaje, setMensaje] = useState("");
  const [getMensajes, setMensajes] = useState([]);
  const [getUsuarios, setUsuarios] = useState([]);
  const [getUsuarioLogeado, setUsuarioLogeado] = useState(0);
  const [getUsuario, setUsuario] = useState("");
  const [getUsuarioSeleccionado, setUsuarioSeleccionado] = useState("nn");

  const enviarMensaje = (e) => {
    // Para que no se recargue la pantalla.
    e.preventDefault();
    // Antes de mandarlo guardo el mensaje en un array de mensajes para poder verlo por pantalla.
    setMensajes([...getMensajes, { body: getMensaje, from: getUsuario }]);
    // Creo un objeto para enviarle al backend con el mensaje y el usuario al que va dirigido.
    var data = {
      mensaje: getMensaje,
      destinatario: getUsuarioSeleccionado,
      emisor: getUsuario
    }
    // Le envio al back la variable de getMensaje por medio del "nombre del evento, mensaje"
    socket.emit("mensajeBack", data);
  };

  useEffect(() => {
    // Recibo el mensaje desde el Front y lo guardo en el arreglo de mensajes.
    socket.on("mensajeFront", (mensaje) => {
      recibirMensaje(mensaje);
    });

    // Recibo el usuario Logeado y lo guardo en el array de usuarios.
    socket.on("usuarioFront", (usuario) => {
      console.log("Usuario Recibido")
      console.log(usuario)
      recibirUsuario(usuario);
    });

    return () => {
      socket.off("mensajeFront");
      socket.off("usuarioFront");
    };
  });

  // Actualiza los mensajes sin necesidad de resetear la variable.
  const recibirMensaje = (mensaje) => {
    console.log("mensaje")
    console.log(mensaje)
    console.log(getUsuario)
    if(getUsuario === mensaje.from){
      setMensajes((state) => [...state, mensaje]);
    }
    console.log("getMensajes")
    console.log(getMensajes)
  }

  // Actualiza los usuarios sin necesidad de resetear la variable.
  const recibirUsuario = (usuario) =>{
  setUsuarios((state) => [...state, usuario]);
  console.log("Usuarios")
  console.log(getUsuarios)

  }


  // Logeo el usuario.
  const logearUsuario = () => {
    console.log("getUsuario")
    console.log(getUsuario)
    socket.emit("usuarioBack", getUsuario);
    setUsuarioLogeado(1)
  }



  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario.nombre)
  }

  return (
    <div className="h-screen bg-zinc-900 text-white flex items-center justify-center bg-galaxy-animation">
      {/* Si el usuario no esta logeado */}
      {getUsuarioLogeado === 0 ? (
        <div>
          <h1 className="text-2xl font-bold my-2 text-center mb-5">Ingresar tu  Usuario</h1>
          <input
              type="text"
              placeholder="Valen..."
              onChange={(e) => setUsuario(e.target.value)}
              className=" text-black border-2  p-2 w-full rounded-md "
            />
             <button className="bg-green-300 p-2 w-full mt-3 rounded-md font-bold" onClick={logearUsuario}>
              Ingresar
            </button>
          </div>
      ) : 
      /* SI ESTA LOGEADO */
      (
        <>
        <form onSubmit={enviarMensaje} className="bg-zinc-800 p-5 rounded-md ">
          <h1 className="text-2xl font-bold my-2 text-center mb-5">
            {" "}
            Practica Socket.io
          </h1>
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            onChange={(e) => setMensaje(e.target.value)}
            className=" text-black border-2  p-2 w-full rounded-md "
          />
          <button className="bg-green-300 p-2 w-full mt-3 rounded-md font-bold" >
            Enviar
          </button>
                  <ul>
          {getMensajes.map((mensaje, i) => {
            if (mensaje.emisor === getUsuarioSeleccionado ) {
              return (
                <li
                  key={i}
                  className={`my-2 p-2 table rounded-md ${
                    mensaje.emisor ? "bg-black" : "bg-sky-700 ml-auto"
                  }`}
                >
                  <span className={`text-xs text-slate-300 block`}>
                    {mensaje.emisor}
                  </span>
                  <span className="text-md">{mensaje.body}</span>
                </li>
              );
            } else return (
              <li
                  key={i}
                  className={`my-2 p-2 table rounded-md ${
                     "bg-sky-700 ml-auto"
                  }`}
                >
                  <span className={`text-xs text-slate-300 block`}>
                    {mensaje.from}
                  </span>
                  <span className="text-md">{mensaje.body}</span>
                </li>
            )
          })}
        </ul>

        </form>
        
        <div className="h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="block ml-10 bg-zinc-800 p-5 rounded-md w-100 h-60">
        <h1 className="text-2xl font-bold my-2 text-center mb-5">Usuarios del Chat</h1>

        <ul className="items-center justify-center">
            {getUsuarios.map((usuario, i) => (
              <li className={`text-m text-slate-300 cursor-pointer` }
                key={i}
                onClick={() =>seleccionarUsuario(usuario)}
              >
                  {usuario.nombre}
              </li>
            ))}
          </ul>
          </div>
      </div>
      </>
      )}


      
    </div>
  );
}

export default App;
