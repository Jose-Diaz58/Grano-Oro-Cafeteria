import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],
      
      // Actualizado para recibir la variante seleccionada
      agregarAlCarrito: (producto, varianteSeleccionada = null) => {
        const { carrito } = get();
        const idProd = producto._id || producto.id;
        
        // Creamos un ID único para el carrito: ID_PRODUCTO + VARIANTE (ej. 64a2b9-Rojos)
        const cartItemId = varianteSeleccionada ? `${idProd}-${varianteSeleccionada}` : idProd;
        
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