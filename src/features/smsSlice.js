import { createSlice } from "@reduxjs/toolkit";

const numberCheck = (phoneNumber) => {
  // Remove any leading '+' symbol
  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.substring(3);
  }

  // If the number does not start with '0', add a '0' at the beginning
  if (!phoneNumber.startsWith("0")) {
    phoneNumber = "0" + phoneNumber;
  }

  // If the number is not 11 digits, return the original number
  if (phoneNumber.length !== 11) {
    return phoneNumber;
  }
  return phoneNumber;
};

const initialState = {
  customers: [],
  message: "",
  totalCustomer: "0",
  selectedCustomer: "0",
  character: "0",
  sms: "",
};
export const smsSlice = createSlice({
  name: "sms",
  initialState: initialState,
  reducers: {
    selectCustomers: (state, action) => {
      let customers = [];
      if (action.payload.length > 0) {
        action.payload.map((customer) => {
          console.log(numberCheck(customer.phone));
          let cNumber = numberCheck(customer.phone);

          console.log("🚀 ~ cNumber:", cNumber);

          customers = [
            ...customers,
            {
              _id: customer._id,
              name: customer.name,
              point: customer.point,
              phone: cNumber,
              status: false,
            },
          ];
        });
      }

      //   console.log(customers);
      const updatedSmsArray = action.payload.map((sms) => ({
        ...sms,
        status: false,
      }));
      //   return updatedSmsArray;
      return {
        ...state,
        customers: updatedSmsArray,
        totalCustomer: action.payload.length,
      };
    },
    selectCustomer: (state, action) => {
      const id = action.payload;
      const customerIndex = state.customers.findIndex(
        (customer) => customer._id === id
      );

      const selectedCustomer = state.customers.filter(
        (p) => p.status !== false
      );

      if (customerIndex !== -1) {
        state.customers[customerIndex].status =
          !state.customers[customerIndex].status;
        state.selectedCustomer = selectedCustomer.length + 1;
      }
    },
    selectSMS: (state, action) => {
      return {
        ...state,
        sms: action.payload,
        character: action.payload.length,
      };
    },
    toggleSelect: (state) => {
      const firstStatus = state.customers[0].status;
      state.customers.forEach((customer) => {
        customer.status = !firstStatus;
      });
      state.selectedCustomer = state.customers.length;
    },
  },
});

export const { selectCustomers, selectCustomer, selectSMS, toggleSelect } =
  smsSlice.actions;
export const smsReducer = smsSlice.reducer;
