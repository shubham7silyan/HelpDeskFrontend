import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password, data.role);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-4">
      <div className="w-full" style={{ maxWidth: '28rem' }}>
        <div className="card" style={{ margin: 0, padding: '48px' }}>
          <div className="text-center mb-6">
            <h1 className="font-bold mb-4" style={{ fontSize: '2.25rem' }}>
              Create account
            </h1>
            <p style={{ opacity: '0.7' }}>
              Join Smart Helpdesk today
            </p>
          </div>
          
          <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                {...register('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                type="text"
                className="input"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email'
                  }
                })}
                type="email"
                className="input"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type="password"
                className="input"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                {...register('role')}
                className="input"
              >
                <option value="user">User</option>
                <option value="agent">Support Agent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full font-semibold"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
            >
              {isLoading ? (
                <div className="shubham-loader">
                  <div className="shubham-loader-dots">
                    <div className="shubham-loader-dot"></div>
                    <div className="shubham-loader-dot"></div>
                    <div className="shubham-loader-dot"></div>
                  </div>
                  <span className="shubham-loader-text">Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm" style={{ opacity: '0.7' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-white"
                style={{ textDecoration: 'underline' }}
              >
                Sign in
              </Link>
            </p>
            
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p className="text-sm" style={{ opacity: '0.5', fontSize: '12px' }}>
                Made with ❤️ by <span className="font-semibold">Shubham Silyan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
