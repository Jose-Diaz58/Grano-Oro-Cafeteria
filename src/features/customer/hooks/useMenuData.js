import { useState, useEffect, useRef } from 'react'
import { getProducts, getExtras, getConfig, getCategories, escucharCambios } from '../../../config/api'
import { SPLASH_MS } from '../../../config/constants'

const REFRESCO_MS = 5000

// Productos (con sus extras) y nombres de las categorías visibles
const cargarMenu = async ({ tolerante }) => {
  const [productos, extras, categorias] = await Promise.all([
    getProducts(),
    tolerante ? getExtras().catch(() => []) : getExtras(),
    tolerante ? getCategories().catch(() => []) : getCategories(),
  ])
  return {
    productos: productos.map((prod) => ({
      ...prod,
      extras: extras.filter((ex) => (ex.productos || []).includes(prod._id)),
    })),
    categorias: categorias.filter((cat) => cat.visible !== false).map((cat) => cat.nombre),
  }
}

// Solo reemplaza el estado si el contenido cambió, para no re-renderizar ni parpadear imágenes
const actualizarSiCambio = (setEstado, nuevo) =>
  setEstado((prev) => (JSON.stringify(prev) === JSON.stringify(nuevo) ? prev : nuevo))

// Carga el menú público: productos, categorías y configuración de la tienda.
// `cargando` se mantiene en true al menos SPLASH_MS para que se vea la pantalla de bienvenida.
// Después se mantiene al día solo: cada pocos segundos, al volver a la pestaña y al instante
// cuando el panel de administración (en otra pestaña del mismo navegador) guarda un cambio.
export function useMenuData() {
  const [config, setConfig] = useState(null)
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const ocupado = useRef(false)

  useEffect(() => {
    let activo = true

    const cargar = async () => {
      const esperaMinima = new Promise((resolve) => setTimeout(resolve, SPLASH_MS))

      const configPromesa = getConfig()
        .then((datos) => activo && setConfig(datos))
        .catch(() => {})

      const menuPromesa = cargarMenu({ tolerante: true }).then((menu) => {
        if (!activo) return
        setProductos(menu.productos)
        setCategorias(menu.categorias)
      })

      try {
        await Promise.all([esperaMinima, menuPromesa, configPromesa])
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()
    return () => { activo = false }
  }, [])

  useEffect(() => {
    if (cargando) return
    let activo = true

    const refrescar = async () => {
      if (ocupado.current || document.hidden) return
      ocupado.current = true
      try {
        const [menu, datosConfig] = await Promise.all([cargarMenu({ tolerante: false }), getConfig()])
        if (!activo) return
        actualizarSiCambio(setProductos, menu.productos)
        actualizarSiCambio(setCategorias, menu.categorias)
        actualizarSiCambio(setConfig, datosConfig)
      } catch {
        // Sin conexión o error del servidor: se conserva lo último que se mostró y se reintenta
      } finally {
        ocupado.current = false
      }
    }

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
  }, [cargando])

  return { config, productos, categorias, cargando }
}