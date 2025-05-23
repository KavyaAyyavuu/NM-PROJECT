import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Plus, Users, ChevronRight,
  Ticket, ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useBookings } from '../hooks/useBookings';

const DashboardPage = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading, getEvents } = useEvents();
  const { bookings, loading: bookingsLoading, getUserBookings } = useBookings();
  
  // Fetch user's events and bookings
  useEffect(() => {
    getEvents();
    getUserBookings();
  }, [getEvents, getUserBookings]);
  
  // Filter user's events
  const userEvents = events.filter(event => event.organizer._id === user?.id);
  
  // Get upcoming bookings
  const upcomingBookings = bookings
    .filter(booking => new Date(booking.event.date) > new Date())
    .slice(0, 3);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          Here's an overview of your events and bookings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quick stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <Ticket className="h-5 w-5 mr-2 text-primary-600" />
            <span>My Bookings</span>
          </h2>
          
          {bookingsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't booked any events yet.</p>
              <Link to="/events" className="btn-primary">
                Browse Events
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                    <div className="h-10 w-10 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 flex-shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-3 flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {booking.event.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.event.date).toLocaleDateString()} • {booking.event.time}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      x{booking.numberOfTickets}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link to="/dashboard/bookings" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                View all bookings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            <span>My Events</span>
          </h2>
          
          {eventsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : userEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
              <Link to="/dashboard/create-event" className="btn-primary">
                Create Event
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {userEvents.slice(0, 3).map((event) => (
                  <Link 
                    key={event._id}
                    to={`/events/${event._id}`}
                    className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100"
                  >
                    <div className="h-10 w-10 bg-secondary-100 rounded-md flex items-center justify-center text-secondary-700 flex-shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-3 flex-grow min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>{event.capacity - event.availableSpots}/{event.capacity} booked</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <Link to="/dashboard/events" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                  View all events
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
                
                <Link 
                  to="/dashboard/create-event" 
                  className="inline-flex items-center text-sm px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Event
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/events" 
            className="p-4 bg-primary-50 rounded-lg flex flex-col items-center hover:bg-primary-100 transition-colors"
          >
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-3">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="font-medium">Browse Events</span>
          </Link>
          
          <Link 
            to="/dashboard/create-event" 
            className="p-4 bg-secondary-50 rounded-lg flex flex-col items-center hover:bg-secondary-100 transition-colors"
          >
            <div className="h-12 w-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Create Event</span>
          </Link>
          
          <Link 
            to="/dashboard/bookings" 
            className="p-4 bg-accent-50 rounded-lg flex flex-col items-center hover:bg-accent-100 transition-colors"
          >
            <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mb-3">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="font-medium">My Bookings</span>
          </Link>
          
          <Link 
            to="/dashboard/profile" 
            className="p-4 bg-gray-100 rounded-lg flex flex-col items-center hover:bg-gray-200 transition-colors"
          >
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <span className="font-medium">My Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;