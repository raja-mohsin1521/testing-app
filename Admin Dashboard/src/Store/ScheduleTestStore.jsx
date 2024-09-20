import create from 'zustand';

const scheduleTestStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

export default scheduleTestStore;
