import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: [1, 'You must book at least 1 ticket'],
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries and to prevent duplicate bookings
bookingSchema.index({ event: 1, user: 1 }, { unique: false });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;