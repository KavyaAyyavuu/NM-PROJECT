import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import toast from 'react-hot-toast';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  capacity: number;
  price: number;
  image: string;
}

const CreateEventPage = () => {
  const { createEvent, loading, error } = useEvents();
  const [imagePreview, setImagePreview] = useState('https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<EventFormData>({
    defaultValues: {
      category: 'conference',
      duration: 60,
      capacity: 50,
      price: 0,
      image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  });
  
  // Watch the image input to update preview
  const watchedImage = watch('image');
  
  React.useEffect(() => {
    if (watchedImage) {
      setImagePreview(watchedImage);
    }
  }, [watchedImage]);
  
  // Show error toast when error changes
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const onSubmit = async (data: EventFormData) => {
    const event = await createEvent(data);
    
    if (event) {
      toast.success('Event created successfully!');
      navigate(`/events/${event._id}`);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-primary-700 text-white p-6">
        <h1 className="text-2xl font-bold">Create a New Event</h1>
        <p className="text-primary-200">Fill in the details to create your event</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main event details (2/3 width) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className="form-label">
                Event Title*
              </label>
              <input
                id="title"
                type="text"
                className={`form-input ${errors.title ? 'border-error-500' : ''}`}
                placeholder="e.g., Annual Tech Conference 2025"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title must be less than 100 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="form-label">
                Description*
              </label>
              <textarea
                id="description"
                rows={6}
                className={`form-input ${errors.description ? 'border-error-500' : ''}`}
                placeholder="Provide details about your event..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 50,
                    message: 'Description must be at least 50 characters'
                  }
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="form-label">
                  Category*
                </label>
                <select
                  id="category"
                  className={`form-input ${errors.category ? 'border-error-500' : ''}`}
                  {...register('category', { 
                    required: 'Category is required' 
                  })}
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="sport">Sport</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="form-label flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  Location*
                </label>
                <input
                  id="location"
                  type="text"
                  className={`form-input ${errors.location ? 'border-error-500' : ''}`}
                  placeholder="e.g., Convention Center, City"
                  {...register('location', { 
                    required: 'Location is required' 
                  })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-error-600">{errors.location.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="form-label flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Date*
                </label>
                <input
                  id="date"
                  type="date"
                  className={`form-input ${errors.date ? 'border-error-500' : ''}`}
                  {...register('date', { 
                    required: 'Date is required',
                    validate: value => 
                      new Date(value) > new Date() || 'Date must be in the future'
                  })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-error-600">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="form-label flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Start Time*
                </label>
                <input
                  id="time"
                  type="time"
                  className={`form-input ${errors.time ? 'border-error-500' : ''}`}
                  {...register('time', { 
                    required: 'Start time is required' 
                  })}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-error-600">{errors.time.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="duration" className="form-label flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  Duration (minutes)*
                </label>
                <input
                  id="duration"
                  type="number"
                  className={`form-input ${errors.duration ? 'border-error-500' : ''}`}
                  min="15"
                  step="15"
                  {...register('duration', { 
                    required: 'Duration is required',
                    min: {
                      value: 15,
                      message: 'Duration must be at least 15 minutes'
                    },
                    valueAsNumber: true
                  })}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-error-600">{errors.duration.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacity" className="form-label flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  Capacity*
                </label>
                <input
                  id="capacity"
                  type="number"
                  className={`form-input ${errors.capacity ? 'border-error-500' : ''}`}
                  min="1"
                  {...register('capacity', { 
                    required: 'Capacity is required',
                    min: {
                      value: 1,
                      message: 'Capacity must be at least 1'
                    },
                    valueAsNumber: true
                  })}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-error-600">{errors.capacity.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="price" className="form-label flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  className={`form-input ${errors.price ? 'border-error-500' : ''}`}
                  min="0"
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Price cannot be negative'
                    },
                    valueAsNumber: true
                  })}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-error-600">{errors.price.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Set to 0 for free events</p>
              </div>
            </div>
          </div>
          
          {/* Image and sidebar (1/3 width) */}
          <div className="space-y-6">
            <div>
              <label htmlFor="image" className="form-label">
                Event Image URL
              </label>
              <input
                id="image"
                type="text"
                className={`form-input ${errors.image ? 'border-error-500' : ''}`}
                placeholder="https://example.com/image.jpg"
                {...register('image', { 
                  required: 'Image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
                    message: 'Enter a valid image URL'
                  }
                })}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-error-600">{errors.image.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Paste a URL to an image (JPG, PNG, etc.)</p>
            </div>
            
            <div>
              <p className="form-label">Image Preview</p>
              <div className="mt-1 border border-gray-300 rounded-md overflow-hidden h-48">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No image preview
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Reminders:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-1">•</span>
                  All fields marked with * are required
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-1">•</span>
                  Date must be in the future
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-1">•</span>
                  Provide clear event details to attract more attendees
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;