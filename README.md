# Hiring CMS

A modern hiring management system built with React, Redux Toolkit, and TypeScript following clean architecture principles.

## 🏗️ Architecture

This project follows a feature-based architecture with clear separation of concerns:

```
src/
├── app/                    # Redux store configuration
│   ├── store.ts           # Main store setup
│   └── rootReducer.ts     # Root reducer combining all features
│
├── components/            # Shared, reusable UI components
│   ├── Button.tsx         # Button component with variants
│   ├── Modal.tsx          # Modal component
│   ├── LoadingSpinner.tsx # Loading indicators
│   └── index.ts           # Component exports
│
├── features/              # Feature-based modules
│   └── auth/              # Authentication feature
│       ├── authSlice.ts   # Redux slice with auth logic
│       ├── Login.tsx      # Login component
│       ├── Register.tsx   # Register component
│       └── index.ts       # Feature exports
│
├── pages/                 # Page-level components
│   ├── HomePage.tsx       # Landing page
│   ├── LoginPage.tsx      # Login page
│   ├── RegisterPage.tsx   # Registration page
│   ├── DashboardPage.tsx  # Dashboard page
│   └── index.ts           # Page exports
│
├── hooks/                 # Shared custom hooks
│   ├── useDebounce.ts     # Debounce hook
│   ├── useLocalStorage.ts # Local storage hook
│   └── index.ts           # Hook exports
│
├── utils/                 # Utility functions
│   ├── formatters.ts      # Formatting utilities
│   └── index.ts           # Utility exports
│
├── App.tsx               # Main app component with routing
├── index.tsx             # App entry point
└── index.css             # Global styles
```

## 🚀 Features

- **Authentication System**: Complete login/register flow with Redux state management
- **Protected Routes**: Route protection based on authentication status
- **Clean Architecture**: Feature-based organization with clear separation
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS
- **Mock API Integration**: Simulated backend API for demonstration

## 🛠️ Technologies

- **React 18** - UI library
- **Redux Toolkit** - State management
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client (configured for future API integration)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## 🔐 Demo Credentials

Use these credentials to test the login functionality:
- Email: `admin@example.com`
- Password: `password`

## 🗂️ Project Structure Explanation

### `/app`
Contains Redux store configuration and root reducer. This is where all feature slices are combined.

### `/components`
Shared, "dumb" components that don't contain feature-specific logic. These are reusable across the entire application.

### `/features`
Feature-based modules containing:
- Redux slices (state + actions + reducers)
- Feature-specific components
- Feature-specific hooks and utilities

### `/pages`
Page-level components that assemble features and handle routing. These act as containers for feature components.

### `/hooks`
Shared custom hooks that can be used across different features.

### `/utils`
Utility functions for formatting, validation, and other helper operations.

## 🔄 State Management

The application uses Redux Toolkit for state management with the following patterns:

- **Slices**: Feature-based slices containing actions, reducers, and selectors
- **Async Thunks**: For handling asynchronous operations
- **Type Safety**: Full TypeScript integration with typed hooks

## 🛣️ Routing

Protected and public routes are implemented with React Router:

- **Public Routes**: Redirect to dashboard if authenticated
- **Protected Routes**: Require authentication to access
- **Route Guards**: Centralized authentication checking

## 🎨 Styling

The project uses Tailwind CSS for styling with:

- **Utility Classes**: For rapid UI development
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Flexible component styling
- **Custom Components**: Reusable UI components with consistent styling

## 🔮 Future Enhancements

- Real API integration with https://example.com
- Advanced permission-based route protection
- Job posting and candidate management features
- File upload functionality
- Advanced filtering and search
- Analytics dashboard
- Email notifications
- Dark mode support

## 📝 Development Guidelines

1. **Feature Organization**: Keep related code together in feature folders
2. **Type Safety**: Always use TypeScript interfaces and types
3. **Component Design**: Create reusable, composable components
4. **State Management**: Use Redux for global state, local state for component-specific data
5. **Error Handling**: Implement proper error boundaries and user feedback
6. **Performance**: Use React.memo and useMemo for optimization when needed

This structure promotes maintainability, scalability, and developer experience while following modern React best practices.