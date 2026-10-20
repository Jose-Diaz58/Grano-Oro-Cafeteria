import { useState, useEffect, useRef, useCallback } from 'react'
import { getOrders, updateOrderStatus } from '../api.js'

const INTERVALO_MS = 5000 // cada cuántos segundos se consulta al API

// Clave del día en hora local: "2026-10-17" (sirve para separar los pedidos de hoy de los anteriores)
export const claveDia = (fecha) => {
  const d = new Date(fecha)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Adapta un pedido del API al formato que usa el panel
export const formatear = (p) => ({
  id: p._id || p.id,
  numero: p.numero || p._id?.substring(p._id.length - 6).toUpperCase() || 'N/A',
  cliente: p.cliente || 'Cliente General',
  hora: p.createdAt
    ? new Date(p.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : 'Hoy',
  dia: p.createdAt ? claveDia(p.createdAt) : claveDia(new Date()),
  tipoServicio: p.tipoServicio || '',
  mesa: p.mesa || '',
  pago: p.pago || 'Efectivo',
  estado: p.estado || 'Nuevo',
  total: p.total || 0,
  items: p.productos || [],
  nota: p.notas || '',
})

// Consulta los pedidos cada pocos segundos y avisa (onNuevo) cuando llega alguno que no se conocía.
export function usePedidosEnVivo({ onNuevo } = {}) {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [enLinea, setEnLinea] = useState(true)

  const conocidos = useRef(null) // ids ya vistos; null = aún no hay primera carga
  const fallos = useRef(0)
  const ocupado = useRef(false)
  const onNuevoRef = useRef(onNuevo)
  useEffect(() => { onNuevoRef.current = onNuevo }, [onNuevo])

  const refrescar = useCallback(async () => {
    if (ocupado.current) return
    ocupado.current = true
    try {
      const data = await getOrders()
      const lista = (Array.isArray(data) ? data : []).map(formatear)

      if (conocidos.current) {
        const nuevos = lista.filter((p) => !conocidos.current.has(p.id))
        if (nuevos.length > 0) onNuevoRef.current?.(nuevos)
      }
      conocidos.current = new Set(lista.map((p) => p.id))

      setPedidos(lista)
      fallos.current = 0
      setEnLinea(true)
    } catch (err) {
      console.error('Error al consultar pedidos:', err)
      fallos.current += 1
      if (fallos.current >= 2) setEnLinea(false)
    } finally {
      ocupado.current = false
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    const primera = setTimeout(refrescar, 0)
    const timer = setInterval(refrescar, INTERVALO_MS)
    const alVolver = () => { if (!document.hidden) refrescar() }
    document.addEventListener('visibilitychange', alVolver)
    window.addEventListener('online', refrescar)
    return () => {
      clearTimeout(primera)
      clearInterval(timer)
      document.removeEventListener('visibilitychange', alVolver)
      window.removeEventListener('online', refrescar)
    }
  }, [refrescar])

  // Cambia el estado en el API y, si salió bien, en la lista local
  const cambiarEstado = useCallback(async (id, estado) => {
    await updateOrderStatus(id, estado)
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)))
  }, [])

  return { pedidos, cargando, enLinea, cambiarEstado, refrescar }
}
