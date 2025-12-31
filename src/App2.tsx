import { useState } from 'react'
import './index.css'
import LogoLex from './assets/img/logos/logo_lex.png'

function App() {
  return (
    <>
      <div className="bg-gray-900 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-3xl shadow-2xl w-100 p-8 text-center ">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <img src={LogoLex} alt="" className="h-[250px]" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Bienvenido,</h2>
          <p className="text-gray-500 text-sm mb-6">Inicia sesión para continuar</p>

          <form action="" method="post" className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de usuario</label>
              <input type="text" name="username" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <input type="password" name="password" required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>
            <button type="submit"
              className="w-full bg-[#134CA3] hover:bg-[#134ca3c9] text-gray-100 font-semibold py-2 rounded-lg transition cursor-pointer">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
