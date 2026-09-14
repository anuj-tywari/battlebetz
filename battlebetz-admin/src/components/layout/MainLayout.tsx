'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Gamepad2, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  Settings,
  BellRing,
  Search,
  User,
  DollarSign,
  UserCircle,
  CalendarClock,
  Code,
  Tag,
  UserPlus,
  Ticket
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [recentNotifications, setRecentNotifications] = useState([
    { id: 1, message: 'New tournament created', time: '2 mins ago' },
    { id: 2, message: 'User placed a bet', time: '15 mins ago' },
    { id: 3, message: 'Tournament status updated', time: '1 hour ago' },
    { id: 4, message: 'New user registered', time: '3 hours ago' },
    { id: 5, message: 'Bet was won', time: '6 hours ago' },
  ]);
  const pathname = usePathname();

  // Close sidebar when path changes (mobile navigation)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Close sidebar when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/tournaments', label: 'Tournaments', icon: Trophy },
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/bets', label: 'Bets', icon: Ticket },
    { href: '/transactions', label: 'Transactions', icon: DollarSign },
    { href: '/promocodes', label: 'Promo Codes', icon: Tag },
    { href: '/leads', label: 'Leads', icon: UserPlus },
    { href: '/metrics', label: 'Metrics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  const developerItems = [
    { href: '/dev-tools', label: 'Developer Tools', icon: Code },
  ];

  // Helper function to check if a menu item is active based on the current path
  const isMenuItemActive = (itemHref: string) => {
    if (itemHref === '/dashboard') {
      // For dashboard, only be active on exact match
      return pathname === itemHref;
    }
    // For other items, be active if the pathname starts with the href
    return pathname.startsWith(itemHref);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-950">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 transform md:sticky md:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo and mobile close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center">
              <img 
                src="/assets/images/logo.png" 
                alt="BattleBetz Logo" 
                className="w-[180px]"
              />
            </Link>
            <button 
              className="p-1 rounded-full hover:bg-gray-800 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 overflow-y-auto">
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Main
              </div>
            </div>
            <ul className="space-y-1 px-2">
              {navigationItems.slice(0, 4).map((item) => {
                const isActive = isMenuItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-purple-700 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="px-3 py-2 mt-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Management
              </div>
            </div>
            <ul className="space-y-1 px-2">
              {navigationItems.slice(4).map((item) => {
                const isActive = isMenuItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-purple-700 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            <div className="px-3 py-2 mt-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Developer
              </div>
            </div>
            <ul className="space-y-1 px-2">
              {developerItems.map((item) => {
                const isActive = isMenuItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-purple-700 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-800 mt-auto">
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: '/login', redirect: true })}
            >
              <LogOut size={20} className="mr-2" />
              <span className="text-white">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 sticky top-0 z-30 w-full">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center">
              <button 
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>

              {/* Page title - determined by current route */}
              <div className="md:ml-4 font-semibold text-gray-900 dark:text-white">
                {[...navigationItems, ...developerItems].find(item => isMenuItemActive(item.href))?.label || 'BattleBetz Admin'}
              </div>
            </div>

            {/* Right side header controls */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                    <BellRing size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-80">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    <span className="text-xs text-muted-foreground">5 unread</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                      <div className="flex items-start gap-2">
                        <CalendarClock className="h-4 w-4 text-purple-500 mt-0.5" />
                        <div className="flex flex-col">
                          <span>{notification.message}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center cursor-pointer">
                    <span className="text-sm text-purple-600">View all notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-56 mt-1">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login', redirect: true })} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 w-full">
          {children}
        </main>
      </div>
    </div>
  );
} 