// src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],
      
      agregarAlCarrito: (producto) => {
        const { carrito } = get();
        const idProd = producto._id || producto.id;
        const existe = carrito.find((item) => (item._id || item.id) === idProd);
        
        if (existe) {
          set({
            carrito: carrito.map((item) =>
              (item._id || item.id) === idProd ? { ...item, cantidad: item.cantidad + 1 } : item
            ),
          });
        } else {
          set({ carrito: [...carrito, { ...producto, cantidad: 1 }] });
        }
      },
      
      incrementarCantidad: (id) => {
        set({
          carrito: get().carrito.map((item) =>
            (item._id || item.id) === id ? { ...item, cantidad: item.cantidad + 1 } : item
          ),
        });
      },
      
      decrementarCantidad: (id) => {
        set({
          carrito: get().carrito
            .map((item) =>
              (item._id || item.id) === id ? { ...item, cantidad: item.cantidad - 1 } : item
            )
            .filter((item) => item.cantidad > 0),
        });
      },
      
      eliminarDelCarrito: (id) => {
        set({
          carrito: get().carrito.filter((item) => (item._id || item.id) !== id),
        });
      },
      
      limpiarCarrito: () => set({ carrito: [] }),
    }),
    {
      name: 'grano-de-oro-cart', // Nombre en localStorage
    }
  )
);