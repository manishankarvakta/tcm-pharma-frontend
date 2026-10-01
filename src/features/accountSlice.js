import { createSlice } from "@reduxjs/toolkit";
import { signInUser } from "../Components/Utility/Auth";
import { startOfToday, endOfToday, format, formatDistance } from "date-fns";

const user = signInUser();

const initialState = {
    supplier: null,
    paidAmount: {
        cash: {
            phone: null,
            // amount: 0,
        },
        mfs: {
            type: 'bKash',
            phone: null,
            // amount: 0,
        },
        card: {
            type: "visa",
            cardNo: null,
            // amount: 0,
        },
        cheque: {

            bank: "Bank Asia",
            chequeNo: null,
            // amount: 0,
        },
    },
    paidTo: null,
    photo: null,
    accountHead: null,
    user: user?.id,
    date: format(new Date(), "MM-dd-yyyy"),
    toDate: null,
    fromDate: null,
    // toDate: format(new Date(), "MM-dd-yyyy"),
    // fromDate: format(new Date(), "MM-dd-yyyy"),
    amount: 0,
    due: 0,
    type: "Debit",
    paymentType: "Advance",
    paymentMethodType: "Cash",
    grnId: null,
    poId: null,
    note: "",
    status: "active",
};

export const accountSlice = createSlice({
    name: "accountSlice",
    initialState: initialState,

    reducers: {
        selectSupplier: (state, action) => {
            return {
                ...state,
                supplier: action.payload,
            };
        },
        selectPaidTo: (state, action) => {
            return {
                ...state,
                paidTo: action.payload,
            };
        },
        selectAccountUser: (state, action) => {
            return { ...state, user: action.payload };
        },
        inputToDate: (state, action) => {
            return { ...state, toDate: action.payload };
        },
        inputFromDate: (state, action) => {
            return { ...state, fromDate: action.payload };
        },
        selectAccountHead: (state, action) => {
            return { ...state, accountHead: action.payload };
        },
        selectDate: (state, action) => {
            return { ...state, date: action.payload };
        },
        selectPO: (state, action) => {
            return { ...state, poId: action.payload };
        },
        deselectPO: (state, action) => {
            return { ...state, poId: null };
        },
        selectGRN: (state, action) => {
            return { ...state, grnId: action.payload };
        },
        deselectGRN: (state, action) => {
            return { ...state, grnId: null };
        },
        selectPaymentType: (state, action) => {
            return { ...state, paymentType: action.payload };
        },
        inputAmount: (state, action) => {
            return { ...state, amount: action.payload };
        },
        inputPaidTo: (state, action) => {
            return { ...state, paidTo: action.payload };
        },
        inputPaymentMethodType: (state, action) => {
            return { ...state, paymentMethodType: action.payload };
        },
        inputType: (state, action) => {
            return { ...state, type: action.payload };
        },
        inputPaymentType: (state, action) => {
            return { ...state, paymentType: action.payload };
        },
        inputDate: (state, action) => {
            return { ...state, date: action.payload };
        },
        inputNote: (state, action) => {
            return { ...state, note: action.payload };
        },
        selectStatus: (state, action) => {
            return { ...state, status: action.payload };
        },
        inputCheckNo: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        type: 'bKash',
                        phone: null,
                        amount: 0,
                    },
                    card: {
                        type: "visa",
                        cardNo: null,
                        amount: 0,
                    },
                    cheque: {
                        ...state.paidAmount.cheque,
                        chequeNo: action.payload,
                    },
                }
            };
        },
        // inputCheckAmount: (state, action) => {
        //     return {
        //         ...state, paidAmount: {
        //             cash: {
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             mfs: {
        //                 type: 'bKash',
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             card: {
        //                 type: "visa",
        //                 cardNo: null,
        //                 amount: 0,
        //             },
        //             cheque: {
        //                 ...state.paidAmount.cheque,
        //                 amount: action.payload,
        //             },
        //         }
        //     };
        // },
        inputCheckBankNo: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        type: 'bKash',
                        phone: null,
                        amount: 0,
                    },
                    card: {
                        type: "visa",
                        cardNo: null,
                        amount: 0,
                    },
                    cheque: {
                        ...state.paidAmount.cheque,
                        bank: action.payload,
                    },
                }
            };
        },
        inputCardNo: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        type: 'bKash',
                        phone: null,
                        amount: 0,
                    },
                    card: {
                        ...state.paidAmount.card,
                        cardNo: action.payload,

                    },
                    cheque: {
                        bank: "Bank Asia",
                        chequeNo: null,
                        amount: 0,
                    },
                }
            };
        },
        // inputCardAmount: (state, action) => {
        //     return {
        //         ...state, paidAmount: {
        //             cash: {
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             mfs: {
        //                 type: 'bKash',
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             card: {
        //                 ...state.paidAmount.card,
        //                 amount: action.payload,

        //             },
        //             cheque: {
        //                 bank: "Bank Asia",
        //                 chequeNo: null,
        //                 amount: 0,
        //             },
        //         }
        //     };
        // },
        inputCardType: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        type: 'bKash',
                        phone: null,
                        amount: 0,
                    },
                    card: {
                        ...state.paidAmount.card,
                        type: action.payload,

                    },
                    cheque: {
                        bank: "Bank Asia",
                        chequeNo: null,
                        amount: 0,
                    },
                }
            };
        },
        inputMFSPhone: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        ...state.paidAmount.mfs,
                        phone: action.payload,

                    },
                    card: {
                        type: "visa",
                        cardNo: null,
                        amount: 0,
                    },
                    cheque: {
                        bank: "Bank Asia",
                        chequeNo: null,
                        amount: 0,
                    },
                }
            };
        },
        // inputMFSAmount: (state, action) => {
        //     return {
        //         ...state, paidAmount: {
        //             cash: {
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             mfs: {
        //                 ...state.paidAmount.mfs,
        //                 amount: action.payload,

        //             },
        //             card: {
        //                 type: "visa",
        //                 cardNo: null,
        //                 amount: 0,
        //             },
        //             cheque: {
        //                 bank: "Bank Asia",
        //                 chequeNo: null,
        //                 amount: 0,
        //             },
        //         }
        //     };
        // },
        inputMFSType: (state, action) => {
            return {
                ...state, paidAmount: {
                    cash: {
                        phone: null,
                        amount: 0,
                    },
                    mfs: {
                        ...state.paidAmount.mfs,
                        type: action.payload,

                    },
                    card: {
                        type: "visa",
                        cardNo: null,
                        amount: 0,
                    },
                    cheque: {
                        bank: "Bank Asia",
                        chequeNo: null,
                        amount: 0,
                    },
                }
            };
        },
        // inputCashAmount: (state, action) => {
        //     return {
        //         ...state, paidAmount: {
        //             cash: {
        //                 ...state.paidAmount.cash,
        //                 amount: action.payload,
        //             },
        //             mfs: {
        //                 type: 'bKash',
        //                 phone: null,
        //                 amount: 0,
        //             },
        //             card: {
        //                 type: "visa",
        //                 cardNo: null,
        //                 amount: 0,
        //             },
        //             cheque: {
        //                 bank: "Bank Asia",
        //                 chequeNo: null,
        //                 amount: 0,
        //             },
        //         }
        //     };
        // },
        resetAccount: () => initialState
    }
});
export const {
    selectSupplier,
    selectPaidTo,
    selectAccountUser,
    selectAccountHead,
    selectDate,
    selectPO,
    deselectPO,
    selectGRN,
    deselectGRN,
    selectPaymentType,
    inputAmount,
    inputPaidTo,
    inputCheckNo,
    inputCheckBankNo,
    inputCardNo,
    inputCardType,
    inputMFSPhone,
    inputMFSType,
    inputPaymentMethodType,
    inputType,
    inputPaymentType,
    inputDate,
    inputNote,
    selectStatus,
    inputToDate,
    inputFromDate,
    // inputCheckAmount,
    // inputCardAmount,
    // inputMFSAmount,
    // inputCashAmount,
    resetAccount
} = accountSlice.actions;

export const accountReducer = accountSlice.reducer;