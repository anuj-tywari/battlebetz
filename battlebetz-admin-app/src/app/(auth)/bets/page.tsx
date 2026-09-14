'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  FileDown, 
  DollarSign, 
  Clock,
  AlertCircle,
  Loader2,
  Check,
  X,
  User,
  Gamepad2,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface Bet {
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
  // Computed fields for display
  user_name?: string;
  tournament_name?: string;
}

export default function BetsPage() {
  const router = useRouter();
  const { supabase, isAuthenticated, authError } = useSupabase();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalBets, setTotalBets] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const itemsPerPage = 10;
  
  // Fetch bets
  const fetchBets = async (page: number, search: string = '', status: string = 'all') => {
    try {
      if (!isAuthenticated) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      // Calculate range for pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Build base queries for count and data
      let baseQuery = supabase
        .from('bets')
        .select(`
          *,
          users (id, username, email),
          tournaments (id, name)
        `);
      
      let countQuery = supabase
        .from('bets')
        .select('*', { count: 'exact', head: true });
      
      // Add search filter if provided
      if (search) {
        // Search across multiple fields
        const searchFilter = `users.username.ilike.%${search}%,users.id.ilike.%${search}%,tournaments.name.ilike.%${search}%,tournament_id.ilike.%${search}%`;
        baseQuery = baseQuery.or(searchFilter);
        countQuery = countQuery.or(searchFilter);
      }
      
      // Add status filter if provided
      if (status && status !== 'all') {
        baseQuery = baseQuery.eq('status', status);
        countQuery = countQuery.eq('status', status);
      }
      
      // Get total count and data separately
      const [countResponse, dataResponse] = await Promise.all([
        countQuery,
        baseQuery.order('created_at', { ascending: false }).range(from, to)
      ]);
      
      // Handle errors
      if (countResponse.error) {
        throw countResponse.error;
      }
      
      if (dataResponse.error) {
        throw dataResponse.error;
      }
      
      console.log('Bets data:', dataResponse.data);
      
      // Process data to include user and tournament names
      const processedBets = dataResponse.data?.map(bet => ({
        ...bet,
        user_name: bet.users?.username || 'Unknown User',
        tournament_name: bet.tournaments?.name || 'None'
      })) || [];
      
      // Update state
      setBets(processedBets);
      setTotalBets(countResponse.count || 0);
    } catch (err: any) {
      console.error('Error fetching bets:', err);
      setError(err.message || 'Failed to fetch bets');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Effect to fetch bets when filters change
  useEffect(() => {
    fetchBets(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, isAuthenticated]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle export
  const handleExport = async () => {
    try {
      if (!isAuthenticated) {
        setError('Authentication required to export data.');
        return;
      }
      
      setIsExporting(true);
      
      // Query all bets with filters
      let query = supabase.from('bets').select(`
        *,
        users (id, username, email),
        tournaments (id, name)
      `);
      
      if (searchTerm) {
        query = query.or(`users.username.ilike.%${searchTerm}%,users.id.ilike.%${searchTerm}%,tournaments.name.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert to CSV
        const processedBets = data.map(bet => ({
          id: bet.id,
          user: bet.users?.username || 'Unknown',
          user_id: bet.user_id,
          tournament: bet.tournaments?.name || 'None',
          tournament_id: bet.tournament_id,
          amount: bet.risk,
          odds: bet.odds,
          potential_payout: bet.potential_payout,
          prediction: bet.prediction,
          status: bet.status,
          created_at: format(new Date(bet.created_at), 'yyyy-MM-dd HH:mm:ss'),
          tournament_round: bet.tournament_round
        }));
        
        // Generate headers and rows
        const headers = Object.keys(processedBets[0] || {}).join(',');
        const rows = processedBets.map(bet => {
          return Object.values(bet).map(val => {
            return typeof val === 'string' ? `"${escapeCSV(val)}"` : val;
          }).join(',');
        });
        
        // Create CSV content
        const csvContent = `${headers}\n${rows.join('\n')}`;
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `bets_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Error exporting bets:', err);
      setError(err.message || 'Failed to export bets');
    } finally {
      setIsExporting(false);
    }
  };

  const escapeCSV = (field: any) => {
    if (field === null || field === undefined) {
      return '';
    }
    const str = String(field);
    if (str.includes('"') || str.includes(',')) {
      return str.replace(/"/g, '""');
    }
    return str;
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBets(currentPage, searchTerm, statusFilter);
  };
  
  // Get badge variant based on status
  const getOutcomeBadge = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
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
  
  // Navigate to bet details
  const handleBetClick = (betId: string) => {
    router.push(`/bets/${betId}`);
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Authentication error alert */}
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      {/* Page header */}
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
            <h1 className="text-3xl font-bold">Bet Management</h1>
          </div>
          <p className="text-muted-foreground">View and manage user bets</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing || loading}
            className="w-full sm:w-auto"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isExporting || loading}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4 sm:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full">
              <Input
                placeholder="Search by user, tournament..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-gray-600 dark:text-gray-400">Loading bets...</p>
            </div>
          ) : bets.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">No bets found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden -mx-2 sm:mx-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">User</TableHead>
                        <TableHead className="font-medium">Tournament</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="hidden md:table-cell font-medium">Odds</TableHead>
                        <TableHead className="hidden md:table-cell font-medium">Potential Payout</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="hidden md:table-cell font-medium">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bets.map((bet) => (
                        <TableRow 
                          key={bet.id}
                          onClick={() => handleBetClick(bet.id)}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate max-w-[120px] sm:max-w-full">{bet.user_name}</span>
                              </div>
                              <div className="md:hidden flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                {formatDate(bet.created_at).split(' ')[0]}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {bet.tournament_id ? (
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <Trophy className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="truncate max-w-[120px] sm:max-w-full">{bet.tournament_name}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Gamepad2 className="h-4 w-4 mr-2 text-gray-400" />
                                <span>Regular Game</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center font-medium">
                                <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                {formatAmount(bet.risk)}
                              </div>
                              <div className="md:hidden flex gap-x-1 text-xs text-muted-foreground mt-1">
                                <span className="whitespace-nowrap">Odds: <span className="font-medium">{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</span></span>
                              </div>
                              <div className="md:hidden flex gap-x-1 text-xs text-muted-foreground">
                                <span className="whitespace-nowrap">Payout: <span className="font-medium">{formatAmount(bet.potential_payout)}</span></span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatAmount(bet.potential_payout)}</TableCell>
                          <TableCell>
                            <Badge variant={getOutcomeBadge(bet.status)} className="whitespace-nowrap">
                              {bet.status === 'won' && <Check className="h-3 w-3 mr-1" />}
                              {bet.status === 'lost' && <X className="h-3 w-3 mr-1" />}
                              {bet.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(bet.created_at)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pagination */}
              {totalBets > itemsPerPage && (
                <div className="mt-4 flex justify-center sm:justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {/* Generate page numbers */}
                      {Array.from({ length: Math.min(3, Math.ceil(totalBets / itemsPerPage)) }, (_, i) => {
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
                      
                      {/* Show current page indicator for mobile */}
                      <PaginationItem>
                        <span className="px-2 text-sm">{currentPage} of {Math.ceil(totalBets / itemsPerPage)}</span>
                      </PaginationItem>
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(Math.ceil(totalBets / itemsPerPage), currentPage + 1))}
                          disabled={currentPage === Math.ceil(totalBets / itemsPerPage)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 