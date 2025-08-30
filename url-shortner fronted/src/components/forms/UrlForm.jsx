import React, { useState } from 'react';
import { validators } from '../../utils/validators';
import { UrlService } from '../../services/urlService';
import { useToastContext } from '../../context/ToastContext';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * URL creation form integrating with Spring Boot URL service
 */
const UrlForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    description: '',
    expiresAt: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    
    newErrors.originalUrl = validators.url(formData.originalUrl);
    newErrors.title = validators.title(formData.title);
    newErrors.description = validators.description(formData.description);

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
      const result = await UrlService.createUrl({
        originalUrl: formData.originalUrl,
        title: formData.title || null,
        description: formData.description || null,
        expiresAt: formData.expiresAt || null
      });

      success('URL created successfully!');
      
      // Reset form
      setFormData({
        originalUrl: '',
        title: '',
        description: '',
        expiresAt: ''
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      error(err.message || 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Original URL"
        name="originalUrl"
        type="url"
        required
        value={formData.originalUrl}
        onChange={handleChange}
        error={errors.originalUrl}
        placeholder="https://example.com/very/long/url"
        helpText="Enter the URL you want to shorten"
      />

      <Input
        label="Title (optional)"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Give your URL a memorable title"
        helpText="Maximum 500 characters"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Add a description for your URL"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Maximum 1000 characters</p>
      </div>

      <Input
        label="Expiration date (optional)"
        name="expiresAt"
        type="datetime-local"
        value={formData.expiresAt}
        onChange={handleChange}
        error={errors.expiresAt}
        helpText="URL will automatically expire at this date"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Create Short URL
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
