# Designer Portfolio Platform

An online portfolio platform that enables designers and artists to create, manage, and share professional portfolios through a low-code visual builder.

## Features

- **Account Management**: Secure registration with invite codes and profile management
- **Visual Portfolio Builder**: Drag-and-drop interface with modular blocks
- **Media Management**: Optimized image upload and storage with Firebase
- **Template System**: Pre-designed layouts (Gallery, About, Contact)
- **Mobile Optimization**: WeChat-friendly sharing and responsive design
- **Admin Panel**: Invite code management and user administration

## Tech Stack

### Frontend
- React 18 with TypeScript
- React DND for drag-and-drop
- Styled Components for theming
- React Query for state management
- Vite for build tooling

### Backend
- NestJS with TypeScript
- PostgreSQL with TypeORM
- Passport.js for authentication
- Firebase Storage for media files
- JWT for session management

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Firebase project with Storage enabled

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd designer-portfolio-platform
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database and Firebase credentials
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URL
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (or use Docker)
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   
   # Run migrations
   cd backend
   npm run migration:run
   ```

5. **Start the development servers**
   ```bash
   # Backend (in backend directory)
   npm run start:dev
   
   # Frontend (in frontend directory)
   npm run dev
   ```

### Using Docker

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## Project Structure

```
designer-portfolio-platform/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── config/         # Database and Firebase configuration
│   │   ├── entities/       # TypeORM entities
│   │   ├── modules/        # Feature modules
│   │   └── migrations/     # Database migrations
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
└── docker-compose.yml      # Docker configuration
```

## Available Scripts

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.