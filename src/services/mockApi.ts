// Mock API service for authentication and user management

import { LoginCredentials, RegisterData, User, AuthTokens } from '../features/auth';

// Mock database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    permissions: ['users:read', 'users:write', 'jobs:read', 'jobs:write', 'dashboard:admin'],
    isActive: true,
    isEmailVerified: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'hr@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'hr',
    permissions: ['users:read', 'jobs:read', 'jobs:write', 'candidates:read', 'candidates:write'],
    isActive: true,
    isEmailVerified: true,
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'employee',
    permissions: ['jobs:read', 'profile:read', 'profile:write'],
    isActive: true,
    isEmailVerified: false,
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Mock API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

// Helper functions
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

const generateTokens = (userId: string): AuthTokens => {
  return {
    accessToken: `mock-access-token-${userId}-${Date.now()}`,
    refreshToken: `mock-refresh-token-${userId}-${Date.now()}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    tokenType: 'Bearer'
  };
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Mock API service
export const mockAuthAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    await delay(1000); // Simulate network delay
    
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          message: 'Email and password are required',
          errors: ['Email and password are required']
        };
      }

      if (!validateEmail(credentials.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          errors: ['Invalid email format']
        };
      }

      // Find user
      const user = mockUsers.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.password === credentials.password
      );

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          errors: ['Invalid email or password']
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is deactivated',
          errors: ['Your account has been deactivated. Please contact support.']
        };
      }

      // Generate tokens
      const tokens = generateTokens(user.id);

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          tokens
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        errors: ['An unexpected error occurred']
      };
    }
  },

  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    await delay(1200); // Simulate network delay
    
    try {
      // Validate input
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return {
          success: false,
          message: 'All fields are required',
          errors: ['Email, password, first name, and last name are required']
        };
      }

      if (!validateEmail(data.email)) {
        return {
          success: false,
          message: 'Invalid email format',
          errors: ['Please enter a valid email address']
        };
      }

      if (!validatePassword(data.password)) {
        return {
          success: false,
          message: 'Password too weak',
          errors: ['Password must be at least 6 characters long']
        };
      }

      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
          errors: ['Password and confirm password must match']
        };
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          errors: ['An account with this email already exists']
        };
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email.toLowerCase(),
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'employee',
        permissions: ['jobs:read', 'profile:read', 'profile:write'],
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to mock database
      mockUsers.push(newUser);

      // Generate tokens
      const tokens = generateTokens(newUser.id);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          tokens
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        errors: ['An unexpected error occurred during registration']
      };
    }
  },

  // Logout user
  logout: async (): Promise<ApiResponse<{ success: boolean }>> => {
    await delay(500); // Simulate network delay
    
    return {
      success: true,
      data: { success: true }
    };
  },

  // Validate token (for initialization)
  validateToken: async (token: string): Promise<ApiResponse<{ user: User }>> => {
    await delay(300); // Simulate network delay
    
    // Simple token validation (in real app, this would validate JWT)
    if (!token || !token.startsWith('mock-access-token')) {
      return {
        success: false,
        message: 'Invalid token',
        errors: ['Token is invalid or expired']
      };
    }

    // Extract user ID from token (mock implementation)
    const tokenParts = token.split('-');
    const userId = tokenParts[3];
    
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        errors: ['User associated with token not found']
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account deactivated',
        errors: ['User account is deactivated']
      };
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      data: { user: userWithoutPassword }
    };
  },

  // Get user profile
  getUserProfile: async (token: string): Promise<ApiResponse<{ user: User }>> => {
    return mockAuthAPI.validateToken(token);
  },

  // Update user profile
  updateUserProfile: async (token: string, updates: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    await delay(800);
    
    const tokenValidation = await mockAuthAPI.validateToken(token);
    if (!tokenValidation.success || !tokenValidation.data) {
      return tokenValidation as ApiResponse<{ user: User }>;
    }

    const currentUser = tokenValidation.data.user;
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
        errors: ['User not found']
      };
    }

    // Update user (excluding sensitive fields)
    const allowedUpdates = ['firstName', 'lastName', 'avatar'];
    const filteredUpdates: Partial<User> = {};
    
    allowedUpdates.forEach(key => {
      if (key in updates) {
        (filteredUpdates as any)[key] = (updates as any)[key];
      }
    });

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...filteredUpdates,
      updatedAt: new Date().toISOString()
    };

    const { password, ...userWithoutPassword } = mockUsers[userIndex];

    return {
      success: true,
      data: { user: userWithoutPassword }
    };
  }
};

// Mock dashboard data
export interface DashboardStats {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  pendingReviews: number;
  recentActivity: Array<{
    id: string;
    type: 'user_registered' | 'job_posted' | 'application_submitted' | 'interview_scheduled';
    message: string;
    timestamp: string;
    user?: string;
  }>;
}

export const mockDashboardAPI = {
  getDashboardStats: async (token: string): Promise<ApiResponse<DashboardStats>> => {
    await delay(600);
    
    const tokenValidation = await mockAuthAPI.validateToken(token);
    if (!tokenValidation.success) {
      return tokenValidation as unknown as ApiResponse<DashboardStats>;
    }

    const user = tokenValidation.data!.user;
    
    // Different stats based on user role
    const baseStats = {
      totalUsers: mockUsers.length,
      activeJobs: 12,
      totalApplications: 48,
      pendingReviews: 8,
      recentActivity: [
        {
          id: '1',
          type: 'application_submitted' as const,
          message: 'New application for Senior Developer position',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: 'Alice Johnson'
        },
        {
          id: '2',
          type: 'job_posted' as const,
          message: 'New job posted: Frontend Developer',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: 'HR Team'
        },
        {
          id: '3',
          type: 'user_registered' as const,
          message: 'New user registration',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: 'Bob Smith'
        },
        {
          id: '4',
          type: 'interview_scheduled' as const,
          message: 'Interview scheduled for React Developer position',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          user: 'Jane Doe'
        }
      ]
    };

    // Filter stats based on user permissions
    if (!user.permissions.includes('users:read')) {
      baseStats.totalUsers = 0;
    }

    return {
      success: true,
      data: baseStats
    };
  }
};