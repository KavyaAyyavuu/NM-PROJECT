import { useState, useCallback } from 'react';
import axios from 'axios';

// Types
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
  createdAt: string;
}

interface EventFilters {
  category?: string;
  date?: string;
  location?: string;
  search?: string;
}

// API URL
const API_URL = 'http://localhost:5000/api';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all events with optional filters
  const getEvents = useCallback(async (filters: EventFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.search) queryParams.append('search', filters.search);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await axios.get(`${API_URL}/events${queryString}`);
      
      if (response.data.success) {
        setEvents(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch events');
      console.error('Get events error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single event by ID
  const getEventById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/events/${id}`);
      
      if (response.data.success) {
        setEvent(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch event');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch event');
      console.error('Get event error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new event
  const createEvent = useCallback(async (eventData: Omit<Event, '_id' | 'organizer' | 'availableSpots' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated');
        return null;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.post(`${API_URL}/events`, eventData, config);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        setError(response.data.message || 'Failed to create event');
        return null;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create event');
      console.error('Create event error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event
  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated');
        return null;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.put(`${API_URL}/events/${id}`, eventData, config);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        setError(response.data.message || 'Failed to update event');
        return null;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update event');
      console.error('Update event error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated');
        return false;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.delete(`${API_URL}/events/${id}`, config);
      
      return response.data.success;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete event');
      console.error('Delete event error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    event,
    loading,
    error,
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
  };
};