import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Filter, X } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';

interface FilterOptions {
  category: string;
  date: string;
  location: string;
  search: string;
}

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { events, loading, getEvents } = useEvents();
  
  // Parse query params
  const params = new URLSearchParams(location.search);
  const [filters, setFilters] = useState<FilterOptions>({
    category: params.get('category') || '',
    date: params.get('date') || '',
    location: params.get('location') || '',
    search: params.get('search') || ''
  });
  
  // Categories
  const categories = [
    'all',
    'conference',
    'workshop',
    'seminar',
    'concert',
    'exhibition',
    'sport',
    'networking',
    'other'
  ];
  
  // Fetch events when component mounts or filters change
  useEffect(() => {
    // Create a copy of filters that only includes non-empty values
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
    );
    
    getEvents(activeFilters);
    
    // Update URL with filters
    const queryParams = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    navigate({
      pathname: location.pathname,
      search: queryParams.toString() ? `?${queryParams.toString()}` : ''
    }, { replace: true });
  }, [filters, getEvents, location.pathname, navigate]);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      date: '',
      location: '',
      search: ''
    });
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-lg text-gray-600">
            Find and book amazing events in your area or online.
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="form-input pl-10 w-full"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="form-input pl-10 w-full"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location..."
                  className="form-input pl-10 w-full"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="form-input pl-10 w-full"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category === 'all' ? '' : category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active filters */}
            {(filters.category || filters.date || filters.location || filters.search) && (
              <div className="flex items-center flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-600">Active filters:</span>
                
                {filters.category && (
                  <div className="flex items-center bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm">
                    <span>Category: {filters.category}</span>
                    <button 
                      type="button"
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {filters.date && (
                  <div className="flex items-center bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm">
                    <span>Date: {new Date(filters.date).toLocaleDateString()}</span>
                    <button 
                      type="button"
                      onClick={() => handleFilterChange('date', '')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {filters.location && (
                  <div className="flex items-center bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm">
                    <span>Location: {filters.location}</span>
                    <button 
                      type="button"
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {filters.search && (
                  <div className="flex items-center bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm">
                    <span>Search: {filters.search}</span>
                    <button 
                      type="button"
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary-700 hover:text-primary-900 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </form>
        </div>
        
        {/* Events grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">No events found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800">
                {events.length} {events.length === 1 ? 'event' : 'events'} found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;