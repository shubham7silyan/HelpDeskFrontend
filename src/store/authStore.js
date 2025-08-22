// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import api from '../services/api';

// const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isLoading: false,
      
//       login: async (email, password) => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/auth/login', { email, password });
//           const { token, user } = response.data;
          
//           set({ user, token, isLoading: false });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return { success: true };
//         } catch (error) {
//           set({ isLoading: false });
//           return { import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import api from '../services/api';

// const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isLoading: false,
      
//       login: async (email, password) => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/api/auth/login', { email, password });
//           const { token, user } = response.data;
          
//           set({ user, token, isLoading: false });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return { success: true };
//         } catch (error) {
//           set({ isLoading: false });
//           return { 
//             success: false, 
//             error: error.response?.data?.error || 'Login failed' 
//           };
//         }
//       },
      
//       register: async (name, email, password, role = 'user') => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/api/auth/register', { name, email, password, role });
//           const { token, user } = response.data;
          
//           set({ user, token, isLoading: false });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return { success: true };
//         } catch (error) {
//           set({ isLoading: false });
//           return { 
//             success: false, 
//             error: error.response?.data?.error || 'Registration failed' 
//           };
//         }
//       },
      
//       logout: () => {
//         set({ user: null, token: null });
//         delete api.defaults.headers.common['Authorization'];
//       },
      
//       refreshToken: async () => {
//         try {
//           const response = await api.post('/api/auth/refresh');
//           const { token } = response.data;
          
//           set({ token });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return true;
//         } catch (error) {
//           get().logout();
//           return false;
//         }
//       },
      
//       initializeAuth: () => {
//         const { token } = get();
//         if (token) {
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         }
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({ user: state.user, token: state.token }),
//     }
//   )
// );

// export default useAuthStore;

//             success: false, 
//             error: error.response?.data?.error || 'Login failed' 
//           };
//         }
//       },
      
//       register: async (name, email, password, role = 'user') => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/auth/register', { name, email, password, role });
//           const { token, user } = response.data;
          
//           set({ user, token, isLoading: false });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return { success: true };
//         } catch (error) {
//           set({ isLoading: false });
//           return { 
//             success: false, 
//             error: error.response?.data?.error || 'Registration failed' 
//           };
//         }
//       },
      
//       logout: () => {
//         set({ user: null, token: null });
//         delete api.defaults.headers.common['Authorization'];
//       },
      
//       refreshToken: async () => {
//         try {
//           const response = await api.post('/auth/refresh');
//           const { token } = response.data;
          
//           set({ token });
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
//           return true;
//         } catch (error) {
//           get().logout();
//           return false;
//         }
//       },
      
//       initializeAuth: () => {
//         const { token } = get();
//         if (token) {
//           api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         }
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({ user: state.user, token: state.token }),
//     }
//   )
// );

// export default useAuthStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/login', { email, password });
          const { token, user } = response.data;
          
          set({ user, token, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          };
        }
      },
      
      register: async (name, email, password, role = 'user') => {
        set({ isLoading: true });
        try {
          const response = await api.post('/api/auth/register', { name, email, password, role });
          const { token, user } = response.data;
          
          set({ user, token, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.error || 'Registration failed' 
          };
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
      },
      
      refreshToken: async () => {
        try {
          const response = await api.post('/api/auth/refresh');
          const { token } = response.data;
          
          set({ token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },
      
      initializeAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
