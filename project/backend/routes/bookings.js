import express from 'express';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'title date time location image price'
      })
      .sort({ bookingDate: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/bookings
// @desc    Book an event
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if event has already happened
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book past events'
      });
    }
    
    // Check if enough spots are available
    const bookings = await Booking.find({ event: eventId });
    const bookedSpots = bookings.reduce((total, booking) => total + booking.numberOfTickets, 0);
    
    if (bookedSpots + numberOfTickets > event.capacity) {
      return res.status(400).json({
        success: false,
        message: `Not enough spots available. Only ${event.capacity - bookedSpots} spots left.`
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      numberOfTickets
    });
    
    // Populate event details for response
    await booking.populate('event');
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    // Check if event has already happened
    const event = await Event.findById(booking.event);
    if (event && new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for past events'
      });
    }
    
    await booking.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

export default router;