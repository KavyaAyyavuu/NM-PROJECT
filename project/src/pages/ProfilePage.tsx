import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });
  
  // For password confirmation validation
  const newPassword = watch('newPassword');
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form when entering edit mode
      reset({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };
  
  // Toggle password change section
  const togglePasswordChange = () => {
    setChangePassword(!changePassword);
  };
  
  // Handle form submission
  const onSubmit = (data: ProfileFormData) => {
    // Simulate API call to update profile
    toast.success('Profile updated successfully!');
    setEditMode(false);
    setChangePassword(false);
    
    // In a real application, you would call an API to update the user's profile
    console.log('Profile data to update:', data);
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          
          <button 
            type="button"
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              editMode 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="h-28 w-28 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-3xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="form-label flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Full Name
                </label>
                {editMode ? (
                  <>
                    <input
                      id="name"
                      type="text"
                      className={`form-input ${errors.name ? 'border-error-500' : ''}`}
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 p-2.5 bg-gray-50 rounded-md">{user?.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="form-label flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Email Address
                </label>
                {editMode ? (
                  <>
                    <input
                      id="email"
                      type="email"
                      className={`form-input ${errors.email ? 'border-error-500' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 p-2.5 bg-gray-50 rounded-md">{user?.email}</p>
                )}
              </div>
              
              {editMode && (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={togglePasswordChange}
                      className="flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      {changePassword ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                  </div>
                  
                  {changePassword && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div>
                        <label htmlFor="currentPassword" className="form-label">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          className={`form-input ${errors.currentPassword ? 'border-error-500' : ''}`}
                          {...register('currentPassword', { 
                            required: 'Current password is required'
                          })}
                        />
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-error-600">{errors.currentPassword.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          className={`form-input ${errors.newPassword ? 'border-error-500' : ''}`}
                          {...register('newPassword', { 
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                        />
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-error-600">{errors.newPassword.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className={`form-input ${errors.confirmPassword ? 'border-error-500' : ''}`}
                          {...register('confirmPassword', { 
                            required: 'Please confirm your password',
                            validate: value => 
                              value === newPassword || 'Passwords do not match'
                          })}
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {editMode && (
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Account Type</div>
              <div className="font-medium">
                {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Member Since</div>
              <div className="font-medium">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;