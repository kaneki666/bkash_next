import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  infoModalMessage: string | null;
  showInfo: boolean;
};

const initialState: UIState = {
  infoModalMessage: null,
  showInfo: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInfoModalMessage(state, action: PayloadAction<string | null>) {
      state.infoModalMessage = action.payload;
    },
    setShowInfo(state, action: PayloadAction<boolean>) {
      state.showInfo = action.payload;
    },
  },
});

export const { setInfoModalMessage, setShowInfo } = uiSlice.actions;
export default uiSlice.reducer;
