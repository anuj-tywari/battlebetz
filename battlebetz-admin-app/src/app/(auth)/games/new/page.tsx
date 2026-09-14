'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

// Form schema for new game
const gameFormSchema = z.object({
  sport: z.string().min(1, {
    message: "Sport is required",
  }),
  home_team: z.string().min(1, {
    message: "Home team is required",
  }),
  away_team: z.string().min(1, {
    message: "Away team is required",
  }),
  status: z.string().default("UPCOMING"),
  start_time: z.string(),
  is_featured: z.boolean().default(false),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

export default function NewGamePage() {
  const router = useRouter();
  const { supabase, isAuthenticated, authError } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default form values
  const defaultValues: Partial<GameFormValues> = {
    status: "UPCOMING",
    start_time: new Date().toISOString().substring(0, 16),
    is_featured: false,
  };

  // Create form
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (data: GameFormValues) => {
    if (!isAuthenticated) {
      setError('Authentication required. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create new game in database
      const { data: newGame, error } = await supabase
        .from('games')
        .insert({
          sport: data.sport,
          home_team: data.home_team,
          away_team: data.away_team,
          status: data.status,
          start_time: data.start_time,
          featured: data.is_featured,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Navigate to the game details page
      router.push(`/games/${newGame.event_id}`);
    } catch (err: any) {
      console.error('Error creating game:', err);
      setError(err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
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
            <CardTitle>Create New Game</CardTitle>
            <CardDescription>You need to be authenticated to access this page.</CardDescription>
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
          onClick={() => router.push('/games')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Game</h1>
          <p className="text-muted-foreground">Add a new game to the system</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
          <CardDescription>Enter the details for the new game</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <FormControl>
                        <Input placeholder="Sport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="home_team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team</FormLabel>
                      <FormControl>
                        <Input placeholder="Home team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="away_team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team</FormLabel>
                      <FormControl>
                        <Input placeholder="Away team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UPCOMING">Upcoming</SelectItem>
                          <SelectItem value="LIVE">Live</SelectItem>
                          <SelectItem value="FINAL">Final</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormDescription>
                        When the game is scheduled to start
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/games')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Game
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 