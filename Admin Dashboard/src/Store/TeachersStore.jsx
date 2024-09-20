import create from 'zustand';

const useStore = create((set) => ({
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
}));

export { useStore }; // Named export
