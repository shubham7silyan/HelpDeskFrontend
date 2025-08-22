import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';

const Settings = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/config');
      setConfig(response.data.config);
      reset(response.data.config);
    } catch (error) {
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await api.put('/config', {
        autoCloseEnabled: data.autoCloseEnabled,
        confidenceThreshold: parseFloat(data.confidenceThreshold),
        slaHours: parseInt(data.slaHours),
        maxTicketsPerUser: parseInt(data.maxTicketsPerUser),
        emailNotificationsEnabled: data.emailNotificationsEnabled
      });
      
      setConfig(response.data.config);
      toast.success('Configuration updated successfully!');
    } catch (error) {
      toast.error('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="card h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto settings-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">System Settings</h1>
        <p className="text-black">Configure your helpdesk system behavior.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Agent Configuration</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                {...register('autoCloseEnabled')}
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-3 text-sm text-gray-700">
                Enable automatic ticket closure
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Confidence Threshold for Auto-Close
              </label>
              <input
                {...register('confidenceThreshold', { 
                  required: 'Confidence threshold is required',
                  min: { value: 0, message: 'Must be between 0 and 1' },
                  max: { value: 1, message: 'Must be between 0 and 1' }
                })}
                type="number"
                step="0.01"
                min="0"
                max="1"
                className="input-field mt-1"
                placeholder="0.78"
              />
              <p className="mt-1 text-sm text-gray-600">
                Tickets with AI confidence above this threshold will be auto-closed (0.0 - 1.0)
              </p>
              {errors.confidenceThreshold && (
                <p className="mt-1 text-sm text-red-600">{errors.confidenceThreshold.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SLA & Limits</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                SLA Response Time (hours)
              </label>
              <input
                {...register('slaHours', { 
                  required: 'SLA hours is required',
                  min: { value: 1, message: 'Must be at least 1 hour' }
                })}
                type="number"
                min="1"
                className="input-field mt-1"
                placeholder="24"
              />
              <p className="mt-1 text-sm text-gray-600">
                Expected response time for support tickets
              </p>
              {errors.slaHours && (
                <p className="mt-1 text-sm text-red-600">{errors.slaHours.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Max Tickets Per User
              </label>
              <input
                {...register('maxTicketsPerUser', { 
                  required: 'Max tickets per user is required',
                  min: { value: 1, message: 'Must be at least 1' }
                })}
                type="number"
                min="1"
                className="input-field mt-1"
                placeholder="10"
              />
              <p className="mt-1 text-sm text-gray-600">
                Maximum number of open tickets per user
              </p>
              {errors.maxTicketsPerUser && (
                <p className="mt-1 text-sm text-red-600">{errors.maxTicketsPerUser.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          
          <div className="flex items-center">
            <input
              {...register('emailNotificationsEnabled')}
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="ml-3 text-sm text-gray-700">
              Enable email notifications
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
