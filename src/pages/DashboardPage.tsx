// Enhanced Dashboard page with user stats and activity

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { selectUser, selectAuthLoading, logoutAsync } from '../features/auth';
import { mockDashboardAPI, DashboardStats } from '../services/mockApi';
import { LoadingSpinner, Button } from '../components';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setDashboardLoading(true);
        setDashboardError(null);
        
        // Get stored tokens
        const tokensString = localStorage.getItem('tokens');
        if (!tokensString) {
          throw new Error('No authentication tokens found');
        }
        
        const tokens = JSON.parse(tokensString);
        const response = await mockDashboardAPI.getDashboardStats(tokens.accessToken);
        
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          throw new Error(response.message || 'Failed to load dashboard data');
        }
      } catch (error: any) {
        setDashboardError(error.message);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return '👤';
      case 'job_posted':
        return '💼';
      case 'application_submitted':
        return '📝';
      case 'interview_scheduled':
        return '📅';
      default:
        return '📋';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening in your hiring pipeline
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="warning"
                size="small"
                isLoading={isLoading}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {user?.permissions.includes('users:read') ? dashboardData?.totalUsers : '---'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-blue-600 text-2xl">👥</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData?.activeJobs}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-green-600 text-2xl">💼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalApplications}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-yellow-600 text-2xl">📝</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData?.pendingReviews}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <span className="text-red-600 text-2xl">⏰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Your Profile & Test Accounts</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current User Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Current User:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h5>
                        <p className="text-gray-600 capitalize">{user?.role}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Verified:</span>
                        <span className={user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                          {user?.isEmailVerified ? '✅ Yes' : '❌ No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Status:</span>
                        <span className={user?.isActive ? 'text-green-600' : 'text-red-600'}>
                          {user?.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Test Accounts */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Available Test Accounts:</h4>
                  <div className="text-sm space-y-3">
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <strong className="text-blue-900">👑 Admin Account</strong>
                      <br />
                      <code className="text-xs bg-blue-100 px-1 rounded">admin@example.com</code> / <code className="text-xs bg-blue-100 px-1 rounded">password</code>
                      <br />
                      <span className="text-blue-700 text-xs">Full access to all features</span>
                    </div>
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <strong className="text-green-900">💼 HR Account</strong>
                      <br />
                      <code className="text-xs bg-green-100 px-1 rounded">hr@example.com</code> / <code className="text-xs bg-green-100 px-1 rounded">password123</code>
                      <br />
                      <span className="text-green-700 text-xs">Can manage jobs and candidates</span>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <strong className="text-yellow-900">👤 Employee Account</strong>
                      <br />
                      <code className="text-xs bg-yellow-100 px-1 rounded">user@example.com</code> / <code className="text-xs bg-yellow-100 px-1 rounded">user123</code>
                      <br />
                      <span className="text-yellow-700 text-xs">Limited to job viewing and profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {dashboardData && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest updates from your hiring pipeline</p>
              </div>
              <div className="card-body p-0">
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          {activity.user && (
                            <p className="text-sm text-gray-500">by {activity.user}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};