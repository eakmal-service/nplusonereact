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
  - **Next.js 14+** (App Router)
  - **TypeScript** for type safety
  - **Tailwind CSS** for styling

- **Backend (BaaS)**
  - **Supabase** for:
    - **Database:** PostgreSQL (Products, Orders, Reviews, Profiles)
    - **Auth:** Email/Password & Social Login
    - **Storage:** Supabase Storage (Built-in Global CDN)
    - **Real-time:** Live updates for Orders & Reviews

- **State Management**
  - **React Context API** (`ProductContext`, `CartContext`)
  - **SWR** (optional/legacy use)

## 📦 System Architecture
For a detailed breakdown of the database schema, storage policies, and workflows, please refer to the **[System Architecture Document](/.gemini/antigravity/brain/c3d500fc-7bb3-41a8-b5f6-f79dc99759f9/system_architecture.md)**.

## 🚀 Key Features

### ✅ Admin Panel
- **Product Management:** Upload images to Cloud, Add/Edit/Delete products.
- **Order Management:** Real-time incoming orders dashboard.
- **Review System:** Moderate user reviews.
- **Error Logs:** Real-time tracking of client-side errors.

### ✅ Customer Experience
- **Smart Checkout:** Address management, Coupons, Multiple Payment Methods (UPI, Card, COD).
- **Performance:** Optimized image loading via CDN.
- **User Accounts:** Order history and Profile management.

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