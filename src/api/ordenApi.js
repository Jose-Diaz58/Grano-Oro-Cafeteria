import { apiClient } from './config';

export const createOrder = async (orderData) => {
  try {
    const { data } = await apiClient.post('/ventas', orderData);
    return data;
  } catch (error) {
    console.error("Error creando el pedido:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const { data } = await apiClient.get('/ventas');
    return data;
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, estado) => {
  try {
    const { data } = await apiClient.put(`/ventas/${id}`, { estado });
    return data;
  } catch (error) {
    console.error("Error actualizando el estado del pedido:", error);
    throw error;
  }
};