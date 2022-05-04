import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
// import axios from 'axios'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {
  const [isTokenValido, setIsTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [password, setPassword] = useState('');
  const [isPasswordModificado, setIsPasswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        // TODO Mover a un cliente axios
        await clienteAxios.get(`/usuarios/olvide-password/${token}`);
        setIsTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    comprobarToken();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true
      })
      return;
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url, {
        password
      });

      setAlerta({
        msg: data.msg,
        error: false
      });

      setIsTokenValido(false);
      setIsPasswordModificado(true);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const { msg } = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Reestablece tu password y no pierdas acceso a tus
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}

      {isTokenValido && (

        <form className='my-10 bg-white shadow rounded-lg p-10 '
          onSubmit={handleSubmit}
        >


          <div className='my-5'>
            <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="password">Nuevo Password</label>
            <input
              type="password"
              id="password"
              placeholder='Introduce tu nuevo password'
              name='password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>



          <input
            type='submit'
            value='Guardar nuevo password'
            className='w-full mt-5 py-3 mb-5 bg-sky-700 text-white rounded uppercase font-bold
          hover:bg-sky-800 cursor-pointer focus:outline-none focus:shadow-outline transition-colors
        '
          />
        </form>
      )}

      {isPasswordModificado && (
        <Link
          to='/'
          className='block text-center text-slate-500 uppercase text-sm'>Iniciar sesion</Link>
      )}


    </>

  )
}

export default NuevoPassword