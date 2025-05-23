import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  price: number;
  image: string;
  organizer: {
    _id: string;
    name: string;
  };
  featured: boolean;
  availableSpots: number;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isEventPast = isPast(new Date(event.date));
  
  // Format date
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  
  // Category styles
  const getCategoryStyle = () => {
    switch(event.category) {
      case 'conference':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'seminar':
        return 'bg-yellow-100 text-yellow-800';
      case 'concert':
        return 'bg-purple-100 text-purple-800';
      case 'exhibition':
        return 'bg-pink-100 text-pink-800';
      case 'sport':
        return 'bg-red-100 text-red-800';
      case 'networking':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="card overflow-hidden group transform transition-all duration-300 hover:-translate-y-1">
      <Link to={`/events/${event._id}`}>
        <div className="relative h-48 overflow-hidden">
          {event.featured && (
            <div className="absolute top-2 left-2 z-10 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Featured
            </div>
          )}
          
          {isEventPast && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white/80 text-gray-800 px-3 py-1 rounded-md font-medium">
                Event Ended
              </span>
            </div>
          )}
          
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryStyle()}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
        
        <Link to={`/events/${event._id}`} className="block mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.time} • {event.duration} min</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            <span className="font-medium">
              {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span className={`${event.availableSpots < 5 ? 'text-error-700 font-medium' : 'text-gray-600'}`}>
              {event.availableSpots} spots left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;