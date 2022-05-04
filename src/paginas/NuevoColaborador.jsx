import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Alerta from '../components/Alerta';
import FormularioColaborador from '../components/FormularioColaborador'
import useProyectos from '../hooks/useProyectos'

const NuevoColaborador = () => {

  // const [proyectoNombre, setproyectoNombre] = useState('');

  const { proyecto,alerta, obtenerProyecto, cargando, colaborador,agregarColaborador } = useProyectos();
  const params = useParams();

  const { nombre } = proyecto;

  useEffect(() => {
    obtenerProyecto(params.id);
  }, [])


  if (!proyecto?._id) {
    return <Alerta alerta={alerta}/>
  }


  return (
    <>
      <h1 className='text-4xl font-black'>Agregar Colaborador(a) al proyecto: {nombre} </h1>

      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>

      {cargando ? <p className="text-center">Cargando...</p> : colaborador?._id && (
        <div className='flex justify-center mt-10 w-full'>
          <div className='bg-white py-10 px-5  rounded-lg shadow w-full'>
            <h2 className='text-center mb-10 text-2xl font-bold'>Resultado:</h2>
            <div className='flex justify-between items-center'>
              <p>{colaborador.nombre}</p>

              <button
              type='button'
              className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white'
              onClick={()=> agregarColaborador({
                email:colaborador.email}
                )
                }
              >Agregar al proyecto</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NuevoColaborador