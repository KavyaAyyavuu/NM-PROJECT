import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';

const HomePage = () => {
  const { events, loading, getEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get featured events on component mount
  useEffect(() => {
    getEvents();
  }, [getEvents]);
  
  // Get featured and upcoming events
  const featuredEvents = events.filter(event => event.featured).slice(0, 3);
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchTerm)}`;
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in">
              Discover & Book Amazing Events
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100 animate-slide-up">
              Find the perfect events for you - conferences, workshops, concerts and more.
            </p>
            
            <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for events..."
                  className="form-input pl-10 py-3 w-full rounded-l-md text-gray-800 focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-accent-500 text-white px-6 py-3 rounded-r-md hover:bg-accent-600 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              <Link to="/events" className="text-primary-600 hover:text-primary-700 flex items-center">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Explore Events by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Conferences', icon: '🏢', color: 'bg-primary-100', border: 'border-primary-300', hover: 'hover:bg-primary-200' },
              { name: 'Workshops', icon: '🔧', color: 'bg-secondary-100', border: 'border-secondary-300', hover: 'hover:bg-secondary-200' },
              { name: 'Concerts', icon: '🎵', color: 'bg-accent-100', border: 'border-accent-300', hover: 'hover:bg-accent-200' },
              { name: 'Exhibitions', icon: '🖼️', color: 'bg-purple-100', border: 'border-purple-300', hover: 'hover:bg-purple-200' },
              { name: 'Sports', icon: '⚽', color: 'bg-green-100', border: 'border-green-300', hover: 'hover:bg-green-200' },
              { name: 'Networking', icon: '🤝', color: 'bg-yellow-100', border: 'border-yellow-300', hover: 'hover:bg-yellow-200' },
              { name: 'Seminars', icon: '📚', color: 'bg-blue-100', border: 'border-blue-300', hover: 'hover:bg-blue-200' },
              { name: 'Other', icon: '✨', color: 'bg-gray-100', border: 'border-gray-300', hover: 'hover:bg-gray-200' }
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/events?category=${category.name.toLowerCase()}`}
                className={`flex flex-col items-center justify-center p-6 ${category.color} border ${category.border} rounded-lg shadow-sm transition-all ${category.hover} transform hover:-translate-y-1`}
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <span className="text-lg font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-primary-600 hover:text-primary-700 flex items-center">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Host Your Own Event?</h2>
            <p className="text-lg mb-8 text-primary-100">
              Create and manage your own events with our easy-to-use platform. Get started today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/dashboard/create-event" 
                className="btn-accent px-6 py-3"
              >
                Create Event
              </Link>
              <Link 
                to="/events" 
                className="btn-secondary border-white hover:bg-white/10 px-6 py-3"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Event Organizer',
                testimonial: 'EventHub has revolutionized how I manage events. The platform is intuitive and the customer support is excellent.',
                avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              {
                name: 'Michael Chen',
                role: 'Conference Attendee',
                testimonial: 'I\'ve discovered amazing events through EventHub that I wouldn\'t have found otherwise. The booking process is seamless!',
                avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              },
              {
                name: 'Emma Rodriguez',
                role: 'Workshop Host',
                testimonial: 'As someone who regularly hosts workshops, EventHub has made it so much easier to reach my audience and manage registrations.',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;