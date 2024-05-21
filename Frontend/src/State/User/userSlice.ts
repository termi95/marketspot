import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserRole } from "../../Types/User";

interface UserState {
  isLogin: boolean;
  isMobile: boolean;
  userRole: UserRole;
}

const initialState: UserState = {
  isLogin: false,
  isMobile: false,
  userRole: UserRole.User,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsMobile: (state, actions: PayloadAction<boolean>) => {
      state.isMobile = actions.payload;
    },
    setIsLogin: (state, actions: PayloadAction<boolean>) => {
      state.isLogin = actions.payload;
    },
    setUserRole: (state, actions: PayloadAction<UserRole>) => {
      state.userRole = +actions.payload;
    },
  },
});

export const { setIsMobile, setIsLogin, setUserRole } = userSlice.actions;
export default userSlice.reducer;
