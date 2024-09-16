import create from 'zustand';

const TestStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));



export default TestStore;
