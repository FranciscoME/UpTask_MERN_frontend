import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import Tarea from '../components/Tarea';
import Alerta from '../components/Alerta';
import Colaborador from '../components/Colaborador';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import useAdmin from '../hooks/useAdmin';
import io from 'socket.io-client'

let socket;


const Proyecto = () => {

  const params = useParams();
  const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto,actualizarTareaProyecto,cambiarEstadoTarea } = useProyectos();

  const { nombre, _id } = proyecto;
  // console.log(proyecto);

  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  // if (!proyecto) {
  //   return 'cargando tarea'
  // }

  // useEffect(() => {
  //   obtenerProyecto(params.id)
  // }, [proyecto.tareas])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('abrir proyecto', params.id);
  }, [])

  // useEffect(() => {
  //   socket.on('respuesta', (persona) => {
  //     console.log(persona);
  //   })
  // })

  // let nuevo=true;
  useEffect(() => {
    socket.on('tarea agregada', (tareaNueva) => {
      const {tarea} = tareaNueva;
      if (tarea.proyecto === proyecto._id) {
        console.log('tarea');
        submitTareasProyecto(tarea)
        // const audio = document.createElement("audio");
        // audio.preload = "auto";
        // audio.src = "../../assets/audio/beep.mp3";
        // audio.play();
        // document.body.appendChild(audio);
      }
    })

    socket.on('tarea eliminada', (tareaEliminada) => {
      if (tareaEliminada.proyecto === proyecto._id) {
        // TODO: Actualizar el DOM
        eliminarTareaProyecto(tareaEliminada);
      }
    })


    socket.on('tarea actualizada', (tareaActualizada) => {
      if (tareaActualizada.proyecto._id === proyecto._id) {
        // TODO: Actualizar el DOM
        actualizarTareaProyecto(tareaActualizada);
      }
    })

    socket.on('nuevo estado',(nuevoEstadoTarea)=>{
      if(nuevoEstadoTarea.proyecto._id=== proyecto._id){
        cambiarEstadoTarea(nuevoEstadoTarea);
      }
    })


  })

  const { msg } = alerta;

  const admin = useAdmin();


  return (
    cargando ? ('Cargando..')
      : (

        <>
          <div className='flex justify-between'>
            <h1 className='font-blak text-4xl'>{nombre}</h1>
            {admin && (
              <div className='flex items-center gap-1 text-gray-500 hover:text-black'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <Link
                  to={`/proyectos/editar/${_id}`}
                  className='uppercase font-bold'
                >
                  Editar</Link>
              </div>
            )
            }


          </div>

          {admin && (
            <button
              onClick={handleModalTarea}
              type='button'
              className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Crear tarea</button>
          )
          }
          <p
            className='font-bold text-xl mt-10'
          >Tareas del proyecto</p>



          <div className='bg-white shadow mt-10 rounded-lg'>
            {proyecto.tareas?.length ?
              proyecto.tareas?.map(tarea => (
                <Tarea
                  key={tarea._id}
                  tarea={tarea}
                />
              ))
              : <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
          </div>

          {admin && (
            <>
              <div className='flex items-center justify-between'>
                <p className='font-bold text-xl '>Colaboradores</p>
                <Link
                  to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                  className='text-gray-400 uppercase font-bold hover:text-black'
                >Agregar</Link>
              </div>

              <div className='bg-white shadow mt-10 rounded-lg'>
                {proyecto.colaboradores?.length ?
                  proyecto.colaboradores?.map(colaborador => (
                    <Colaborador
                      key={colaborador._id}
                      colaborador={colaborador}
                    />
                  ))
                  : <p className='text-center my-5 p-10'>No hay colaboradores</p>}
              </div>
            </>
          )}


          <ModalFormularioTarea
          />
          <ModalEliminarTarea />

          <ModalEliminarColaborador />

        </>





      )
  )
}

export default Proyecto