import React, { useState } from 'react';
import { validators } from '../../utils/validators';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Profile editing form component
 * Allows users to update their personal information
 */
const ProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuthContext();
  const { success, error } = useToastContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.firstName = validators.required(formData.firstName, 'First name');
    newErrors.lastName = validators.required(formData.lastName, 'Last name');
    newErrors.email = validators.email(formData.email);

    // Remove null errors
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === null) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement profile update API call
      // const result = await UserService.updateProfile(formData);
      
      // For now, just update local state
      updateUser(formData);
      success('Profile updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="firstName"
          type="text"
          required
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <Input
          label="Last name"
          name="lastName"
          type="text"
          required
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Email address"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        helpText="Changing your email will require verification"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
