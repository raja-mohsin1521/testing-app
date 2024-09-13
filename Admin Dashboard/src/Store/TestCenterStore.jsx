// src/Store/TestCenterStore.js
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define your Zustand store
const useTestCenterStore = create(
  devtools(
    persist(
      (set) => ({
        testCenters: [],
        addTestCenter: (newTestCenter) => set((state) => ({
          testCenters: [...state.testCenters, newTestCenter],
        })),
        deleteTestCenter: (id) => set((state) => ({
          testCenters: state.testCenters.filter((testCenter) => testCenter.id !== id),
        })),
        updateTestCenter: (updatedTestCenter) => set((state) => ({
          testCenters: state.testCenters.map((testCenter) =>
            testCenter.id === updatedTestCenter.id
              ? { ...testCenter, ...updatedTestCenter }
              : testCenter
          ),
        })),
        clearTestCenters: () => set({ testCenters: [] }),
      }),
      {
        name: 'test-center-storage', 
        getStorage: () => localStorage, 
      }
    )
  )
);

export default useTestCenterStore;
