// components/games/GameDetailView.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
import { CalendarDays, DollarSign, Users, Gamepad2 } from "lucide-react";
import { Game } from "@/types/game";
import { useBets } from "@/hooks/useBets";
import { useSupabase } from "@/components/providers/supabase-auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Trophy, 
  Zap, 
  AlertTriangle, 
  Hash,
  Flag
} from "lucide-react";

interface GameDetailViewProps {
  game: Game;
}

export default function GameDetailView({ game }: GameDetailViewProps) {
  const { supabase, isAuthenticated } = useSupabase();
  const router = useRouter();
  
  // Get bets for this game
  const { data: gameBets = [], isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['gameBets', game.event_id],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to view game bets");
      }
      
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('game_id', game.event_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!game.event_id && isAuthenticated,
  });

  // Calculate bet stats
  const totalBets = gameBets?.length || 0;
  const totalAmount = gameBets?.reduce((sum, bet) => sum + bet.amount, 0) || 0;
  const wonBets = gameBets?.filter(bet => bet.outcome === 'win').length || 0;
  const lostBets = gameBets?.filter(bet => bet.outcome === 'loss').length || 0;
  const pendingBets = gameBets?.filter(bet => bet.outcome === 'pending').length || 0;
  
  // Generate data for charts
  const lastWeekData = generateChartData(gameBets, 7);
  const betOutcomeData = [
    { name: 'Won', value: wonBets },
    { name: 'Lost', value: lostBets },
    { name: 'Pending', value: pendingBets },
  ];

  // Format date & time
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <Badge variant="destructive">Live</Badge>;
      case 'FINAL':
        return <Badge variant="outline">Final</Badge>;
      case 'UPCOMING':
        return <Badge variant="default">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  // Extract team names
  const homeTeam = game.homeTeam || game.home_team || (game.teams?.team1?.name) || 'Home Team';
  const awayTeam = game.awayTeam || game.away_team || (game.teams?.team2?.name) || 'Away Team';
  
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
          <p className="text-yellow-800 dark:text-yellow-400 mb-4">
            You need to be authenticated to view game details.
          </p>
          <Button 
            onClick={() => router.push('/login')} 
            variant="outline" 
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Game Overview Card */}
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Game Overview</CardTitle>
            <CardDescription>Detailed information about this game</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              {/* Teams */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-muted p-4 rounded-lg">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <p className="text-sm text-muted-foreground">Home Team</p>
                  <h3 className="text-xl font-bold">{homeTeam}</h3>
                  {game.teams?.team1?.score !== undefined && (
                    <p className="text-2xl font-bold">{game.teams.team1.score}</p>
                  )}
                </div>
                
                <div className="text-center sm:text-right">
                  <p className="text-sm text-muted-foreground">Away Team</p>
                  <h3 className="text-xl font-bold">{awayTeam}</h3>
                  {game.teams?.team2?.score !== undefined && (
                    <p className="text-2xl font-bold">{game.teams.team2.score}</p>
                  )}
                </div>
              </div>
              
              {/* Game Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Time</p>
                    <p className="text-sm">{formatDateTime(game.start_time || game.eventTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sport</p>
                    <p className="text-sm">{game.sport || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <div>{getStatusBadge(game.status)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Event ID</p>
                    <p className="text-sm font-mono">{game.event_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Odds Card */}
        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle>Betting Odds</CardTitle>
            <CardDescription>Current odds and lines for this game</CardDescription>
          </CardHeader>
          <CardContent>
            {game.team1Odds && game.team2Odds ? (
              <div className="space-y-4">
                {/* Moneyline */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Moneyline</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">{homeTeam}</p>
                      <p className="text-lg font-bold">{game.team1Odds.moneyline}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">{awayTeam}</p>
                      <p className="text-lg font-bold">{game.team2Odds.moneyline}</p>
                    </div>
                  </div>
                </div>
                
                {/* Spread */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Spread</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">{homeTeam}</p>
                      <div className="flex justify-between">
                        <p className="text-lg font-bold">{game.team1Odds.spread}</p>
                        <p className="text-sm">{game.team1Odds.spreadOdds}</p>
                      </div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">{awayTeam}</p>
                      <div className="flex justify-between">
                        <p className="text-lg font-bold">{game.team2Odds.spread}</p>
                        <p className="text-sm">{game.team2Odds.spreadOdds}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Total</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">Over</p>
                      <div className="flex justify-between">
                        <p className="text-lg font-bold">{game.team1Odds.total}</p>
                        <p className="text-sm">{game.team1Odds.totalOdds}</p>
                      </div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">Under</p>
                      <div className="flex justify-between">
                        <p className="text-lg font-bold">{game.team2Odds.total}</p>
                        <p className="text-sm">{game.team2Odds.totalOdds}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No odds available for this game
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Game Activity Tabs */}
      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="bets">Betting History</TabsTrigger>
          <TabsTrigger value="stats">Game Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bets">
          <Card>
            <CardHeader>
              <CardTitle>Betting History</CardTitle>
              <CardDescription>Recent bets placed on this game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">  {/* Allow horizontal scroll on mobile */}
                {betsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full">
                        <Skeleton className="h-10 w-full mb-2" />
                      </div>
                    ))}
                  </div>
                ) : betsError ? (
                  <div className="py-4 text-center text-sm text-red-500">
                    Error loading bet history. Please try again.
                  </div>
                ) : gameBets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Bet Type</TableHead>
                        <TableHead>Selection</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameBets.map((bet: any) => (
                        <TableRow key={bet.id}>
                          <TableCell>{bet.user_id}</TableCell>
                          <TableCell>{bet.bet_type || 'Standard'}</TableCell>
                          <TableCell>{bet.selection || bet.prediction || '-'}</TableCell>
                          <TableCell>${bet.amount || bet.risk || 0}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                bet.status === 'won' ? 'default' : 
                                  bet.status === 'lost' ? 'destructive' : 
                                    'outline'
                              }
                            >
                              {bet.status || 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(bet.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No bets have been placed on this game yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Game Stats</CardTitle>
              <CardDescription>Detailed statistics for this game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-muted-foreground">
                Game statistics will be available once the game starts.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Game Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Betting Activity</CardTitle>
            <CardDescription>Recent betting trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lastWeekData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return date.toLocaleDateString('en-US', { weekday: 'short' });
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return `Date: ${date.toLocaleDateString('en-US')}`;
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to generate chart data from bets
function generateChartData(bets, days = 7) {
  if (!bets) return [];
  
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayBets = bets.filter(bet => {
      const betDate = new Date(bet.created_at);
      return betDate >= date && betDate < nextDate;
    });
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayBets.length,
      amount: dayBets.reduce((sum, bet) => sum + bet.amount, 0),
    });
  }
  
  return data;
}

