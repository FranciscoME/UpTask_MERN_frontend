import React from 'react'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';


const ConfirmarCuenta = () => {

  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const { id } = useParams();

  useEffect(() => {

    const confirmarCuenta = async () => {
      try {
      // TODO: Mover hacia un cliente axios
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios.get(url);
        setAlerta({
          msg: data.msg,
          error: false
        });
        setCuentaConfirmada(true);
      }
      catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    confirmarCuenta();
  }, [])


  const { msg } = alerta;

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>Confirma tu cuenta y comienza a crear tus
        <span className='text-slate-700'> proyectos</span>
      </h1>

      <div className='mt-10 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada&& (
         <Link
         to='/'
         className='block text-center text-slate-500 uppercase text-sm'>Iniciar sesion</Link>
        )}
      </div>

    </>
  )
}

export default ConfirmarCuenta