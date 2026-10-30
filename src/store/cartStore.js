import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const cambiarCantidad = (carrito, cartItemId, delta) =>
  carrito.map((item) => (item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad + delta } : item))

export const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],

      // Un mismo producto con distinta variante o extras es un renglón distinto del carrito
      agregarAlCarrito: (producto, variante = null, extrasElegidos = []) => {
        const extras = extrasElegidos.map((e) => ({ id: e._id, nombre: e.nombre, precio: e.precio }))
        let cartItemId = variante ? `${producto._id}-${variante}` : producto._id
        if (extras.length) cartItemId += `+${extras.map((e) => e.id).sort().join(',')}`

        const { carrito } = get()
        if (carrito.some((item) => item.cartItemId === cartItemId)) {
          set({ carrito: cambiarCantidad(carrito, cartItemId, 1) })
          return
        }

        const precioBase = producto.precioBase ?? producto.precio
        set({
          carrito: [
            ...carrito,
            {
              ...producto,
              precioBase,
              precio: precioBase + extras.reduce((suma, e) => suma + e.precio, 0),
              extras,
              cartItemId,
              variante,
              cantidad: 1,
            },
          ],
        })
      },

      incrementarCantidad: (cartItemId) => set({ carrito: cambiarCantidad(get().carrito, cartItemId, 1) }),

      decrementarCantidad: (cartItemId) =>
        set({ carrito: cambiarCantidad(get().carrito, cartItemId, -1).filter((item) => item.cantidad > 0) }),

      eliminarDelCarrito: (cartItemId) => set({ carrito: get().carrito.filter((item) => item.cartItemId !== cartItemId) }),

      limpiarCarrito: () => set({ carrito: [] }),
    }),
    { name: 'grano-de-oro-cart' },
  ),
)

export const selectTotalItems = (state) => state.carrito.reduce((suma, item) => suma + item.cantidad, 0)
export const selectTotalPrecio = (state) => state.carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
