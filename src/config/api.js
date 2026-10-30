const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Aviso entre pestañas del mismo navegador: cualquier cambio (POST/PUT/DELETE) hace que las demás vistas se refresquen al instante
const CANAL = 'grano-de-oro-cambios'
const canalEmisor = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CANAL)

export function escucharCambios(alCambiar) {
  if (typeof BroadcastChannel === 'undefined') return () => {}
  const canal = new BroadcastChannel(CANAL)
  canal.onmessage = alCambiar
  return () => canal.close()
}

async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  const datos = await res.json().catch(() => null)
  if (!res.ok) throw new Error(datos?.message ?? `Error del servidor (${res.status})`)
  if (metodo !== 'GET') canalEmisor?.postMessage('cambio')
  return datos
}

export const getProducts = () => pedir('/productos/buscar')
export const createProduct = (producto) => pedir('/productos/crear', { metodo: 'POST', cuerpo: producto })
export const updateProduct = (id, cambios) => pedir(`/productos/actualizar/${id}`, { metodo: 'PUT', cuerpo: cambios })
export const deleteProduct = (id) => pedir(`/productos/eliminar/${id}`, { metodo: 'DELETE' })

export const getCategories = () => pedir('/categorias/buscar')
export const createCategory = (categoria) => pedir('/categorias/crear', { metodo: 'POST', cuerpo: categoria })
export const updateCategory = (id, cambios) => pedir(`/categorias/actualizar/${id}`, { metodo: 'PUT', cuerpo: cambios })
export const deleteCategory = (id) => pedir(`/categorias/eliminar/${id}`, { metodo: 'DELETE' })
export const reorderCategories = (ids) => pedir('/categorias/ordenar', { metodo: 'PUT', cuerpo: { ids } })

export const getExtras = () => pedir('/extras/buscar')
export const createExtra = (extra) => pedir('/extras/crear', { metodo: 'POST', cuerpo: extra })
export const updateExtra = (id, cambios) => pedir(`/extras/actualizar/${id}`, { metodo: 'PUT', cuerpo: cambios })
export const deleteExtra = (id) => pedir(`/extras/eliminar/${id}`, { metodo: 'DELETE' })

// El API puede devolver el documento o una lista con un solo documento
export const getConfig = async () => {
  const datos = await pedir('/configuracion/buscar')
  return Array.isArray(datos) ? (datos[0] ?? null) : datos
}
export const updateConfig = (config) => pedir('/configuracion/actualizar', { metodo: 'PUT', cuerpo: config })

export const createOrder = (pedido) => pedir('/ventas/crear', { metodo: 'POST', cuerpo: pedido })
export const getOrders = (limite) => pedir(limite ? `/ventas/buscar?limite=${limite}` : '/ventas/buscar')
export const updateOrderStatus = (id, estado) => pedir(`/ventas/actualizar/${id}`, { metodo: 'PUT', cuerpo: { estado } })