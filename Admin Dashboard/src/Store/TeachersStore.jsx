import { create } from 'zustand';
import { produce } from 'immer';  // This uses named export


const useTeacherStore = create((set) => ({
  teachers: [],
  addTeacher: (teacher) =>
    set((state) =>
      produce(state, (draft) => {
        draft.teachers.push(teacher);
      })
    ),
  setTeachers: (teachers) => set({ teachers }),
  updateTeacher: (updatedTeacher) =>
    set((state) =>
      produce(state, (draft) => {
        const index = draft.teachers.findIndex((t) => t.id === updatedTeacher.id);
        if (index !== -1) {
          draft.teachers[index] = updatedTeacher;
        }
      })
    ),
  deleteTeacher: (teacherId) =>
    set((state) =>
      produce(state, (draft) => {
        draft.teachers = draft.teachers.filter((teacher) => teacher.id !== teacherId);
      })
    ),
}));
export default useTeacherStore;
