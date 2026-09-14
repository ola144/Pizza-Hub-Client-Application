# PizzaHub

PizzaHub is a full-stack pizza ordering and inventory management application built with React, TypeScript, Tailwind CSS, Express, and MongoDB. The app supports two main user roles:

- Customer: sign up, verify email, log in, browse ingredients, build custom pizzas, place orders, and track order status.
- Admin: manage inventory, monitor dashboard metrics, view customer orders, and update order status.

This project is organized as a client app and a separate Express API server, making it easy to develop and deploy each part independently.

## Overview

PizzaHub brings together a modern storefront experience and a management dashboard in one app.

### Customer experience

- Secure account creation and authentication
- Email verification and reset-password flow
- Ingredient catalog and stock-aware custom pizza builder
- Real-time order creation and order tracking
- Order details page showing pizza build, amount, and status

### Admin experience

- Admin login and protected dashboard
- Inventory management with add/update flows
- Overview metrics and operational dashboard
- Order management list and detail pages
- Order status updates to track fulfillment progress
- Automated low-stock alerts that notify admins when inventory drops below configured thresholds

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- Socket.io client

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT-based auth with cookies
- Nodemailer for account emails
- Razorpay integration support
- Socket.io server

## Project structure

```text
pizza/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── server/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Features

### Authentication

- Customer signup and login
- Admin login
- Email verification
- Password reset flow
- Protected routes based on user role

### Inventory and pizza building

- Inventory items and ingredient stock management
- Dynamic pizza customization using available ingredients
- Stock validation before order creation

### Orders

- Customer order creation
- Customer order history
- Order detail page
- Admin order list with pagination
- Admin order detail view with status changes

### Admin dashboard

- Summary cards and management overview
- Inventory page with create/update modals
- Order tracking and status lifecycle
- Low-stock alert cards and inventory monitoring

### Low-stock email notifications

- Admin dashboard surfaces low-stock items based on per-product thresholds
- The backend runs a scheduled inventory check and sends an email when stock falls below configured limits
- The email includes the item name, category, current stock, and threshold values

## Routes

### Customer routes

- /login
- /signup
- /forgot-password
- /reset-password/:token
- /verify-email/:token
- /dashboard
- /ingredients
- /order/new
- /orders
- /orders/:orderId

### Admin routes

- /admin/login
- /admin/dashboard
- /admin/inventory
- /admin/users
- /admin/orders
- /admin/orders/:orderId

## Getting started

### 1. Install dependencies

From the project root, install both apps separately:

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Configure environment variables

Create a `.env` file in the server folder with the values required by the backend, for example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizzahub
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
```

For the client app, configure the API base URL if needed in a Vite environment file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start the backend

```bash
cd server
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

The client usually runs on http://localhost:5173 and the API server on http://localhost:5000.

## Common workflows

### Customer workflow

1. Sign up for a new account.
2. Verify the email address.
3. Sign in to the customer dashboard.
4. Explore ingredients and create a custom pizza.
5. Place an order.
6. View the order and monitor its status.

### Admin workflow

1. Sign in using the admin login screen.
2. View the admin dashboard.
3. Manage inventory items.
4. Review incoming customer orders.
5. Update the order status as the pizza moves through fulfillment.

## Production notes

This app is built as a practical full-stack starter and dashboard demo. It is well-suited for learning or extending with features like:

- payment confirmation flows
- loyalty and promotions
- analytics dashboards
- real-time order notifications
- more advanced admin reporting

## Scripts

### Client scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server scripts

```bash
npm run dev
npm run start
```

## Summary

PizzaHub is a complete pizza ordering platform that combines a polished customer experience with a functional admin management dashboard. It demonstrates real-world patterns such as authentication, authorization, order flow management, inventory tracking, and responsive UI design.
