// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  LogOut, 
  User,
  Settings,
  UserCircle,
  Bell,
  HelpCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ title }: { title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const handleSignOut = () => {
    signOut({ 
      callbackUrl: '/login',
      redirect: true
    });
  };

  return (
    <header className="w-full bg-background border-b sticky top-0 z-10">
      <div className="px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          {pathname !== '/dashboard' && (
            <Link href="/dashboard" className="mr-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-md">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="text-xl font-semibold">Battlebetz Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications button with indicator */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden">
                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" alignOffset={0} forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || 'Admin User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
