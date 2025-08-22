import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/tickets', {
        title: data.title,
        description: data.description,
        category: data.category,
        attachmentUrls: data.attachmentUrls 
          ? data.attachmentUrls.split('\n')
              .map(url => url.trim())
              .filter(url => url && url.startsWith('http'))
          : []
      });

      toast.success('Ticket created successfully!');
      navigate(`/tickets/${response.data.ticket.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-gray-600">Describe your issue and we'll help you resolve it.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                {...register('title', { 
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  }
                })}
                type="text"
                className="input-field mt-1"
                placeholder="Brief description of your issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('category')}
                className="input-field mt-1"
              >
                <option value="other">Other</option>
                <option value="billing">Billing</option>
                <option value="tech">Technical</option>
                <option value="shipping">Shipping</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  }
                })}
                rows={6}
                className="input-field mt-1"
                placeholder="Please provide detailed information about your issue..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="attachmentUrls" className="block text-sm font-medium text-gray-700">
                Attachment URLs
              </label>
              <textarea
                {...register('attachmentUrls')}
                rows={3}
                className="input-field mt-1"
                placeholder="https://example.com/screenshot.png&#10;https://example.com/document.pdf"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter valid HTTP/HTTPS URLs (one per line). Invalid URLs will be automatically filtered out.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
