import { createSlice } from "@reduxjs/toolkit";
const intialState = {
  model: "",
  csvData: [],
  processedData: [],
  imoportedData: [],
  faildData: [],
};
export const importSlice = createSlice({
  name: "import",
  initialState: intialState,
  reducers: {
    selectModel: (state, action) => {
      return { ...state, model: action.payload };
    },
    selectcsvData: (state, action) => {
      return { ...state, csvData: action.payload };
    },
    selectprocessedData: (state, action) => {
      return { ...state, processedData: action.payload };
    },
    selectimoportedData: (state, action) => {
      return { ...state, imoportedDataId: action.payload };
    },
    selectProducts: (state, action) => {
      return { ...state, products: action.payload };
    },
    selectfaildData: (state, action) => {
      return { ...state, faildData: action.payload };
    },
    resetImport: () => intialState,
  },
});

export const {
  selectModel,
  selectcsvData,
  selectprocessedData,
  selectimoportedData,
  selectProducts,
  selectfaildData,
  resetImport,
  // selectName,
} = importSlice.actions;
export const importReducer = importSlice.reducer;
