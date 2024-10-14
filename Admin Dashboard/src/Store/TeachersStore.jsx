import create from 'zustand';

const useStore = create((set) => ({
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
}));
const useTeacherDetails = create((set) => ({
  teacherDetails: [],
  setTeacherDetails: (teacherDetails) => set({ teacherDetails }),
}));
export { useStore,useTeacherDetails }; // Named export
