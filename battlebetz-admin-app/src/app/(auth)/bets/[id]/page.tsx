'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
  Loader2,
  MoreVertical,
  User,
  X,
  Trophy,
  Gamepad2
} from 'lucide-react';
import { format } from 'date-fns';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BetDetailsProps {
  params: {
    id: string;
  };
}

interface SubBet {
  id: string;
  bet_id: string;
  game_event_id: number;
  selection: string;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  created_at: string;
  updated_at: string;
  games?: {
    event_id: number;
    home_team: string | null;
    away_team: string | null;
    sport: string | null;
    start_time: string | null;
    status: string | null;
  };
}

interface DetailedBet {
  id: string;
  user_id: string;
  tournament_id: string | null;
  net_amount: number;
  odds: number;
  potential_payout: number;
  prediction: string | null;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  created_at: string;
  updated_at: string;
  risk: number;
  bet_type_id: number;
  tournament_round: string | null;
  game_event_id?: number;
  // Related data
  users?: {
    id: string;
    username: string;
    email: string;
  };
  tournaments?: {
    id: string;
    name: string;
  };
  games?: {
    event_id: number;
    home_team: string | null;
    away_team: string | null;
    sport: string | null;
    start_time: string | null;
    status: string | null;
  };
  // SubBets
  sub_bets?: SubBet[];
}

export default function BetDetailsPage({ params }: BetDetailsProps) {
  const { id } = params;
  const router = useRouter();
  const { supabase, isAuthenticated, authError } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [bet, setBet] = useState<DetailedBet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch bet details
  useEffect(() => {
    async function fetchBetDetails() {
      if (!isAuthenticated) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First try to fetch the bet with potential direct game relation
        const { data, error } = await supabase
          .from('bets')
          .select(`
            *,
            users (id, username, email),
            tournaments (id, name),
            games!bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
          `)
          .eq('id', id)
          .single();

        if (error) {
          // If there's an error with the direct game relation, retry without it
          const { data: basicData, error: basicError } = await supabase
            .from('bets')
            .select(`
              *,
              users (id, username, email),
              tournaments (id, name)
            `)
            .eq('id', id)
            .single();

          if (basicError) {
            throw basicError;
          }

          // If the bet exists, fetch additional sub-bet details if available
          if (basicData) {
            // Check if there are sub_bets (selections) for this bet
            const { data: subBetsData, error: subBetsError } = await supabase
              .from('sub_bets')
              .select(`
                *,
                games!sub_bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
              `)
              .eq('bet_id', id);

            if (subBetsError) {
              console.error('Error fetching sub-bets:', subBetsError);
            }

            // Add sub-bets to the bet data
            if (subBetsData && subBetsData.length > 0) {
              basicData.sub_bets = subBetsData;
            }
          }

          setBet(basicData);
        } else {
          // Bet was found with direct game relation
          // Still fetch sub-bets if available
          if (data) {
            const { data: subBetsData, error: subBetsError } = await supabase
              .from('sub_bets')
              .select(`
                *,
                games!sub_bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
              `)
              .eq('bet_id', id);

            if (subBetsError) {
              console.error('Error fetching sub-bets:', subBetsError);
            }

            // Add sub-bets to the bet data
            if (subBetsData && subBetsData.length > 0) {
              data.sub_bets = subBetsData;
            }
          }

          setBet(data);
        }
      } catch (err: any) {
        console.error('Error fetching bet details:', err);
        setError(err.message || 'Failed to fetch bet details');
      } finally {
        setLoading(false);
      }
    }

    fetchBetDetails();
  }, [id, supabase, isAuthenticated]);

  // Update bet status
  const updateBetStatus = async (status: 'pending' | 'won' | 'lost' | 'cancelled') => {
    if (!bet) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('bets')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh the bet data after update
      // First try to fetch the bet with potential direct game relation
      const { data, error: fetchError } = await supabase
        .from('bets')
        .select(`
          *,
          users (id, username, email),
          tournaments (id, name),
          games!bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        // If there's an error with the direct game relation, retry without it
        const { data: basicData, error: basicError } = await supabase
          .from('bets')
          .select(`
            *,
            users (id, username, email),
            tournaments (id, name)
          `)
          .eq('id', id)
          .single();

        if (basicError) {
          throw basicError;
        }

        // If the bet exists, fetch additional sub-bet details if available
        if (basicData) {
          // Check if there are sub_bets (selections) for this bet
          const { data: subBetsData, error: subBetsError } = await supabase
            .from('sub_bets')
            .select(`
              *,
              games!sub_bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
            `)
            .eq('bet_id', id);

          if (subBetsError) {
            console.error('Error fetching sub-bets:', subBetsError);
          }

          // Add sub-bets to the bet data
          if (subBetsData && subBetsData.length > 0) {
            basicData.sub_bets = subBetsData;
          }
        }

        setBet(basicData);
      } else {
        // Bet was found with direct game relation
        // Still fetch sub-bets if available
        if (data) {
          const { data: subBetsData, error: subBetsError } = await supabase
            .from('sub_bets')
            .select(`
              *,
              games!sub_bets_game_event_id_fkey (event_id, home_team, away_team, sport, start_time, status)
            `)
            .eq('bet_id', id);

          if (subBetsError) {
            console.error('Error fetching sub-bets:', subBetsError);
          }

          // Add sub-bets to the bet data
          if (subBetsData && subBetsData.length > 0) {
            data.sub_bets = subBetsData;
          }
        }

        setBet(data);
      }
    } catch (err: any) {
      console.error('Error updating bet status:', err);
      setError(err.message || 'Failed to update bet status');
    } finally {
      setUpdating(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  // Format monetary amount with dollar sign
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
    switch (status) {
      case 'won':
        return 'success';
      case 'lost':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      case 'pending':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Show authentication error if not authenticated
  if (authError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Bet Details</CardTitle>
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
          onClick={() => router.push('/bets')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bets
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bet Details</h1>
            <p className="text-muted-foreground">View and manage bet information</p>
          </div>
          {bet && !loading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => updateBetStatus('won')}
                  disabled={updating || bet.status === 'won'}
                >
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Mark as Won
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateBetStatus('lost')}
                  disabled={updating || bet.status === 'lost'}
                >
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  Mark as Lost
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateBetStatus('cancelled')}
                  disabled={updating || bet.status === 'cancelled'}
                >
                  <X className="h-4 w-4 mr-2" />
                  Mark as Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateBetStatus('pending')}
                  disabled={updating || bet.status === 'pending'}
                >
                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  Mark as Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="ml-2 text-gray-600 dark:text-gray-400">Loading bet details...</p>
        </div>
      ) : bet ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Bet Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bet Information</CardTitle>
              <CardDescription>Detailed information about this bet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bet ID</h3>
                    <p className="mt-1 font-mono text-sm">{bet.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge variant={getStatusBadge(bet.status)}>
                        {bet.status === 'won' && <Check className="h-3 w-3 mr-1" />}
                        {bet.status === 'lost' && <X className="h-3 w-3 mr-1" />}
                        {bet.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
                    <p className="mt-1">{formatDate(bet.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
                    <p className="mt-1">{formatDate(bet.updated_at)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User</h3>
                  <div className="mt-1 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{bet.users?.username || 'Unknown User'}</span>
                    <span className="ml-2 text-sm text-gray-500">({bet.user_id})</span>
                  </div>
                </div>

                {bet.tournament_id && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament</h3>
                    <div className="mt-1 flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{bet.tournaments?.name || 'Unknown Tournament'}</span>
                      <span className="ml-2 text-sm text-gray-500">({bet.tournament_id})</span>
                    </div>
                    {bet.tournament_round && (
                      <p className="mt-1 text-sm text-gray-500">Round: {bet.tournament_round}</p>
                    )}
                  </div>
                )}

                {/* Direct Game Section */}
                {bet.games && !bet.sub_bets && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Game</h3>
                    <div className="mt-1 flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">
                        {bet.games.home_team} vs {bet.games.away_team}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">({bet.games.event_id})</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {bet.games.sport} • {formatDate(bet.games.start_time)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Amount</h3>
                    <p className="mt-1 font-medium">{formatAmount(bet.risk)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Odds</h3>
                    <p className="mt-1 font-medium">{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Potential Payout</h3>
                    <p className="mt-1 font-medium">{formatAmount(bet.potential_payout)}</p>
                  </div>
                </div>

                {bet.prediction && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prediction</h3>
                    <p className="mt-1">{bet.prediction}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bet Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bet Status</CardTitle>
              <CardDescription>Current status and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</h3>
                  <div className="mt-2">
                    <Badge 
                      variant={getStatusBadge(bet.status)} 
                      className="text-base px-3 py-1"
                    >
                      {bet.status === 'won' && <Check className="h-4 w-4 mr-2" />}
                      {bet.status === 'lost' && <X className="h-4 w-4 mr-2" />}
                      {bet.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Update Status</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updateBetStatus('won')}
                      disabled={updating || bet.status === 'won'}
                      className="flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Won
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateBetStatus('lost')}
                      disabled={updating || bet.status === 'lost'}
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2 text-red-500" />
                      Lost
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateBetStatus('cancelled')}
                      disabled={updating || bet.status === 'cancelled'}
                      className="flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelled
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateBetStatus('pending')}
                      disabled={updating || bet.status === 'pending'}
                      className="flex items-center"
                    >
                      <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                      Pending
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Amount</h3>
                  <p className={`mt-2 text-lg font-bold ${bet.net_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(bet.net_amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-bets Section */}
          {bet && bet.sub_bets && bet.sub_bets.length > 0 && (
            <Card className="col-span-1 lg:col-span-3 mt-6">
              <CardHeader>
                <CardTitle>Bet Selections</CardTitle>
                <CardDescription>Individual selections that make up this bet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead>Selection</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bet.sub_bets.map((subBet: SubBet) => (
                        <TableRow key={subBet.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {subBet.games?.home_team} vs {subBet.games?.away_team}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {subBet.games?.sport} • {formatDate(subBet.games?.start_time)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{subBet.selection || "N/A"}</TableCell>
                          <TableCell>{subBet.odds > 0 ? `+${subBet.odds}` : subBet.odds}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(subBet.status || "pending")}>
                              {(subBet.status || "pending").charAt(0).toUpperCase() + (subBet.status || "pending").slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bet Not Found</CardTitle>
            <CardDescription>The requested bet could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/bets')}>
              Return to Bets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 