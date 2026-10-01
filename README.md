# Aamar Dokan - Pharmacy POS System

A comprehensive Point of Sale (POS) system designed specifically for pharmacies, built with modern web technologies.

## 🚀 Features

### Core Features
- **Dashboard**: Real-time overview of pharmacy operations
- **POS System**: Complete point of sale functionality
- **Sales Management**: Track and manage sales, customer information
- **Inventory Management**: Stock tracking, movement, and damage control
- **Procurement**: Purchase orders, GRN, RTV, and TPN management
- **Account Management**: Transaction tracking and account heads
- **Product Management**: Manage products, generics, brands, and groups
- **Reporting**: Comprehensive sales and inventory reports
- **Multi-language Support**: English and Bengali language interface

### Technical Features
- Responsive design for all devices
- Real-time data synchronization
- Secure authentication system
- Data export capabilities (CSV, PDF)
- Barcode support
- User role management
- Warehouse management
- SMS integration

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Libraries**: 
  - React Bootstrap
  - Material-UI
  - Chakra UI
  - DaisyUI

### Data Handling
- **HTTP Client**: Axios
- **Data Tables**: Material React Table
- **Form Handling**: React Hook Form
- **PDF Generation**: jsPDF
- **CSV Handling**: React CSV

### Development Tools
- **Code Quality**: ESLint
- **Testing**: Jest
- **Build Tool**: React Scripts
- **Package Manager**: npm

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
REACT_APP_API_URL=your_api_url
```

4. Start the development server:
```bash
npm start
```

## 🏗️ Project Structure

```
src/
├── Components/         # React components
│   ├── Common/        # Shared components
│   ├── Dashboard/     # Dashboard related components
│   ├── POS/          # POS system components
│   └── ...
├── features/          # Redux slices and features
├── language/         # Language files
├── Utility/          # Utility functions
└── App.tsx           # Root component
```

## 🔑 Key Modules

### POS System
- Real-time sales processing
- Barcode scanning
- Quick product search
- Customer management
- Payment processing

### Inventory Management
- Stock tracking
- Movement history
- Damage control
- Low stock alerts
- Batch management

### Sales Management
- Sales history
- Customer database
- Due bills tracking
- Sales reports
- Export functionality

### Procurement
- Purchase order management
- GRN (Goods Receipt Note)
- RTV (Return to Vendor)
- TPN (Transfer Purchase Note)
- Supplier management

### Account Management
- Transaction tracking
- Account heads
- Financial reports
- Payment collection
- Ledger management

## 🌐 API Integration

The application integrates with a backend API for:
- User authentication
- Data synchronization
- Report generation
- SMS notifications
- Warehouse management

## 🔒 Security Features

- JWT authentication
- Role-based access control
- Secure data transmission
- Session management
- Input validation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🌍 Multi-language Support

Supports multiple languages:
- English
- Bengali

## 🚀 Deployment

To build the application for production:
```bash
npm run build
```

## 📄 License

[Add your license information here]

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📞 Support

For support, please contact [Add contact information]
