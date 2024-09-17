
import create from 'zustand';

export const useDashboardStore = create((set) => ({
  dashboard: { },
  setDashboardData: (data) => set({ dashboard: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
