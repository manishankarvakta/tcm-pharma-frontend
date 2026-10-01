export interface Settings {
  _id: string;
  storeName: string;
  businessType: string;
  aamarId: string;
  licenseNumber: string;
  currency: string;
  email: string;
  phone: string;
  address: string;
  invoiceIdPrefix: string;
  defaultInvoiceSize: number;
  binNumber: string;
  vatPercentage: number;
  storePhoto: string;
  posScreen: string;
  paymentMethods: string;
  // New fields
  websiteUrl?: string; // Optional field
  socialMediaLinks?: string[]; // Optional array of strings
  openingHours?: string; // Optional field
}
