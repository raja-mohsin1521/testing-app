import { create } from 'zustand';

const useStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

export default useStore;
