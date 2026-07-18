import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      user: null,
      city: null,
      interests: [],
      isOnboarded: false,
      theme: 'light',
      sidebarOpen: true,
      chatOpen: false,
      activeChatRoom: null,

      setUser: (user) => set({ user }),
      setCity: (city) => set({ city }),
      setInterests: (interests) => set({ interests }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setChatOpen: (open) => set({ chatOpen: open }),
      setActiveChatRoom: (room) => set({ activeChatRoom: room }),

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, city: null, interests: [], isOnboarded: false });
      },

      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
    }),
    {
      name: 'nearbyconnect-storage',
      partialize: (state) => ({
        user: state.user,
        city: state.city,
        interests: state.interests,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

export default useAppStore;
