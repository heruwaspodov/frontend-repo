import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/types/user";

const initialState: UserState = {
  email: null,
  id: null,
  accessToken: null,
  name: null,
  lastLogin: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        email: string;
        id: string;
        name: string;
        lastLogin: string;
        accessToken: string;
      }>
    ) {
      const { email, id, accessToken, name, lastLogin } = action.payload;
      state.email = email;
      state.id = id;
      state.name = name;
      state.lastLogin = lastLogin;
      state.accessToken = accessToken;

      // Save to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ email, id, accessToken, name, lastLogin })
      );
    },
    logout(state) {
      state.email = null;
      state.id = null;
      state.name = null;
      state.lastLogin = null;
      state.accessToken = null;

      // Clear localStorage
      localStorage.removeItem("user");
    },
    loadUserFromStorage(state) {
      const userData = localStorage.getItem("user");

      if (userData) {
        const { email, id, accessToken, name, lastLogin } =
          JSON.parse(userData);
        state.email = email;
        state.id = id;
        state.name = name;
        state.lastLogin = lastLogin;
        state.accessToken = accessToken;
      }
    },
  },
});

export const { loginSuccess, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
