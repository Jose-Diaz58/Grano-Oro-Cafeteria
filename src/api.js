// Un solo lugar para hablar con el API. La URL sale de .env (VITE_API_URL)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Devuelve el JSON de la respuesta, o lanza un Error con el mensaje que mande el API
export async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
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
  return datos
}

// ---------- Productos ----------
export const getProducts = () => pedir('/productos/buscar')
export const createProduct = (producto) => pedir('/productos/crear', { metodo: 'POST', cuerpo: producto })
export const updateProduct = (id, cambios) => pedir(`/productos/actualizar/${id}`, { metodo: 'PUT', cuerpo: cambios })
export const deleteProduct = (id) => pedir(`/productos/eliminar/${id}`, { metodo: 'DELETE' })

// ---------- Extras y configuración (los lee el cliente) ----------
export const getExtras = () => pedir('/extras/buscar')
export const getConfig = () => pedir('/configuracion/buscar')

// ---------- Pedidos (ventas) ----------
export const createOrder = (pedido) => pedir('/ventas/crear', { metodo: 'POST', cuerpo: pedido })
export const getOrders = (limite) => pedir(limite ? `/ventas/buscar?limite=${limite}` : '/ventas/buscar')
export const updateOrderStatus = (id, estado) => pedir(`/ventas/actualizar/${id}`, { metodo: 'PUT', cuerpo: { estado } })
