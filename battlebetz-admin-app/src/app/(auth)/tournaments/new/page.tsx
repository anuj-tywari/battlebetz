'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCreateTournament } from '@/hooks/useTournaments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_TOURNAMENT } from '@/types/tournament';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Tournament name must be at least 3 characters' }),
  description: z.string().optional(),
  rules: z.string().optional(),
  status: z.enum(['draft', 'upcoming', 'active'], { 
    required_error: 'Please select a status' 
  }),
  type: z.string().min(1, { message: 'Please select a tournament type' }),
  prizePool: z.coerce.number().min(0, { message: 'Prize pool must be a positive number' }),
  entryFee: z.coerce.number().min(0, { message: 'Entry fee must be a positive number' }),
  maxParticipants: z.coerce.number().min(2, { message: 'Tournament must allow at least 2 participants' }),
  isPublic: z.boolean(),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  roundCount: z.coerce.number().min(1, { message: 'Tournament must have at least 1 round' }),
  roundType: z.string(),
  payoutType: z.enum(['fixed', 'percentage']),
});

export default function NewTournamentPage() {
  const router = useRouter();
  const { createTournament, isCreating } = useCreateTournament();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      rules: '',
      status: 'draft',
      type: 'standard',
      prizePool: 1000,
      entryFee: 10,
      maxParticipants: 100,
      isPublic: true,
      roundCount: 1,
      roundType: 'elimination',
      payoutType: 'percentage',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Transform dates to ISO strings as expected by the API
    const tournamentData = {
      ...data,
      startDate: data.startDate?.toISOString() || null,
      endDate: data.endDate?.toISOString() || null,
    };

    createTournament(tournamentData, {
      onSuccess: (data) => {
        if (data?.id) {
          router.push(`/tournaments/${data.id}`);
        }
      }
    });
  }

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-2"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Tournament</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for your tournament
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tournament name" {...field} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NBA">NBA</SelectItem>
                          <SelectItem value="NFL">NFL</SelectItem>
                          <SelectItem value="MLB">MLB</SelectItem>
                          <SelectItem value="NHL">NHL</SelectItem>
                          <SelectItem value="MLS">MLS</SelectItem>
                          <SelectItem value="OTHER">OTHER</SelectItem>
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
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                      <FormLabel>End Date</FormLabel>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tournament Settings</CardTitle>
              <CardDescription>
                Configure the tournament settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="prizePool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize Pool</FormLabel>
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
                      <FormLabel>Entry Fee</FormLabel>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Set to 0 for unlimited
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roundCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Rounds</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roundType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a round type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="elimination">Elimination</SelectItem>
                          <SelectItem value="points">Points</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payoutType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Public Tournament</FormLabel>
                        <FormDescription>
                          Make this tournament visible to all users
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

              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter tournament rules and guidelines"
                        className="min-h-[150px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/tournaments')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Tournament'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
} 