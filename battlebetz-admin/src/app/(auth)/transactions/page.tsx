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
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { supabase, isAuthenticated, authError } = useSupabase();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const itemsPerPage = 10;
  
  // Fetch transactions
  const fetchTransactions = async (
    page: number,
    search: string = '',
    type: string = 'all',
    status: string = 'all',
    start: Date | null = null,
    end: Date | null = null
  ) => {
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
      const baseQuery = supabase
        .from('transactions')
        .select(`
          *,
          users (id, username, email)
        `);
      
      let countQuery = supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });
      
      // Add search filter if provided
      if (search) {
        const searchFilter = `users.username.ilike.%${search}%`;
        baseQuery.or(searchFilter);
        countQuery.or(searchFilter);
      }
      
      // Add type filter if provided
      if (type && type !== 'all') {
        baseQuery.eq('type', type);
        countQuery.eq('type', type);
      }
      
      // Add status filter if provided
      if (status && status !== 'all') {
        baseQuery.eq('status', status);
        countQuery.eq('status', status);
      }
      
      // Add date range filters if provided
      if (start) {
        const startDateStr = start.toISOString();
        baseQuery.gte('created_at', startDateStr);
        countQuery.gte('created_at', startDateStr);
      }
      
      if (end) {
        // Set to end of day
        const endWithTime = new Date(end);
        endWithTime.setHours(23, 59, 59, 999);
        const endDateStr = endWithTime.toISOString();
        baseQuery.lte('created_at', endDateStr);
        countQuery.lte('created_at', endDateStr);
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
      
      // Process data to include user names
      const processedTransactions = dataResponse.data?.map(transaction => ({
        ...transaction,
        user_name: transaction.users?.username || 'Unknown User'
      })) || [];
      
      // Update state
      setTransactions(processedTransactions);
      setTotalTransactions(countResponse.count || 0);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Effect to fetch transactions when filters change
  useEffect(() => {
    fetchTransactions(currentPage, searchTerm, typeFilter, statusFilter, startDate, endDate);
  }, [currentPage, searchTerm, typeFilter, statusFilter, startDate, endDate, isAuthenticated]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle date filter change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartDate(date);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
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
      
      // Query all transactions with filters
      let query = supabase.from('transactions').select(`
        *,
        users (id, username, email)
      `);
      
      if (searchTerm) {
        query = query.or(`users.username.ilike.%${searchTerm}%`);
      }
      
      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        const endWithTime = new Date(endDate);
        endWithTime.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endWithTime.toISOString());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Process data for CSV export
        const processedData = data.map(transaction => ({
          id: transaction.id,
          user: transaction.users?.username || 'Unknown',
          user_id: transaction.user_id,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          payment_method: transaction.payment_method || 'N/A',
          created_at: format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss'),
          updated_at: format(new Date(transaction.updated_at), 'yyyy-MM-dd HH:mm:ss')
        }));
        
        // Generate headers and rows
        const headers = Object.keys(processedData[0] || {}).join(',');
        const rows = processedData.map(transaction => {
          return Object.values(transaction).map(val => {
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
        a.setAttribute('download', `transactions_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Error exporting transactions:', err);
      setError(err.message || 'Failed to export transactions');
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
    fetchTransactions(currentPage, searchTerm, typeFilter, statusFilter, startDate, endDate);
  };
  
  // Get badge variant based on type
  const getTypeBadge = (type: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'withdrawal':
        return 'destructive';
      case 'bet':
        return 'secondary';
      case 'win':
        return 'success';
      case 'bonus':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  // Get badge variant based on status
  const getStatusBadge = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
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
  
  // Format amount with + or - symbol based on transaction type
  const formatAmount = (amount: number, type: string) => {
    const isNegative = ['withdrawal', 'bet'].includes(type);
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: isNegative ? 'always' : 'auto'
    }).format(isNegative ? -amount : amount);
    
    return formattedAmount;
  };

  // Show authentication error if not authenticated
  if (authError) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>You need to be authenticated to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage all financial transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || loading}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden">
          <CardHeader className="p-4 sm:p-6 bg-muted/50">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>All Transactions</CardTitle>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Select value={typeFilter} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="bet">Bets</SelectItem>
                      <SelectItem value="win">Wins</SelectItem>
                      <SelectItem value="bonus">Bonuses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={startDate ? startDate.toISOString().substring(0, 10) : ''}
                    onChange={handleStartDateChange}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={endDate ? endDate.toISOString().substring(0, 10) : ''}
                    onChange={handleEndDateChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          Loading transactions...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <DollarSign className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          No transactions found
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium text-xs">
                          {transaction.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[120px]">{transaction.user_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadge(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`font-mono ${transaction.type === 'withdrawal' ? 'text-destructive' : transaction.type === 'win' || transaction.type === 'bonus' ? 'text-green-500' : ''}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(transaction.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.payment_method || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalTransactions > itemsPerPage && (
              <div className="py-4 border-t">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: Math.ceil(totalTransactions / itemsPerPage) }).map((_, index) => {
                      const page = index + 1;
                      // Show current page, first page, last page, and pages around current
                      if (
                        page === currentPage ||
                        page === 1 ||
                        page === Math.ceil(totalTransactions / itemsPerPage) ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show dots if there's a gap
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === Math.ceil(totalTransactions / itemsPerPage) - 1 && currentPage < Math.ceil(totalTransactions / itemsPerPage) - 2)
                      ) {
                        return <PaginationItem key={page}>...</PaginationItem>;
                      }
                      
                      return null;
                    })}

                    {currentPage < Math.ceil(totalTransactions / itemsPerPage) && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 