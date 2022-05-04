import React from 'react'
import useProyectos from '../hooks/useProyectos'

const Colaborador = ({colaborador}) => {
  const {handleModalEliminarColaborador, modalEliminarColaborador} =useProyectos();
  
  return (
    <div className='border-b p-5 flex justify-between'>
      <div>
      <p>{colaborador.nombre}</p> 
      <p className='text-sm text-gray-700'>{colaborador.email}</p> 
      </div>
      <div>
        <button
        type='button'
        className='bg-red-600 px-6 py-3 text-white uppercase font-bold text-sm rounded-lg'        
        onClick={()=>handleModalEliminarColaborador(colaborador)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default Colaborador