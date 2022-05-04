import React ,{useState} from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
// import axios from 'axios';
import clienteAxios from '../config/clienteAxios';

const Registrar = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const {msg} = alerta;

  const handleSubmit = async(e) => {
    e.preventDefault();
    if([nombre, email, password, repetirPassword].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return;
    }

    if(password !== repetirPassword){
      setAlerta({
        msg: 'Las contraseñas no coinciden',
        error: true
      });
      return;
    }

    if(password.length < 6){
      setAlerta({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true
      });
      return;
    }

    setAlerta({});

    // Crear el usuario en la API
    try {

      const {data} = await clienteAxios.post(`/usuarios`,{
        nombre,
        email,
        password
      })

      setAlerta({
        msg: data.msg,
        error:false
      });

      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
      
    } catch (error) {
      setAlerta({
        msg:error.response.data.msg,
        error:true
      });
    }
  }

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra
        <span className='text-slate-700'> proyectos</span>
      </h1>
      {msg&&<Alerta alerta={alerta}/>}

      <form className='my-10 bg-white shadow rounded-lg p-10 '
       onSubmit = {handleSubmit}
      >

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder='Introduce tu nombre'
            name='nombre'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor="password2">Repetir Password</label>
          <input
            type="password"
            id="password2"
            placeholder='Repite tu password'
            name='password2'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />
        </div>

        <input
          type='submit'
          value='Crear cuenta'
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
          to='/olvide-password'
          className='block text-center text-slate-500 uppercase text-sm'>Olvide mi password</Link>
      </nav>

    </>
  )
}

export default Registrar