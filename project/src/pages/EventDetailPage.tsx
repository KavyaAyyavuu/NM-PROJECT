import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, 
  Share, ChevronRight, ArrowLeft, Check
} from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { useEvents } from '../hooks/useEvents';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error, getEventById } = useEvents();
  const { createBooking } = useBookings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  
  // Fetch event details
  useEffect(() => {
    if (id) {
      getEventById(id);
    }
  }, [id, getEventById]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-error-50 text-error-700 p-4 rounded-lg">
          <p>{error}</p>
          <Link to="/events" className="mt-4 btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary inline-flex">
            <ArrowLeft className="h-4 w-4 mr-2" /> Browse Events
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = format(parseISO(event.date), 'EEEE, MMMM d, yyyy');
  const isEventPast = isPast(parseISO(event.date));
  
  // Calculate total price
  const totalPrice = event.price * numberOfTickets;
  
  // Handle booking
  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book this event');
      navigate('/login');
      return;
    }
    
    if (isEventPast) {
      toast.error('Cannot book a past event');
      return;
    }
    
    if (event.availableSpots < numberOfTickets) {
      toast.error(`Only ${event.availableSpots} spots available`);
      return;
    }
    
    setIsBooking(true);
    
    try {
      const booking = await createBooking(event._id, numberOfTickets);
      
      if (booking) {
        toast.success('Event booked successfully!');
        navigate('/dashboard/bookings');
      }
    } catch (error) {
      toast.error('Failed to book event');
    } finally {
      setIsBooking(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/events" className="hover:text-primary-600">Events</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700 truncate">{event.title}</span>
        </nav>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="relative h-64 md:h-96">
            {event.featured && (
              <div className="absolute top-4 left-4 z-10 bg-accent-500 text-white px-3 py-1 rounded-md font-semibold">
                Featured
              </div>
            )}
            
            {isEventPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-800 px-4 py-2 rounded-md font-bold text-lg">
                  Event Has Ended
                </span>
              </div>
            )}
            
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between">
              <div className="w-full lg:w-2/3 pr-0 lg:pr-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  
                  {event.availableSpots < 5 && event.availableSpots > 0 && !isEventPast && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-800">
                      Only {event.availableSpots} spots left!
                    </span>
                  )}
                  
                  {event.availableSpots === 0 && !isEventPast && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-800">
                      Sold Out
                    </span>
                  )}
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Event Details</h2>
                  <p className="text-gray-700 mb-6 whitespace-pre-line">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-gray-600">{formattedDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Time & Duration</div>
                        <div className="text-gray-600">{event.time} • {event.duration} minutes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600">{event.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Capacity</div>
                        <div className="text-gray-600">
                          {event.capacity} people • {event.availableSpots} spots left
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary-600 mr-1" />
                      <span className="text-xl font-semibold">
                        {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                        toast.success('Event link copied to clipboard!');
                      }}
                      className="flex items-center text-gray-600 hover:text-primary-600"
                    >
                      <Share className="h-5 w-5 mr-1" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Book This Event</h3>
                  
                  {isEventPast ? (
                    <div className="bg-gray-100 rounded-md p-4 text-center mb-4">
                      <p className="text-gray-700 font-medium">This event has already ended</p>
                    </div>
                  ) : event.availableSpots === 0 ? (
                    <div className="bg-error-50 rounded-md p-4 text-center mb-4">
                      <p className="text-error-700 font-medium">This event is sold out</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="tickets" className="form-label">
                          Number of tickets
                        </label>
                        <select
                          id="tickets"
                          className="form-input"
                          value={numberOfTickets}
                          onChange={(e) => setNumberOfTickets(Number(e.target.value))}
                        >
                          {[...Array(Math.min(10, event.availableSpots))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4 p-4 bg-gray-100 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Price per ticket</span>
                          <span>{event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Tickets</span>
                          <span>x{numberOfTickets}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-gray-300">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleBookEvent}
                        disabled={isBooking || event.availableSpots < numberOfTickets}
                        className="btn-primary w-full py-3"
                      >
                        {isBooking ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <Check className="h-4 w-4 mr-2" />
                            Book Now
                          </span>
                        )}
                      </button>
                      
                      <p className="text-sm text-gray-600 mt-2">
                        {isAuthenticated ? 
                          'You will receive a confirmation email after booking.' : 
                          'Please login to book this event.'}
                      </p>
                    </>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Organized by</h4>
                    <p className="text-gray-700">{event.organizer.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;