import { useState, useEffect, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getConfig } from '../../../config/api'
import { CONFIG_INICIAL } from '../../../config/constants'
import { sonarAlerta } from '../../../utils/alerta'
import { avisarNuevosPedidos } from '../../../utils/avisoPedidos'
import { usePedidosEnVivo } from '../hooks/usePedidosEnVivo'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

const TITULO_BASE = 'Grano de Oro'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [config, setConfig] = useState(CONFIG_INICIAL)
  // El menú móvil queda abierto solo en la ruta donde se abrió: al navegar se cierra solo
  const [rutaMenuAbierto, setRutaMenuAbierto] = useState(null)
  const menuMovilAbierto = rutaMenuAbierto === pathname
  const [sonido, setSonido] = useState(() => {
    try { return localStorage.getItem('sonidoPedidos') !== 'off' } catch { return true }
  })

  const actualizarConfig = useCallback((nueva) => setConfig((prev) => ({ ...prev, ...nueva })), [])

  const alternarSonido = () => {
    const nuevo = !sonido
    setSonido(nuevo)
    try { localStorage.setItem('sonidoPedidos', nuevo ? 'on' : 'off') } catch { /* sin localStorage: no se recuerda la preferencia */ }
    if (nuevo) sonarAlerta()
  }

  const avisarNuevos = useCallback((nuevos) => {
    if (sonido) sonarAlerta()
    avisarNuevosPedidos(nuevos, { onVer: () => navigate('/admin/pedidos') })
  }, [sonido, navigate])

  const pedidosVivo = usePedidosEnVivo({ onNuevo: avisarNuevos })
  const sinAtender = pedidosVivo.pedidos.filter((p) => p.estado === 'Nuevo').length

  useEffect(() => {
    document.title = sinAtender > 0 ? `(${sinAtender}) Nuevos pedidos • ${TITULO_BASE}` : TITULO_BASE
    return () => { document.title = TITULO_BASE }
  }, [sinAtender])

  useEffect(() => {
    let activo = true
    getConfig()
      .then((datos) => activo && actualizarConfig(datos))
      .catch(() => {})
    return () => { activo = false }
  }, [actualizarConfig])

  useEffect(() => {
    document.body.style.overflow = menuMovilAbierto ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [menuMovilAbierto])

  return (
    <div className="min-h-screen bg-espresso-900">
      <AdminHeader
        enLinea={pedidosVivo.enLinea}
        sonido={sonido}
        onAbrirMenu={() => setRutaMenuAbierto(pathname)}
        onAlternarSonido={alternarSonido}
        onCerrarSesion={() => { logout(); navigate('/admin/login') }}
      />
      <AdminSidebar
        abierto={menuMovilAbierto}
        onCerrar={() => setRutaMenuAbierto(null)}
        sinAtender={sinAtender}
        config={config}
      />
      <main className="pt-16 md:ml-60">
        <Outlet context={{ config, actualizarConfig, pedidosVivo }} />
      </main>
    </div>
  )
}
