# Sweet Shop Management System

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
## My AI Usage

### Tools Used
- **Google Gemini**: Used for architectural advice, refactoring existing components, and generating the "Purchase History" logic.
- **Replit Agent**: Used for initial project scaffolding, boilerplate generation, and setting up the database connection.

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
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Required environment variables
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your-secure-session-secret
```

4. Push the database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

### Creating an Admin User

By default, new users are created with the "user" role. To create an admin user, you can either:
1. Manually update a user's role in the database
2. Modify the registration endpoint temporarily to create admin users

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities (auth, theme, queryClient)
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Express backend
│   ├── auth.ts             # JWT authentication middleware
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API route handlers
│   └── storage.ts          # Database operations
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schema and Zod validation
└── README.md
```

## My AI Usage

### Tools Used
- **Replit Agent (Claude)**: Used throughout the development process for code generation, debugging, and architecture decisions.

### How AI Was Used

1. **Schema Design**: AI helped design the database schema including users with roles, sweets with categories, and purchase tracking relationships.

2. **API Structure**: AI assisted in structuring RESTful API endpoints following best practices for authentication, CRUD operations, and inventory management.

3. **Frontend Components**: AI generated React components including:
   - Authentication forms with validation
   - Sweet cards with purchase functionality
   - Search and filter interfaces
   - Admin dashboard with CRUD operations
   - Restock dialog for inventory management

4. **JWT Authentication**: AI implemented the complete JWT authentication flow including token generation, middleware protection, and role-based authorization.

5. **Styling & UX**: AI applied Tailwind CSS styling following design guidelines for a professional, responsive user interface with dark mode support.

### Reflection on AI Impact

Using AI significantly accelerated the development process by:
- Generating boilerplate code quickly, allowing focus on business logic
- Providing consistent code patterns across the application
- Catching potential issues early through comprehensive error handling
- Ensuring type safety with TypeScript and Zod validation throughout

The AI was particularly helpful in creating a cohesive design system and ensuring all components followed the established patterns. However, manual review and testing were essential to verify the generated code worked correctly in the specific context of this application.

## Screenshots

*Screenshots will be added after deployment*

## License

MIT License
