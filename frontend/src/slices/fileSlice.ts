// src/store/slices/fileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios.ts";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface File {
  id: number;
  created_at: string;
  fileName: string;
  fileUrl: string;
  updatedAt: string;
  email: string;
  size?: number;
}

interface FileState {
  files: File[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

// Async thunk to fetch files
export const fetchFiles = createAsyncThunk("files/fetchFiles", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/file/get-files", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.message as File[];
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFiles: (state) => {
      state.files = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<File[]>) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFiles } = fileSlice.actions;
export default fileSlice.reducer;
