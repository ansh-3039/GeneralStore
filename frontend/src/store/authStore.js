import { create } from 'zustand';

const getInitialAdmin = () => {
  const savedInfo = localStorage.getItem('adminInfo');
  return savedInfo ? JSON.parse(savedInfo) : null;
};

export const useAuthStore = create((set) => ({
  adminInfo: getInitialAdmin(),

  setAdminInfo: (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data));
    set({ adminInfo: data });
  },

  logout: () => {
    localStorage.removeItem('adminInfo');
    set({ adminInfo: null });
  }
}));
