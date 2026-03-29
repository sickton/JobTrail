import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            username: null,
            firstName: null,

            setAuth: (token, username, firstName) =>
                set({ token, username, firstName }),

            logout: () =>
                set({ token: null, username: null, firstName: null }),
        }),
        { name: 'jobtrail-auth' }
    )
)
