import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    
    if (result.success) {
      toast.success('Login successful!');
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
              Welcome back
            </h1>
            <p style={{ opacity: '0.7' }}>
              Sign in to your Smart Helpdesk account
            </p>
          </div>
          
          <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
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
                  <span className="shubham-loader-text">Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm" style={{ opacity: '0.7' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-white"
                style={{ textDecoration: 'underline' }}
              >
                Create account
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

export default Login;
