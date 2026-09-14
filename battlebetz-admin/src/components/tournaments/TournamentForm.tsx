import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tournament, DEFAULT_TOURNAMENT } from '@/types/tournament';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Validation schema
const tournamentSchema = z.object({
  name: z.string().min(2, { message: "Tournament name must be at least 2 characters" }).max(100, { message: "Tournament name must be at most 100 characters" }),
  description: z.string().optional().nullable(),
  rules: z.string().optional().nullable(),
  status: z.string().min(1, { message: "Status is required" }),
  prizePool: z.coerce.number().min(0, { message: "Prize pool must be a positive number" }),
  entryFee: z.coerce.number().min(0, { message: "Entry fee must be a positive number" }),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  maxParticipants: z.coerce.number().min(2, { message: "Tournament must have at least 2 participants" }).optional().nullable(),
  isPublic: z.boolean().default(true),
  type: z.string().min(1, { message: "Tournament type is required" }),
}).refine(data => {
  // Custom validation to ensure required dates and proper date order
  if (!data.startDate) {
    return false;
  }
  if (!data.endDate) {
    return false;
  }
  if (data.startDate > data.endDate) {
    return false;
  }
  return true;
}, {
  message: "Both dates are required and end date must be after start date",
  path: ["endDate"], // Show error message on the end date field
});

// Tournament types 
const tournamentTypes = [
  { value: 'NBA', label: 'NBA' },
  { value: 'NFL', label: 'NFL' },
  { value: 'MLB', label: 'MLB' },
  { value: 'NHL', label: 'NHL' },
  { value: 'MLS', label: 'MLS' },
  { value: 'OTHER', label: 'OTHER' },
];

// Tournament status options
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface TournamentFormProps {
  tournament?: Tournament;
  onSubmit: (data: z.infer<typeof tournamentSchema>) => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

export default function TournamentForm({ 
  tournament = DEFAULT_TOURNAMENT, 
  onSubmit, 
  isSubmitting = false,
  mode 
}: TournamentFormProps) {
  
  // Default values based on tournament data or defaults
  const defaultValues = {
    name: tournament.name || '',
    description: tournament.description || '',
    rules: tournament.rules || '',
    status: tournament.status || 'draft',
    prizePool: tournament.prizePool || 0,
    entryFee: tournament.entryFee || 0,
    startDate: tournament.startDate ? new Date(tournament.startDate) : null,
    endDate: tournament.endDate ? new Date(tournament.endDate) : null,
    maxParticipants: tournament.maxParticipants || null,
    isPublic: tournament.isPublic !== null ? tournament.isPublic : true,
    type: tournament.type || '',
  };

  // Initialize form with proper typing
  const form = useForm({
    resolver: zodResolver(tournamentSchema),
    defaultValues,
  });

  // Watch start date to validate end date
  const startDate = form.watch("startDate");

  // Handle form submission
  const handleSubmit = (data: any) => {
    // Additional validation to ensure end date is after start date
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date must be after start date"
      });
      return;
    }
    
    console.log('Form submitted with data:', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Tournament Details</h3>
              <p className="text-sm text-muted-foreground">Basic information about the tournament</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tournament name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Type <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tournament type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournamentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel>Public Tournament</FormLabel>
                      <FormDescription>
                        Make tournament visible to all users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prize Pool <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          placeholder="1000"
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          placeholder="10"
                          className="pl-7"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Max Participants <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        value={value === null ? '' : value}
                        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                        {...rest}
                      />
                    </FormControl>
                    <FormDescription>
                      Set to 0 for unlimited
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tournament description"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tournament rules"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Tournament' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 