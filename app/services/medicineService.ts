import api from './api';
import { Product, OrderRequest, OrderResponse } from '../types';

export const medicineService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Gagal mengambil data produk';
    }
  },

  createOrder: async (data: OrderRequest): Promise<OrderResponse> => {
    try {
      const response = await api.post<OrderResponse>('/order', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Gagal memproses pesanan';
    }
  },
};