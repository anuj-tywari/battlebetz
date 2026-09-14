"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { User, Settings, Activity, LogOut, Menu, X, LayoutDashboard, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/components/providers/auth-provider";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, mobileMenuRef]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // Get display name and initial
  const displayName = user?.username || 
                      session?.user?.name || 
                      session?.user?.email?.split('@')[0] || 
                      'User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  if (!mounted) {
    return (
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-12 w-44 bg-gray-800 rounded animate-pulse"></div>
            <div className="flex items-center space-x-8">
              <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 w-28 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Updated navigation to match the image
  const navigation = [
    { name: 'About', href: '/about', requiresAuth: false },
    { name: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { name: 'Tournaments', href: isAuthenticated ? '/tournaments' : '/arena', requiresAuth: false },
    { name: 'Coming Soon', href: '/coming-soon', requiresAuth: false },
    { name: 'News', href: '/news', requiresAuth: false },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/assets/images/logo.png" 
              alt="BattleBetz" 
              width={180} 
              height={36}
              priority
              className="hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.requiresAuth && !isAuthenticated) return null;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-purple-400'
                      : 'text-white hover:text-purple-400'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu and Actions */}
          <div className="flex items-center space-x-4">
            {!isLoading && !isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="bg-transparent border border-purple-500 text-purple-500 px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-500 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {!isLoading && isAuthenticated && (
              <>
                <Link href="/notification" className="hidden md:flex text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-6 h-6" />
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full py-2 px-3 md:px-4 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                      {displayInitial}
                    </div>
                    <span className="text-white font-medium hidden md:block text-sm">{displayName}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-700 z-50">
                      <div className="py-1">
                        <Link 
                          href="/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link 
                          href={`/profile/${displayName}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <Link 
                          href="/settings" 
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                        <Link 
                          href="/activity" 
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Activity
                        </Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-purple-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 top-[61px] bg-black/95 z-50 flex flex-col"
            ref={mobileMenuRef}
          >
            <nav className="flex flex-col p-6 space-y-6">
              {navigation.map((item) => {
                if (item.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-purple-400'
                        : 'text-white hover:text-purple-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {!isAuthenticated && (
                <div className="pt-6 border-t border-gray-800 flex flex-col space-y-4">
                  <Link
                    href="/login"
                    className="bg-transparent border border-purple-500 text-purple-500 py-3 rounded-full text-center font-medium hover:bg-purple-500 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-purple-600 text-white py-3 rounded-full text-center font-medium hover:bg-purple-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 