'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-purple-600 dark:text-purple-500">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Page not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 