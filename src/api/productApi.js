import { apiClient } from './config';

export const getCategories = async () => {
  try {
    const { data } = await apiClient.get('/categorias');
    return data;
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const { data } = await apiClient.get('/productos');
    return data;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const { data } = await apiClient.post('/productos', productData);
    return data;
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

export const updateProduct = async (id, updateData) => {
  try {
    const { data } = await apiClient.put(`/productos/${id}`, updateData);
    return data;
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
};