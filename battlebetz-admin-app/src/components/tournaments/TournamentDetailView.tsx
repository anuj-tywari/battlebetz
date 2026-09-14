import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tournament } from '@/types/tournament';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  LucideIcon, 
  Tag,
  Clipboard,
  ArrowLeft,
  RefreshCw,
  Award,
  ClipboardList,
  Calendar,
  User,
  ChevronRight
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TournamentDetailProps {
  tournament: Tournament;
  detailedData?: any;
  onBack: () => void;
  onEdit: () => void;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

interface StatBoxProps {
  title: string;
  value: string | number | null;
  icon: LucideIcon;
  iconColor?: string;
  helpText?: string;
}

const StatBox = ({ title, value, icon: Icon, iconColor = 'text-primary', helpText }: StatBoxProps) => (
  <div className="flex items-start space-x-4 rounded-lg border p-4">
    <div className={`rounded-full p-2 ${iconColor} bg-primary/10`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value || '-'}</p>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  </div>
);

// Helper function to safely format dates
const safeFormat = (dateStr: string | null, formatStr: string = 'MMM d, yyyy'): string => {
  if (!dateStr) return 'Not set';
  try {
    const date = new Date(dateStr);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return 'Invalid date';
    }
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

export default function TournamentDetailView({ 
  tournament, 
  detailedData,
  onBack, 
  onEdit,
  onRefresh,
  isRefreshing = false
}: TournamentDetailProps) {
  // Get the status badge variant
  const getStatusBadge = (status: string | null): 'success' | 'secondary' | 'outline' | 'default' | 'destructive' => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get participants from detailed data
  const participants = detailedData?.participants || [];
  
  // Get prize distribution from detailed data
  const prizeDistribution = detailedData?.prize_distribution || [];
  
  // Get rounds from detailed data
  const rounds = detailedData?.rounds || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Tournament Details</h1>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button variant="default" size="sm" onClick={onEdit}>
            Edit Tournament
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{tournament.name}</CardTitle>
                  <CardDescription>
                    Created {safeFormat(tournament.createdAt)}
                    {tournament.updatedAt && ` • Updated ${safeFormat(tournament.updatedAt)}`}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadge(tournament.status)}>
                  {tournament.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="participants">
                    Participants {participants.length > 0 && `(${participants.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="rounds">
                    Rounds {rounds.length > 0 && `(${rounds.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatBox 
                      title="Prize Pool" 
                      value={tournament.prizePool ? `BBZ ${tournament.prizePool.toLocaleString()}` : '-'} 
                      icon={Trophy} 
                      iconColor="text-yellow-600"
                    />
                    <StatBox 
                      title="Entry Fee" 
                      value={tournament.entryFee ? `BBZ ${tournament.entryFee.toLocaleString()}` : 'Free Entry'} 
                      icon={DollarSign} 
                      iconColor="text-green-600"
                    />
                    <StatBox 
                      title="Start Date" 
                      value={tournament?.startDate || (tournament as any)?.start_date ? safeFormat(tournament?.startDate || (tournament as any)?.start_date) : 'Not set'} 
                      icon={CalendarIcon} 
                      iconColor="text-blue-600"
                    />
                    <StatBox 
                      title="End Date" 
                      value={tournament?.endDate || (tournament as any)?.end_date ? safeFormat(tournament?.endDate || (tournament as any)?.end_date) : 'Not set'} 
                      icon={Clock} 
                      iconColor="text-purple-600"
                    />
                    <StatBox 
                      title="Participants" 
                      value={`${participants.length || tournament.participantCount || 0}${tournament.maxParticipants ? ` / ${tournament.maxParticipants}` : ''}`}
                      icon={Users} 
                      iconColor="text-indigo-600"
                      helpText={tournament.maxParticipants ? `Limited to ${tournament.maxParticipants} participants` : 'Unlimited participants'}
                    />
                    <StatBox 
                      title="Tournament Type" 
                      value={tournament.type || 'General'} 
                      icon={Tag} 
                      iconColor="text-red-600"
                    />
                  </div>

                  {tournament.description && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <div className="whitespace-pre-line rounded-md bg-muted p-4 text-sm">
                        {tournament.description}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="participants" className="space-y-4">
                  {participants.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Rank</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {participants.map((participant: any) => (
                            <TableRow key={participant.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={participant.users?.avatar_url} alt={participant.users?.username} />
                                    <AvatarFallback>
                                      {participant.users?.username?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{participant.users?.username || 'Unknown User'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={participant.status === 'active' ? 'success' : 'secondary'}>
                                  {participant.status || 'pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>BBZ {participant.token_balance?.toLocaleString() || 0}</TableCell>
                              <TableCell>{participant.rank || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-8 text-center">
                      <Users className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No participants yet</h3>
                      <p className="text-muted-foreground">
                        Participants will appear here once they join the tournament.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rounds" className="space-y-4">
                  {rounds.length > 0 ? (
                    <div className="space-y-4">
                      {rounds.map((round: any) => (
                        <Card key={round.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                {round.round_name || `Round ${round.round_number}`}
                              </CardTitle>
                              <Badge variant={getStatusBadge(round.status)}>
                                {round.status}
                              </Badge>
                            </div>
                            <CardDescription>
                              {round.start_date ? safeFormat(round.start_date) : 'Start not set'}
                              {round.end_date ? ` - ${safeFormat(round.end_date)}` : ''}
                            </CardDescription>
                          </CardHeader>
                          {round.rules && (
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                {round.rules.max_total_bets && (
                                  <div>
                                    <span className="font-medium">Max Bets:</span> {round.rules.max_total_bets}
                                  </div>
                                )}
                                {round.rules.max_parlay_length && (
                                  <div>
                                    <span className="font-medium">Max Parlay:</span> {round.rules.max_parlay_length}
                                  </div>
                                )}
                                {round.rules.minimum_risk && (
                                  <div>
                                    <span className="font-medium">Min Risk:</span> BBZ {round.rules.minimum_risk}
                                  </div>
                                )}
                                {round.rules.survivor_metric && (
                                  <div>
                                    <span className="font-medium">Metric:</span> {round.rules.survivor_metric}
                                  </div>
                                )}
                                {round.rules.survivor_type && (
                                  <div>
                                    <span className="font-medium">Type:</span> {round.rules.survivor_type}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-8 text-center">
                      <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No rounds defined</h3>
                      <p className="text-muted-foreground">
                        Tournament rounds will appear here once they are created.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rules" className="space-y-4">
                  {tournament.rules ? (
                    <div className="whitespace-pre-line rounded-md bg-muted p-4 text-sm">
                      {tournament.rules}
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-8 text-center">
                      <Clipboard className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium">No rules defined</h3>
                      <p className="text-muted-foreground">
                        Tournament rules haven't been defined yet.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prize Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prize Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {prizeDistribution.length > 0 ? (
                <div className="space-y-2">
                  {prizeDistribution.map((prize: any) => (
                    <div key={prize.id || prize.position} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <span>
                          {prize.position === 1 ? '1st Place' : 
                           prize.position === 2 ? '2nd Place' : 
                           prize.position === 3 ? '3rd Place' : 
                           `${prize.position}th Place`}
                        </span>
                      </div>
                      <div className="font-medium">
                        {prize.amount ? `BBZ ${prize.amount.toLocaleString()}` : 
                          prize.percentage ? `${prize.percentage}%` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p>No prize distribution defined</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Total Participants</span>
                </div>
                <span className="font-medium">{participants.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Total Rounds</span>
                </div>
                <span className="font-medium">{rounds.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Prize Pool</span>
                </div>
                <span className="font-medium">BBZ {tournament.prizePool?.toLocaleString() || 0}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-between" onClick={onEdit}>
                Edit Tournament <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 