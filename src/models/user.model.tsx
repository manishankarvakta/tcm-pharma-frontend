export interface Warehouse {
  _id: string;
  name: string; // Add any other fields you need from the warehouse model
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  type: string;
  privilege: any;
  address: string;
  phone: string;
  status: string;
  warehouse: Warehouse | null; // Change the warehouse type to an object, not just a string
}
