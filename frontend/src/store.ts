import { configureStore } from "@reduxjs/toolkit";
import files from "./slices/fileSlice";

const store = configureStore({
  reducer: {
    file: files,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
