import { apiClient } from './config';

export const getProducts = async () => {
  try {
    const { data } = await apiClient.get('/producto/buscar');
    return data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};