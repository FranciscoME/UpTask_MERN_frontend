import React, { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';


let socket;
const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [tarea, setTarea] = useState({});
  // modal tarea
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  // modal eliminarTarea
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  // Colaboradores
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
  const [colaborador, setColaborador] = useState({});

  // Buscador
  const [modalBuscador, setModalBuscador] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();



  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        const { data } = await clienteAxios('/proyectos', config);
        setProyectos(data);
        // console.log(data);
        // setLoading(false);

      } catch (error) {
        console.log(error);
      }

    }
    obtenerProyectos()
  }, [auth])



  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({})
    }, 4000);
  }

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, [])


  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto)
    }
    else {
      await nuevoProyecto(proyecto)
    }
    return;

  }

  const editarProyecto = async (proyecto) => {
    // console.log('editando');
    try {
      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);
      console.log(data);

      // Sincronizar el state
      const proyectosActualizados = proyectos.map(proyectoState =>
        proyectoState._id === data._id ? data : proyectoState
      )

      setProyectos(proyectosActualizados);

      // Mostrar la alerta

      mostrarAlerta({
        msg: 'Proyecto actualizado correctamente',
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);


      // Redireccionar

    } catch (error) {
      console.log(error);
    }
  }

  const nuevoProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      // setLoading(true)

      const { data } = await clienteAxios.post('/proyectos', proyecto, config);
      mostrarAlerta({
        msg: 'Proyecto creado correctamente',
        error: false
      })
      setProyectos([...proyectos, data]);
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
      // setLoading(false);
    }
    catch (error) {
      console.log(error);
    }
  }

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data.proyecto);

      setAlerta({})
    } catch (error) {
      navigate('/proyectos');
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      setTimeout(() => {
        setAlerta({})
      }, 3000)
    } finally {
      setCargando(false)

    }

  }

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      // setLoading(true)

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);

      // sincronizar state
      const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);
      setProyectos(proyectosActualizados);

      setAlerta({
        msg: data.msg,
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
    } catch (error) {

    }
  }

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  }

  const submitTarea = async (tarea) => {

    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }



  }

  const crearTarea = async (tarea) => {
    const token = localStorage.getItem('token')
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios.post('/tareas', tarea, config);
      // console.log(data);

      setAlerta({})
      setModalFormularioTarea(false)

      // SOCKET IO
      socket.emit('nueva tarea', data);

    } catch (error) {
      console.log(error);
    }
  }

  const editarTarea = async (tarea) => {

    const token = localStorage.getItem('token')
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);
      console.log(data);

      // SOCKET
      socket.emit('actualizar tarea',data)

      // Limpiamos y cerramos 
      setAlerta({});
      setModalFormularioTarea(false);


    } catch (error) {
      console.log(error);
    }
  }

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true)
  }

  const handleModalEliminarTarea = (tarea) => {
    setModalEliminarTarea(!modalEliminarTarea);
    setTarea(tarea);
  }

  const eliminarTarea = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);
      setAlerta({
        msg: data.msg,
        error: false
      });



      // Limpiamos y cerramos 
      setModalEliminarTarea(false);

      // socket
      socket.emit('eliminar tarea', tarea)
      setTarea({})
      setTimeout(() => {
        setAlerta({})
      }, 2000);


    } catch (error) {
      console.log(error);
    }

  }

  const submitColaborador = async (email) => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config);
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    } finally {
      setCargando(false);
    }
  }

  const agregarColaborador = async (email) => {
    const token = localStorage.getItem('token')
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
    try {
      const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setAlerta({})
    } catch (error) {

      setAlerta({
        msg: error.response.data.msg,
        error: true,
      })
      setColaborador({})
      setTimeout(() => {
        setAlerta({})
      }, 3000);

      // setAlerta({})
    }
  }

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    if (!colaborador)
      return;
    setColaborador(colaborador);
  }

  const eliminarColaborador = async () => {

    try {
      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      // console.log(colaborador);
      const { data } = await clienteAxios.post(`proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);

      const proyectoActualizado = { ...proyecto };

      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState =>
        colaboradorState._id !== colaborador._id
      )

      setProyecto(proyectoActualizado);

      setAlerta({
        msg: data.msg,
        error: false
      })

      setColaborador({});
      setModalEliminarColaborador(false);

      setTimeout(() => {
        setAlerta({})
      }, 3000);


    } catch (error) {
      console.log(error.response);
    }

  }

  const completarTarea = async (id) => {
    try {

      const token = localStorage.getItem('token')
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);

      socket.emit('cambiar estado',data)
      setTarea({});
      setAlerta({});
    } catch (error) {
      console.log(error.response);
    }
  }

  const handleModalBuscador = () => {
    setModalBuscador(!modalBuscador);
  }

  // Socket io
  const submitTareasProyecto = (tarea) => {
    // Agregar la tarea al state
    const proyectoActualizado = { ...proyecto }
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado)

    // var synth = window.speechSynthesis;
    //     var toSpeak = new SpeechSynthesisUtterance('Nuevo proyecto: ');
    //     synth.speak(toSpeak);
  }

  const eliminarTareaProyecto = (tareaEliminada) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter((tareaState) => {
      return tareaState._id !== tareaEliminada._id
    })
    // console.log(proyectoActualizado.tareas);
    setProyecto(proyectoActualizado);
  }

  const actualizarTareaProyecto = (tarea)=>{
    // TODO: Actualizar el DOM
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas =
      proyectoActualizado.tareas.map((tareaState) =>
        tareaState._id === tarea._id ? tarea : tareaState
      )

    setProyecto(proyectoActualizado);
  }

  const cambiarEstadoTarea = (tarea)=>{
    const proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>
        tareaState._id === tarea._id ? tarea : tareaState
      )
      setProyecto(proyectoActualizado);
  }

  const cerrarSesionProyectos = ()=>{
    setProyectos([]);
    setProyecto({});
    setAlerta({});
  }


  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        alerta,
        proyecto,
        cargando,
        modalFormularioTarea,
        tarea,
        modalEliminarTarea,
        colaborador,
        modalEliminarColaborador,
        modalBuscador,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        eliminarProyecto,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        handleModalBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        actualizarTareaProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )

}

export { ProyectosProvider }

export default ProyectosContext; 