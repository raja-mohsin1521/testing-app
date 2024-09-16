
import create from 'zustand';

export const useStore = create((set) => ({
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
}));
