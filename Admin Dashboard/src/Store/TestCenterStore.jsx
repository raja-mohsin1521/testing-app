import create from 'zustand';

const TestCenterStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

const BookingStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

export { TestCenterStore, BookingStore };
