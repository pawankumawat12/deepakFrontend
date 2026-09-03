import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: number | string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  image?: string | null;
  is_active?: boolean;
  is_blocked?: boolean;
  block_reason?: string | null;
}

export interface User {
  id: number | string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  image?: string | null;
  is_active?: boolean;
  is_blocked?: boolean;
  block_reason?: string | null;
  token?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload;
      if (!payload) return;
      const user = payload.user || (payload.id ? payload : null);
      if (user) {
        state.user = user;
      }
      const token = payload.accessToken || payload.token || user?.token;
      if (token) {
        state.accessToken = token;
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
      }
    },
    updateUserStatus: (state, action) => {
      if (state.user) {
        state.user.is_blocked = action.payload.is_blocked;
        state.user.is_active = action.payload.is_active;
        state.user.block_reason = action.payload.block_reason;
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },
  },
});

export const { setCredentials, updateUserStatus, logout } = authSlice.actions;
export default authSlice.reducer;

