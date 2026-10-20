import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],
      
      // Actualizado para recibir la variante seleccionada
      agregarAlCarrito: (producto, varianteSeleccionada = null, extrasElegidos = []) => {
        const { carrito } = get();
        const idProd = producto._id || producto.id;
        
        // Creamos un ID único para el carrito: ID_PRODUCTO + VARIANTE (ej. 64a2b9-Rojos)
        let cartItemId = varianteSeleccionada ? `${idProd}-${varianteSeleccionada}` : idProd;
        // Mismo producto con distintos extras = renglón distinto en el carrito
        const extras = extrasElegidos.map((e) => ({ id: e._id || e.id, nombre: e.nombre, precio: e.precio }));
        if (extras.length) cartItemId += `+${extras.map((e) => e.id).sort().join(',')}`;
        const precioBase = producto.precioBase ?? producto.precio;
        const precioUnitario = precioBase + extras.reduce((s, e) => s + e.precio, 0);
        
        const existe = carrito.find((item) => item.cartItemId === cartItemId);
        
        if (existe) {
          set({
            carrito: carrito.map((item) =>
              item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad + 1 } : item
            ),
          });
        } else {
          set({ 
            carrito: [...carrito, { 
              ...producto,
              precioBase,
              precio: precioUnitario, // incluye los extras
              extras,
              cartItemId, // Usamos este nuevo ID para identificar la variante exacta en el carrito
              variante: varianteSeleccionada,
              cantidad: 1 
            }] 
          });
        }
      },
      
      // Funciones actualizadas para buscar por cartItemId
      incrementarCantidad: (cartItemId) => {
        set({
          carrito: get().carrito.map((item) =>
            item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad + 1 } : item
          ),
        });
      },
      
      decrementarCantidad: (cartItemId) => {
        set({
          carrito: get().carrito
            .map((item) =>
              item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad - 1 } : item
            )
            .filter((item) => item.cantidad > 0),
        });
      },
      
      eliminarDelCarrito: (cartItemId) => {
        set({
          carrito: get().carrito.filter((item) => item.cartItemId !== cartItemId),
        });
      },
      
      limpiarCarrito: () => set({ carrito: [] }),
    }),
    {
      name: 'grano-de-oro-cart',
    }
  )
);