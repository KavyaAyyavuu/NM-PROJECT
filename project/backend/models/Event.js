import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['conference', 'workshop', 'seminar', 'concert', 'exhibition', 'sport', 'networking', 'other']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Event duration is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required']
  },
  price: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.bookings.length;
});

// Virtual for bookings
eventSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'event'
});

const Event = mongoose.model('Event', eventSchema);

export default Event;