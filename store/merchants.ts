import { create } from "zustand";
import merchantsData from "@/constants/merchantsData.json";
import { MerchantsStore } from "./types";

export const useMerchantsStore = create<MerchantsStore>((set) => ({
  merchants: merchantsData,
  setMerchants: (merchants) => set({ merchants }),
  getMerchantById: (id) => merchantsData.find((merchant) => merchant.id === id),
}));
