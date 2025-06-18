# NPlusOne - Women's Fashion E-commerce Platform

A modern, feature-rich e-commerce platform built for women's fashion retail, offering a seamless shopping experience with advanced features and secure payment processing.

## 🚀 Features

### Customer Features
- **Product Browsing**
  - Browse through various categories (Co-ord Sets, Girls Wear, Night Bottoms, T-shirts)
  - Advanced search functionality
  - Product filtering and sorting
  - Similar product recommendations

- **Shopping Experience**
  - Secure shopping cart
  - Wishlist functionality
  - Size guide and product measurements
  - Multiple product images with zoom capability
  - Responsive design for mobile, tablet, and desktop

- **User Accounts**
  - Personal account management
  - Order history
  - Saved addresses
  - Wishlist synchronization

- **Checkout Process**
  - Secure payment integration with Stripe
  - Multiple payment options
  - Address validation
  - Delivery status tracking
  - Order confirmation emails

### Admin Features
- **Product Management**
  - Add/Edit/Delete products
  - Manage product categories
  - Upload product images
  - Set pricing and discounts
  - Inventory management

- **Order Management**
  - View and process orders
  - Update order status
  - Manage returns and refunds
  - Generate order reports

- **User Management**
  - Customer account management
  - Admin user management
  - Role-based access control

## 🛠 Tech Stack

- **Frontend**
  - Next.js 13.5.4 (React Framework)
  - TypeScript for type safety
  - Tailwind CSS for styling
  - HeadlessUI for accessible components
  - HeroIcons for icons

- **Backend**
  - Next.js API Routes
  - JWT for authentication
  - bcrypt for password hashing
  - Nodemailer for emails

- **Payment Processing**
  - Stripe integration
  - Secure payment handling

- **State Management**
  - SWR for data fetching and caching
  - React Context for global state

## 📦 Project Structure

```
src/
├── app/                    # Next.js 13 App Router
│   ├── account/           # User account pages
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart
│   ├── product/          # Product pages
│   └── ...
├── components/            # Reusable components
│   ├── admin/           # Admin components
│   ├── checkout/        # Checkout components
│   ├── common/          # Shared components
│   └── home/            # Homepage components
├── contexts/             # React contexts
├── data/                # Mock data and constants
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- A Stripe account for payments

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NPlusOne.git
cd NPlusOne
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
JWT_SECRET=your_jwt_secret
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Alternative Ports
To run on port 4000:
```bash
npm run dev:4000
```

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing with bcrypt
- HTTPS-only in production
- Protected API routes
- Role-based access control
- Secure payment processing

## 📱 Responsive Design

The platform is fully responsive with optimized views for:
- Mobile devices
- Tablets
- Desktop computers

## 🔄 State Management

- SWR for server state
- React Context for client state
- Optimistic updates for better UX
- Cached data management

## 🌐 API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/payment/*` - Payment processing
- `/api/delivery/*` - Delivery status
- `/api/search/*` - Search functionality

## 🧪 Development Features

- TypeScript for type safety
- ESLint for code quality
- Modern JavaScript features
- Hot module replacement
- Fast refresh in development

## 📈 Performance Optimization

- Image optimization
- Code splitting
- Route pre-fetching
- Static page generation where possible
- API route optimization

## 🔜 Future Enhancements

- [ ] Enhanced admin dashboard
- [ ] Advanced analytics
- [ ] Multiple language support
- [ ] Advanced search filters
- [ ] Customer reviews system
- [ ] Social media integration
- [ ] Bulk product management
- [ ] Advanced inventory tracking
- [ ] Email marketing integration

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📞 Support

For support, please email [support@nplusone.com](mailto:support@nplusone.com) or open an issue in the GitHub repository. 