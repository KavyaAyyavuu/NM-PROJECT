import { useState, useCallback } from 'react';
import axios from 'axios';

// Types
interface Booking {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: number;
  };
  numberOfTickets: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
}

// API URL
const API_URL = 'http://localhost:5000/api';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's bookings
  const getUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/bookings`, config);
      
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      console.error('Get bookings error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new booking
  const createBooking = useCallback(async (eventId: string, numberOfTickets: number) => {
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
      
      const response = await axios.post(`${API_URL}/bookings`, {
        eventId,
        numberOfTickets
      }, config);
      
      if (response.data.success) {
        // Refresh bookings
        getUserBookings();
        return response.data.data;
      } else {
        setError(response.data.message || 'Failed to create booking');
        return null;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
      console.error('Create booking error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getUserBookings]);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId: string) => {
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
      
      const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, config);
      
      if (response.data.success) {
        // Update local state
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking._id !== bookingId)
        );
        return true;
      } else {
        setError(response.data.message || 'Failed to cancel booking');
        return false;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
      console.error('Cancel booking error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    getUserBookings,
    createBooking,
    cancelBooking
  };
};