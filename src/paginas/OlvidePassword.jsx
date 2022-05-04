import { useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios';

const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({})

  const {msg}= alerta;

  const handleSubmit = async(e)=>{
    e.preventDefault();
    
    if(email ==='' || email.length <6){
      setAlerta({
        msg: 'El campo email es obligatorio',
        error:true
      });
      return;
    }

    try {
      // TODO: Mover hacia un cliente axios
      const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{email})
      setAlerta({
        msg: data.msg,
        error:false
      })
      
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error:true
      })
    }

  }


  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Recupera tu acceso y no pierdas tus
        <span className='text-slate-700'> proyectos</span>
      </h1>

      <form className='my-10 bg-white shadow rounded-lg p-10 '
       onSubmit={handleSubmit}
      >

        {msg &&<Alerta alerta={alerta}/> }

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder='Email de Registro'
            name='email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange= {(e)=> setEmail(e.target.value)}
          />
        </div>


        <input
          type='submit'
          value='Enviar instrucciones'
          className='w-full mt-5 py-3 mb-5 bg-sky-700 text-white rounded uppercase font-bold
            hover:bg-sky-800 cursor-pointer focus:outline-none focus:shadow-outline transition-colors
          '
        />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className='block text-center text-slate-500 uppercase text-sm'>Ya tienes una cuenta? inicia sesion</Link>

        <Link
          to='/registrar'
          className='block text-center text-slate-500 uppercase text-sm'>No tienes una cuenta? Registrate</Link>
      </nav>

    </>
  )
}

export default OlvidePassword