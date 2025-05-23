import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, X, AlertTriangle } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const { bookings, loading, error, getUserBookings, cancelBooking } = useBookings();
  
  // Fetch user bookings
  useEffect(() => {
    getUserBookings();
  }, [getUserBookings]);
  
  // Split bookings into upcoming and past
  const upcomingBookings = bookings.filter(booking => 
    !isPast(new Date(booking.event.date))
  );
  
  const pastBookings = bookings.filter(booking => 
    isPast(new Date(booking.event.date))
  );
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string, eventTitle: string) => {
    // Confirm cancellation
    if (window.confirm(`Are you sure you want to cancel your booking for "${eventTitle}"?`)) {
      const success = await cancelBooking(bookingId);
      
      if (success) {
        toast.success('Booking cancelled successfully');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-error-50 text-error-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">
          View and manage all your event bookings.
        </p>
      </div>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
          <p className="text-gray-600 mb-6">
            You haven't booked any events yet. Browse our events and book your next experience!
          </p>
          <Link to="/events" className="btn-primary px-6 py-2">
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          {upcomingBookings.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
              
              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          src={booking.event.image} 
                          alt={booking.event.title}
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          <Link to={`/events/${booking.event._id}`} className="hover:text-primary-600">
                            {booking.event.title}
                          </Link>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{format(new Date(booking.event.date), 'MMM dd, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{booking.event.time}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{booking.event.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="mb-2 sm:mb-0">
                            <span className="text-sm font-medium bg-primary-100 text-primary-800 px-2.5 py-0.5 rounded-full">
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className="ml-2 text-sm text-gray-700">
                              {booking.numberOfTickets} {booking.numberOfTickets === 1 ? 'ticket' : 'tickets'}
                            </span>
                            <span className="ml-2 text-sm font-medium">
                              ${(booking.event.price * booking.numberOfTickets).toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleCancelBooking(booking._id, booking.event.title)}
                            className="text-sm text-error-600 hover:text-error-800 flex items-center mt-2 sm:mt-0"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
              
              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                {pastBookings.map((booking) => (
                  <div key={booking._id} className="p-6 opacity-75">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          src={booking.event.image} 
                          alt={booking.event.title}
                          className="h-32 w-32 object-cover rounded-lg filter grayscale"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          <Link to={`/events/${booking.event._id}`} className="hover:text-primary-600">
                            {booking.event.title}
                          </Link>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{format(new Date(booking.event.date), 'MMM dd, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{booking.event.time}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{booking.event.location}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full">
                            Past Event
                          </span>
                          <span className="ml-2 text-sm text-gray-700">
                            {booking.numberOfTickets} {booking.numberOfTickets === 1 ? 'ticket' : 'tickets'}
                          </span>
                          <span className="ml-2 text-sm font-medium">
                            ${(booking.event.price * booking.numberOfTickets).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookingsPage;