import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: { uid: "", photoUrl: "", displayName: "" },
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userData = { uid: "", photoUrl: "", displayName: "" };
    },
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.userData.displayName = action.payload.displayName;
      state.userData.photoUrl = action.payload.photoUrl;
    },
  },
});

//アクションをコンポーネントからアクセスできるようにする
export const { login, logout, updateUserProfile } = userSlice.actions;

//コンポーネントからuseSlectでstateにアクセスできるようにする state.(storeにあるreducerの名前).(initialStateに登録してある名前)
export const selectUser = (state: RootState) => state.user.userData;

//store.tsでreducersにアクセスできるようにする
export default userSlice.reducer;
