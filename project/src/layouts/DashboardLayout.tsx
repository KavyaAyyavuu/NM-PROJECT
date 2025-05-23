import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Calendar, 
  User, LogOut, Plus, Settings, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/dashboard/bookings', label: 'My Bookings', icon: <Calendar className="h-5 w-5" /> },
    { path: '/dashboard/create-event', label: 'Create Event', icon: <Plus className="h-5 w-5" /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <Calendar className="h-7 w-7 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-primary-800">EventHub</span>
            </Link>
          </div>

          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <div className={`mr-3 ${
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-gray-500 group-hover:text-primary-600'
                  }`}>
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {user?.name?.[0].toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity ease-linear duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        
        <div className="relative flex flex-col w-full max-w-xs pb-12 overflow-y-auto bg-white">
          <div className="flex items-center justify-between px-4 pt-5 pb-2">
            <Link to="/" className="flex items-center">
              <Calendar className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-primary-800">EventHub</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 rounded-md hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="px-4 pt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
                onClick={toggleSidebar}
              >
                <div className={`mr-4 ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-500 group-hover:text-primary-600'
                }`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                toggleSidebar();
              }}
              className="group flex w-full items-center px-2 py-2 mt-4 text-base font-medium text-gray-700 rounded-md hover:bg-primary-50 hover:text-primary-700"
            >
              <LogOut className="mr-4 h-5 w-5 text-gray-500 group-hover:text-primary-600" />
              Sign out
            </button>
          </nav>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/dashboard' && 'Dashboard'}
                {location.pathname === '/dashboard/bookings' && 'My Bookings'}
                {location.pathname === '/dashboard/create-event' && 'Create Event'}
                {location.pathname === '/dashboard/profile' && 'Profile'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="hidden md:flex items-center text-sm text-gray-500">
                <Link to="/" className="hover:text-primary-600">Home</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>Dashboard</span>
                {location.pathname !== '/dashboard' && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span>
                      {location.pathname === '/dashboard/bookings' && 'My Bookings'}
                      {location.pathname === '/dashboard/create-event' && 'Create Event'}
                      {location.pathname === '/dashboard/profile' && 'Profile'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;