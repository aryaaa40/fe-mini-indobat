// Sesuaikan dengan struct di Go
export interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface OrderRequest {
    product_id: number;
    quantity: number;
    discount_percent: number;
  }
  
  export interface OrderResponse {
    message: string;
    data: {
      id: number;
      product_id: number;
      quantity: number;
      total_amount: number;
      created_at: string;
    };
  }