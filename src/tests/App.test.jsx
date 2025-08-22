import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock the auth store
vi.mock('../store/authStore', () => ({
  default: vi.fn(() => ({
    user: null,
    initializeAuth: vi.fn()
  }))
}));

// Mock all page components
vi.mock('../pages/Login', () => ({
  default: () => <div>Login Page</div>
}));

vi.mock('../pages/Register', () => ({
  default: () => <div>Register Page</div>
}));

vi.mock('../pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>
}));

describe('App Component', () => {
  it('renders login page when user is not authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
