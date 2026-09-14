import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './header';
import { signOut, useSession } from 'next-auth/react';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders unauthenticated state correctly', () => {
    // Mock unauthenticated session
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<Header />);
    
    // Check for the logo text
    expect(screen.getByText('BattleBetz')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tournaments')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    
    // Check for auth buttons
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
  
  it('renders authenticated state correctly', () => {
    // Mock authenticated session
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<Header />);
    
    // Check for user's name
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
  
  it('opens dropdown menu when clicking on user name', async () => {
    // Mock authenticated session
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<Header />);
    const user = userEvent.setup();
    
    // Click on the user name to open dropdown
    await user.click(screen.getByText('Test User'));
    
    // Check if dropdown menu items are displayed
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
  
  it('calls signOut when clicking on sign out button', async () => {
    // Mock authenticated session
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    });

    render(<Header />);
    const user = userEvent.setup();
    
    // Click on the user name to open dropdown
    await user.click(screen.getByText('Test User'));
    
    // Click on sign out button
    await user.click(screen.getByText('Sign out'));
    
    // Check if signOut was called with correct parameters
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });
}); 