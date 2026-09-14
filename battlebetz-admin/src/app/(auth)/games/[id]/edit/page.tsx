'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import GameEditForm from '@/components/games/GameEditForm';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

interface GameEditProps {
  params: {
    id: string;
  };
}

export default function GameEditPage({ params }: GameEditProps) {
  const { id } = params;
  const router = useRouter();
  const { supabase, isAuthenticated, authError } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch game details
  useEffect(() => {
    async function fetchGameDetails() {
      if (!isAuthenticated) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('event_id', id)
          .single();

        if (error) {
          throw error;
        }

        setGame(data);
      } catch (err: any) {
        console.error('Error fetching game details:', err);
        setError(err.message || 'Failed to fetch game details');
      } finally {
        setLoading(false);
      }
    }

    fetchGameDetails();
  }, [id, supabase, isAuthenticated]);

  // Handle save completion
  const handleSaveComplete = () => {
    router.push(`/games/${id}`);
  };

  // Show authentication error if not authenticated
  if (authError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Edit Game</CardTitle>
            <CardDescription>You need to be authenticated to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/games/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Game Details
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Game</h1>
          <p className="text-muted-foreground">Update game information</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="ml-2 text-gray-600 dark:text-gray-400">Loading game details...</p>
        </div>
      ) : game ? (
        <Card>
          <CardHeader>
            <CardTitle>Game Information</CardTitle>
            <CardDescription>Edit the details for this game</CardDescription>
          </CardHeader>
          <CardContent>
            <GameEditForm game={game} onSave={handleSaveComplete} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Game Not Found</CardTitle>
            <CardDescription>The requested game could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/games')}>
              Return to Games
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 