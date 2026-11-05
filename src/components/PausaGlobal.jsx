import { useState, useEffect } from 'react'
import { getConfig, escucharCambios } from '../config/api'
import { verificarDisponibilidad } from '../utils/tienda'
import ClosedNotice from './ClosedNotice'

const REFRESCO_MS = 5000

// Bloqueo global: si la tienda está en pausa temporal, TODAS las rutas (menú, login y panel de admin)
// muestran únicamente el aviso de pausa. Se consulta la configuración al entrar y se mantiene al día solo.
export default function PausaGlobal({ children }) {
  const [config, setConfig] = useState(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    let activo = true

    const refrescar = async () => {
      if (document.hidden) return
      try {
        const datos = await getConfig()
        if (activo) setConfig(datos)
      } catch {
        // Sin conexión o error del servidor: se conserva el último estado conocido y se reintenta
      } finally {
        if (activo) setListo(true)
      }
    }

    refrescar()
    const timer = setInterval(refrescar, REFRESCO_MS)
    document.addEventListener('visibilitychange', refrescar)
    window.addEventListener('online', refrescar)
    const dejarDeEscuchar = escucharCambios(refrescar)

    return () => {
      activo = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refrescar)
      window.removeEventListener('online', refrescar)
      dejarDeEscuchar()
    }
  }, [])

  // Evita que se vea un instante el panel o el menú antes de saber si hay pausa
  if (!listo) return <div className="min-h-dvh bg-espresso-900" />

  if (config?.pausado) {
    return <ClosedNotice config={config} nextOpening={verificarDisponibilidad(config).proximaApertura} />
  }

  return children
}
