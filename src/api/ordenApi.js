import { apiClient } from './config';

// 1. Cliente: Enviar el pedido desde el Checkout a la base de datos
export const createOrder = async (orderData) => {
  try {
    // RUTA CORREGIDA: Apunta exactamente a la que configuraste en venta.routes.js
    const { data } = await apiClient.post('/venta/create', orderData);
    return data;
  } catch (error) {
    console.error("Error creando el pedido:", error);
    throw error;
  }
};

// 2. Admin: Obtener todos los pedidos para el Dashboard (Si en tu API es diferente, luego la ajustamos)
export const getOrders = async () => {
  try {
    const { data } = await apiClient.get('/ventas');
    return data;
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    throw error;
  }
};

// 3. Admin: Cambiar el estado del pedido (Nuevo -> Preparando -> Listo -> Entregado)
export const updateOrderStatus = async (id, estado) => {
  try {
    const { data } = await apiClient.put(`/ventas/${id}`, { estado });
    return data;
  } catch (error) {
    console.error("Error actualizando el estado del pedido:", error);
    throw error;
  }
};