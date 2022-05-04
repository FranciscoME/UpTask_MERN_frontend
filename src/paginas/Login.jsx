import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const {auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }


    try {
      const { data } = await clienteAxios.post('/usuarios/login', { email, password });
      setAlerta({});
      localStorage.setItem('token', data.token);
      setAuth(data);
      navigate('/proyectos');
    } catch (error) {
      console.log(error.response.data.msg);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    
  }

  const { msg } = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Inicia Sesion y Administra tus
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}

      <form className='my-10 bg-white shadow rounded-lg p-10 '
        onSubmit={handleSubmit}
      >
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder='Email de Registro'
            name='email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder='Password de registro'
            name='password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          type='submit'
          value='Iniciar Sesion'
          className='w-full mt-5 py-3 mb-5 bg-sky-700 text-white rounded uppercase font-bold
            hover:bg-sky-800 cursor-pointer focus:outline-none focus:shadow-outline transition-colors
          '
        />
      </form>
      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/registrar'
          className='block text-center text-slate-500 uppercase text-sm'>No tienes una cuenta? Registrate</Link>

        <Link
          to='/olvide-password'
          className='block text-center text-slate-500 uppercase text-sm'>Olvide mi password</Link>
      </nav>

    </>
  )
}

export default Login