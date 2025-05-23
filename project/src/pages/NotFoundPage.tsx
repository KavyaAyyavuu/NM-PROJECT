import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn-primary flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <Link to="/events" className="btn-secondary flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;