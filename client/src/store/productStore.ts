import { create } from "zustand";
import { apiConfig } from "../config";

interface Agent {
  _id: string;
  fullName: string;
  role: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  type: string;
  status: string;
  images: string[];
  agent: Agent;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Property[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/properties/getProperties`);
      const data = await res.json();

      if (data.success) {
        set({ products: data.data, loading: false });
      } else {
        set({ error: "Failed to fetch properties", loading: false });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false });
      }
    }
  },
}));
