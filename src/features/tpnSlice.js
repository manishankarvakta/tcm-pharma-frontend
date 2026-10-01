import { createSlice } from "@reduxjs/toolkit";

export const tpnSlice = createSlice({
    name: "tpn",
    initialState: {
        tpnNo: "",
        warehouseTo: "",
        warehouseFrom: "",
        products: [],
        note: null,
        type: null,
        doc: null,
        totalItem: 0,
        total: 0,
        userId: "",
        shipping_cost: 0,
        status: "Pending",
    },
    reducers: {
        tpnProductsAdd: (state, action) => {
            return {
                ...state,
                products: action.payload,
                totalItem: action.payload.length,
            };
        },
        tpnWarehouseTo: (state, action) => {
            state.warehouseTo = action.payload;
        },
        tpnWarehouseForm: (state, action) => {
            state.warehouseFrom = action.payload;
        },
        selectNote: (state, action) => {
            state.note = action.payload;
        },
        selectShipping: (state, action) => {
            state.shipping_cost = action.payload;
        },
        selectUser: (state, action) => {
            return { ...state, userId: action.payload };
        },
        selectTotal: (state, action) => {
            return { ...state, total: action.payload };
        },
        selectTotalItem: (state, action) => {
            return { ...state, totalItem: action.payload };
        },
        resetTpn: () => {
            return {
                tpnNo: "",
                warehouseTo: "",
                warehouseFrom: "",
                products: [],
                note: null,
                type: null,
                doc: null,
                totalItem: 0,
                total: 0,
                userId: "",
                shipping_cost: 0,
                status: "Pending",
            }
        },
 
    },
});

export const {
    tpnProductsAdd,
    tpnWarehouseTo,
    tpnWarehouseForm,
    selectUser,
    selectNote, selectTotal,
    selectTotalItem,
    selectShipping,
    resetTpn
} = tpnSlice.actions;
export const tpnReducer = tpnSlice.reducer;
