'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  BarChart2, 
  Trophy, 
  Settings, 
  FileText,
  Code, 
  Activity, 
  AlertCircle,
  DollarSign,
  Gamepad2,
  Ticket,
  Tag,
  UserPlus,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const mainMenuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      title: 'Users',
      href: '/users',
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Tournaments',
      href: '/tournaments',
      icon: <Trophy className="h-6 w-6" />,
    },
    {
      title: 'Games',
      href: '/games',
      icon: <Gamepad2 className="h-6 w-6" />,
    }
  ];

  const managementMenuItems = [
    {
      title: 'Bets',
      href: '/bets',
      icon: <Ticket className="h-6 w-6" />,
    },
    {
      title: 'Transactions',
      href: '/transactions',
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: 'Promocodes',
      href: '/promocodes',
      icon: <Tag className="h-6 w-6" />,
    },
    {
      title: 'Leads',
      href: '/leads',
      icon: <UserPlus className="h-6 w-6" />,
    },
    {
      title: 'Metrics',
      href: '/metrics',
      icon: <BarChart2 className="h-6 w-6" />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-6 w-6" />,
    }
  ];

  const developerMenuItems = [
    {
      title: 'Developer Tools',
      href: '/dev-tools',
      icon: <Code className="h-6 w-6" />,
    }
  ];

  const handleLogout = () => {
    // Handle logout functionality
    console.log('Logging out...');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="rounded-md bg-purple-600 p-1">
            <img src="/assets/images/logo.svg" alt="BattleBetz" className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-purple-400">BattleBetz</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-8">
          <div>
            <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-3">
              MAIN
            </h3>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center p-3 rounded-md ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="mr-3 text-purple-400">{item.icon}</div>
                  <div className="font-medium">{item.title}</div>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-3">
              MANAGEMENT
            </h3>
            <nav className="space-y-1">
              {managementMenuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center p-3 rounded-md ${
                    pathname === item.href || pathname.startsWith(item.href)
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="mr-3 text-purple-400">{item.icon}</div>
                  <div className="font-medium">{item.title}</div>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-3">
              DEVELOPER
            </h3>
            <nav className="space-y-1">
              {developerMenuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center p-3 rounded-md ${
                    pathname === item.href || pathname.startsWith(item.href)
                      ? 'bg-purple-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="mr-3 text-purple-400">{item.icon}</div>
                  <div className="font-medium">{item.title}</div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-auto px-3 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
