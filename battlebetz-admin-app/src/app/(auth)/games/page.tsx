'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/useGames';
import { useGamesData } from '@/hooks/useGamesData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, RefreshCw, AlertTriangle, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Game } from '@/types/game';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

export default function GamesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { isAuthenticated, hasCredentials } = useSupabase();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Get games using direct API with SDK fallback
  const { data: apiGames = [], isLoading: apiLoading, error: apiError, refetch: refetchGames } = useGames(debouncedQuery);
  
  // Get enhanced game data with odds from useGamesData hook
  const { games: enhancedGames, loading: enhancedLoading, error: enhancedError } = useGamesData({ 
    futureOnly: activeTab === 'upcoming' 
  });
  
  const isLoading = apiLoading || enhancedLoading;
  const error = apiError || enhancedError;
  
  // Combine both data sources, preferring enhanced data when available
  const allGames = enhancedGames.length > 0 ? enhancedGames : apiGames;
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce search query
    setTimeout(() => {
      setDebouncedQuery(e.target.value);
    }, 300);
  };
  
  // Format date and time for display
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Filter games based on tab
  const filteredGames = activeTab === 'all' ? allGames : allGames.filter((game: any) => {
    if (activeTab === 'upcoming') {
      return game.status === 'UPCOMING';
    } else if (activeTab === 'live') {
      return game.status === 'LIVE';
    } else if (activeTab === 'final') {
      return game.status === 'FINAL';
    }
    return true; // Default case
  });

  // Calculate paginated games
  const totalGames = filteredGames.length;
  const totalPages = Math.ceil(totalGames / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  // Handle refresh
  const handleRefresh = () => {
    refetchGames();
  };

  // Navigate to game details
  const viewGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };
  
  // Navigate to game edit page
  const editGame = (gameId: string) => {
    router.push(`/games/${gameId}/edit`);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800 dark:text-yellow-400 mb-4">
              You need to be authenticated to view games data. Please log in again if you're seeing this message.
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
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
            <h1 className="text-3xl font-bold">Games Management</h1>
          </div>
          <p className="text-muted-foreground">Manage and view all game events in the system</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search games..."
            className="w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto" 
            onClick={() => router.push('/games/new')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Game</span>
          </Button>
        </div>
      </div>
      
      {!hasCredentials && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Configuration Error</h3>
          </div>
          <p className="text-red-800 mb-3">Supabase credentials are missing. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.</p>
          
          <div className="bg-white bg-opacity-50 p-3 rounded text-sm font-mono text-red-800 mb-3">
            <p># Example .env.local</p>
            <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
          >
            Reload Page
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" onValueChange={(value) => {
            setActiveTab(value);
            setCurrentPage(1); // Reset to first page when changing tabs
          }}>
            <TabsList className="mb-2">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="final">Finished</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              <p>Error loading games: {error instanceof Error ? error.message : String(error)}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Home Team</TableHead>
                      <TableHead>Away Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          {Array(7).fill(0).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : paginatedGames.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No games found {searchQuery && <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedGames.map((game: any) => (
                        <TableRow 
                          key={game.event_id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                          onClick={() => viewGame(game.event_id)}
                        >
                          <TableCell className="font-mono text-xs">{game.event_id}</TableCell>
                          <TableCell>{game.sport || 'Unknown'}</TableCell>
                          <TableCell>{game.homeTeam || game.home_team || (game.teams?.team1?.name)}</TableCell>
                          <TableCell>{game.awayTeam || game.away_team || (game.teams?.team2?.name)}</TableCell>
                          <TableCell>
                            {getStatusBadge(game.status)}
                          </TableCell>
                          <TableCell>{formatDateTime(game.start_time || game.eventTime)}</TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal size={16} />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => viewGame(game.event_id)}>
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editGame(game.event_id)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalGames > itemsPerPage && (
                <div className="flex items-center justify-center py-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 ? handlePageChange(currentPage - 1) : null}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum} className="hidden sm:inline-block">
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem className="hidden sm:inline-block">
                        <span className="px-2">{currentPage} of {totalPages}</span>
                      </PaginationItem>
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages ? handlePageChange(currentPage + 1) : null}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedGames.length} of {totalGames} games
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 