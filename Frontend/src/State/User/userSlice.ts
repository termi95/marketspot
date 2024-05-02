import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLogin: boolean;
  isMobile: boolean;
}

const initialState: UserState = {
  isLogin: false,
  isMobile: false,
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
  },
});

export const { setIsMobile, setIsLogin } = userSlice.actions;
export default userSlice.reducer;
