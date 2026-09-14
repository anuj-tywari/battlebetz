import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/components/providers/supabase-auth-provider";
import { useRouter } from "next/navigation";

// Form schema for game editing
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
  status: z.string(),
  start_time: z.string().optional(),
  is_featured: z.boolean().optional(),
});

type GameFormValues = z.infer<typeof gameFormSchema>;

interface GameEditFormProps {
  game: any;
  onSave: () => void;
}

export default function GameEditForm({ game, onSave }: GameEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { supabase, isAuthenticated } = useSupabase();
  const router = useRouter();

  // Extract team names
  const homeTeam = game.homeTeam || game.home_team || (game.teams?.team1?.name) || '';
  const awayTeam = game.awayTeam || game.away_team || (game.teams?.team2?.name) || '';
  
  // Default form values
  const defaultValues: Partial<GameFormValues> = {
    sport: game.sport || "",
    home_team: homeTeam,
    away_team: awayTeam,
    status: game.status || "UPCOMING",
    start_time: game.start_time || game.eventTime || new Date().toISOString(),
    is_featured: game.featured || false,
  };

  // Create form
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (data: GameFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be authenticated to update game data.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update game in database
      const { error } = await supabase
        .from('games')
        .update({
          sport: data.sport,
          home_team: data.home_team,
          away_team: data.away_team,
          status: data.status,
          start_time: data.start_time,
          featured: data.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('event_id', game.event_id);
      
      if (error) throw error;
      
      toast({
        title: "Game updated",
        description: "The game information has been updated successfully.",
      });
      
      // Call the onSave callback
      onSave();
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: "Error updating game",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800 dark:text-yellow-400">
            You need to be authenticated to edit game data.
          </p>
          <Button 
            onClick={() => router.push('/login')} 
            variant="outline" 
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 mt-2"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="FINAL">Final</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="POSTPONED">Postponed</SelectItem>
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
                    <Input 
                      type="datetime-local" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} 
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/games/${game.event_id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
} 