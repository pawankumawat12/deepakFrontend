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

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload?.user || action.payload;
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
    },
  },
});

export const { setCredentials, updateUserStatus, logout } = authSlice.actions;
export default authSlice.reducer;
