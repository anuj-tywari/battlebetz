'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import UserDetailView from '../UserDetailView';
import UserEditForm from '../UserEditForm';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { toast } from '@/components/ui/use-toast';

export default function UserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const { supabase, isAuthenticated } = useSupabase();

  // Fetch user details
  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError("Authentication required to view user details");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      
      if (!data) throw new Error("User not found");
      
      setUser(data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserDetails();
    } else {
      setIsLoading(false);
      setError("Authentication required to view user details");
    }
  }, [params.id, isAuthenticated]);

  // Go back to users list
  const handleBack = () => {
    router.push('/users');
  };

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    router.push(`/users/${params.id}?mode=edit`);
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserDetails();
    setIsRefreshing(false);
  };

  // Handle update completion
  const handleUpdateComplete = () => {
    setIsEditing(false);
    router.push(`/users/${params.id}`);
    
    // Refetch data
    fetchUserDetails();
    
    toast({
      title: "User updated",
      description: "User information has been updated successfully.",
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    router.push(`/users/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading user details: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBack} variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>User not found</p>
          </div>
          <Button onClick={handleBack} variant="default">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Edit User</h1>
            </div>
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <UserEditForm user={user} onSave={handleUpdateComplete} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">{user.username || 'User Details'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleEdit}>
                Edit User
              </Button>
            </div>
          </div>
          
          <UserDetailView user={user} />
        </div>
      )}
    </div>
  );
} 