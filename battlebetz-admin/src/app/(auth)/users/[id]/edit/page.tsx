'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function UserEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Redirect to the main user page with edit mode
  useEffect(() => {
    router.replace(`/users/${params.id}?mode=edit`);
  }, [params.id, router]);

  return (
    <div className="container mx-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-muted-foreground">Redirecting to edit mode...</p>
    </div>
  );
} 