import { create } from 'zustand';

const useStore = create((set) => ({
  subjectiveQuestionWithImage: { subjective: [], total: 0 },
  objectiveQuestionWithImage: { subjective: [], total: 0 },
  subjectiveQuestionWithoutImage: { subjective: [], total: 0 },
  objectiveQuestionWithoutImage: { subjective: [], total: 0 },

  // Setters for each state with proper structure
  setSubjectiveQuestionWithImage: (subjective, total) =>
    set({ subjectiveQuestionWithImage: { subjective, total } }),

  setObjectiveQuestionWithImage: (subjective, total) =>
    set({ objectiveQuestionWithImage: { subjective, total } }),

  setSubjectiveQuestionWithoutImage: (subjective, total) =>
    set({ subjectiveQuestionWithoutImage: { subjective, total } }),

  setObjectiveQuestionWithoutImage: (subjective, total) =>
    set({ objectiveQuestionWithoutImage: { subjective, total } }),
}));

export default useStore;
