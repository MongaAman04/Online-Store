# House of Sole 👟

A modern, scalable e-commerce platform built for a real footwear business, designed to deliver a seamless shopping experience while providing powerful business management tools through a dedicated admin dashboard.

🌐 **Live Website:** [https://houseofsole.in](https://houseofsole.in)

---

## Overview

House of Sole is a production-ready e-commerce platform developed to digitize and streamline operations for a family footwear business.

The platform enables customers to browse products, manage carts, place orders, and track purchases while allowing administrators to efficiently manage inventory, products, orders, and customer interactions from a centralized dashboard.

The project was built with a strong focus on:

* Performance
* Scalability
* Maintainability
* Clean Architecture
* User Experience

---

## Features

### Customer Features

✅ User Authentication

✅ Product Catalog

✅ Product Search & Filtering

✅ Product Detail Pages

✅ Shopping Cart

✅ Secure Checkout Flow

✅ Order Management

✅ User Dashboard

✅ Responsive Design for Mobile & Desktop

---

### Admin Features

✅ Product Management

* Add Products
* Update Products
* Delete Products

✅ Inventory Management

✅ Order Tracking & Management

✅ Customer Query Handling

✅ Business Analytics & Monitoring

---

## Tech Stack

### Frontend

* React.js
* React Router
* Redux Toolkit
* Axios
* Tailwind CSS

### Backend & Database

* Firebase Authentication
* Firebase Firestore
* Firebase Hosting

### Media Storage

* Cloudinary

### Development Tools

* Git
* GitHub
* Postman
* Figma

---

## Architecture

This project follows the **MVVM (Model-View-ViewModel)** architecture pattern.

### Why MVVM?

MVVM helps separate business logic from UI components, making the application easier to:

* Maintain
* Scale
* Debug
* Extend with new features

### Structure

```bash
src/
│
├── models/
│
├── viewmodels/
│
├── views/
│
├── services/
│
├── components/
│
├── routes/
│
└── utils/
```

### Architecture Flow

```text
View (UI Components)
        ↓
ViewModel (Business Logic)
        ↓
Model (Data Layer)
        ↓
Firebase / APIs
```

---

## Performance Optimizations

### Cloudinary Integration

Instead of storing product images directly in Firebase Storage, Cloudinary is used for media management.

Benefits:

* Faster image delivery through CDN
* Reduced Firebase storage usage
* Better image optimization
* Improved page load speed

### Additional Optimizations

* Lazy Loading
* Code Splitting
* Component Reusability
* Efficient State Management
* Optimized API Calls

---

## Key Engineering Decisions

### Scalable Frontend Structure

The application was designed with modular and reusable components to simplify future feature additions.

### Real-Time Database Operations

Firebase Firestore enables efficient and scalable data management with minimal backend overhead.

### Centralized State Management

Redux Toolkit is used to ensure predictable state updates and improve maintainability.

---

## Project Impact

This platform was developed for a real business and helped:

* Digitize inventory management
* Simplify order processing
* Improve customer shopping experience
* Reduce manual operational efforts
* Create a scalable online sales channel


## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/houseofsole.git
```

Navigate to the project directory:

```bash
cd houseofsole
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Future Improvements

* Payment Gateway Integration
* Product Reviews & Ratings
* Wishlist Functionality
* AI-Based Product Recommendations
* Advanced Analytics Dashboard
* Multi-Vendor Support

---

## About Me

**Aman Monga**

Frontend Developer | React.js Developer

📧 [amanmonga.career@gmail.com](mailto:amanmonga.career@gmail.com)

💼 LinkedIn: [https://linkedin.com/in/your-linkedin](https://www.linkedin.com/in/aman-monga-4b30ab24b/)

---

### If you found this project interesting, feel free to star the repository ⭐
