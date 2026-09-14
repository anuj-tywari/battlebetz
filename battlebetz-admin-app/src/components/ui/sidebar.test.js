import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from './sidebar';
import { signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: { user: { name: 'Test User', email: 'test@example.com' } },
    status: 'authenticated',
  })),
}));

describe('Sidebar', () => {
  it('renders correctly', () => {
    render(<Sidebar />);
    
    // Check for the logo text
    expect(screen.getByText('BattleBetz Admin')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tournaments')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Check for sign out button
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
  
  it('calls signOut when sign out button is clicked', async () => {
    render(<Sidebar />);
    const user = userEvent.setup();
    
    // Click the sign out button
    await user.click(screen.getByText('Sign Out'));
    
    // Check if signOut was called
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/auth/login' });
  });
}); 