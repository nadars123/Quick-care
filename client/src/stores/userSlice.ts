import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface PatientInfo {
  Adresse: string;
  birth_date: string;
  gender: string;
  medicale_info: string;
  phone_number: string;
  _id: string;
}

interface UserState {
  email: string | null;
  id: string | null;
  role: string | null;
  patientInfo: PatientInfo | null;
  token: string | null;
}

const initialState: UserState = {
  email: null,
  id: null,
  role: null,
  patientInfo: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return { ...initialState };
    },
  },
});

export const { setUser,  clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
