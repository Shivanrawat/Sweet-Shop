# Sweet Shop Management System

**🚀 Live Demo:** [https://sweet-shop-cp2v.onrender.com](https://sweet-shop-cp2v.onrender.com)

A full-stack Sweet Shop Management System built with TDD principles. This application features user authentication with JWT tokens, a PostgreSQL database for data persistence, and a modern React frontend.

## Features

### For Customers
- User registration and login with secure JWT authentication
- Browse and search sweets catalog by name, category, or price range
- Purchase sweets with real-time inventory updates
- Responsive design with dark/light mode support

### For Administrators
- Full CRUD operations for managing sweets inventory
- Add new sweets with name, description, category, price, and initial stock
- Edit existing sweet details
- Delete sweets from inventory
- Restock sweets to increase quantity
- Dashboard with inventory statistics (total products, stock levels, low stock alerts)

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **Validation**: Zod schemas

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Sweets (Protected - requires authentication)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets by name, category, or price range
- `POST /api/sweets` - Add a new sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet's details
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)

## Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sweet-shop