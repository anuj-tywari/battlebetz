// components/games/GameForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCreateGame, useUpdateGame } from "@/hooks/useGames";
import { Game } from "@/types/game";

const formSchema = z.object({
  home_team: z.string().min(1, {
    message: "Home team is required",
  }),
  away_team: z.string().min(1, {
    message: "Away team is required",
  }),
  description: z.string().optional(),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  status: z.enum(["active", "inactive", "maintenance"]),
  game_type: z.string().min(1, {
    message: "Game type is required",
  }),
  min_bet: z.coerce.number().min(0.01, {
    message: "Minimum bet must be at least 0.01",
  }),
  max_bet: z.coerce.number().min(0.01, {
    message: "Maximum bet must be at least 0.01",
  }),
});

interface GameFormProps {
  game?: Game;
  onSuccess?: () => void;
}

export default function GameForm({ game, onSuccess }: GameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      home_team: game?.home_team || "",
      away_team: game?.away_team || "",
      description: game?.description || "",
      image_url: game?.image_url || "",
      status: (game?.status as "active" | "inactive" | "maintenance") || "active",
      game_type: game?.game_type || "",
      min_bet: game?.min_bet || 1,
      max_bet: game?.max_bet || 100,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      if (game) {
        // Update existing game
        await updateGame.mutateAsync({
          gameId: game.event_id,
          gameData: {
            home_team: values.home_team,
            away_team: values.away_team,
            description: values.description,
            image_url: values.image_url,
            status: values.status,
            game_type: values.game_type,
            min_bet: values.min_bet,
            max_bet: values.max_bet
          }
        });
        toast({
          title: "Game updated",
          description: "Game has been updated successfully.",
        });
      } else {
        // Create new game
        await createGame.mutateAsync({
          home_team: values.home_team,
          away_team: values.away_team,
          description: values.description,
          image_url: values.image_url,
          status: values.status,
          game_type: values.game_type,
          min_bet: values.min_bet,
          max_bet: values.max_bet
        });
        toast({
          title: "Game created",
          description: "New game has been created successfully.",
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: game 
          ? "Failed to update game. Please try again." 
          : "Failed to create game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Game description" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>URL to the game's cover image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="game_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Type</FormLabel>
                <FormControl>
                  <Input placeholder="Slots, Poker, etc." {...field} />
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="min_bet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Bet ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0.01" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_bet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Bet ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0.01" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (game ? "Updating..." : "Creating...") 
              : (game ? "Update Game" : "Create Game")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
