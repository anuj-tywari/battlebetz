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
  Mail, 
  Phone,
  AlertCircle,
  Loader2,
  ArrowLeft,
  UserPlus,
  Calendar,
  Info,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from "@/components/ui/use-toast";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  telephone: string;
  interested_in: string;
  created_at: string;
  updated_at: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const { supabase, isAuthenticated } = useSupabase();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<boolean>(false);
  
  const itemsPerPage = 10;
  
  // Fetch leads
  const fetchLeads = async (page: number, search: string = '') => {
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
        .from('leads')
        .select('*');
      
      let countQuery = supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      
      // Add search filter if provided
      if (search) {
        const searchFilter = `full_name.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%`;
        baseQuery.or(searchFilter);
        countQuery.or(searchFilter);
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
      
      // Update state
      setLeads(dataResponse.data || []);
      setTotalLeads(countResponse.count || 0);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Effect to fetch leads when filters change
  useEffect(() => {
    fetchLeads(currentPage, searchTerm);
  }, [currentPage, searchTerm, isAuthenticated]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeads(currentPage, searchTerm);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${text} has been copied to your clipboard.`,
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
      });
  };
  
  // View lead details
  const viewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsDialog(true);
  };
  
  // Get interest badge color
  const getInterestBadge = (interest: string) => {
    const interests: Record<string, string> = {
      'Sports Betting': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Tournaments': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Fantasy Sports': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Partnerships': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'General Inquiry': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };
    
    return interests[interest] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Manage and track potential customer leads</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>All Leads</CardTitle>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Interest</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          Loading leads...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <UserPlus className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          No leads found
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.full_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(lead.email)}
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy email</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{lead.telephone}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={getInterestBadge(lead.interested_in)}>
                            {lead.interested_in}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(lead.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewLeadDetails(lead)}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalLeads > itemsPerPage && (
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

                    {Array.from({ length: Math.ceil(totalLeads / itemsPerPage) }).map((_, index) => {
                      const page = index + 1;
                      // Show current page, first page, last page, and pages around current
                      if (
                        page === currentPage ||
                        page === 1 ||
                        page === Math.ceil(totalLeads / itemsPerPage) ||
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
                        (page === Math.ceil(totalLeads / itemsPerPage) - 1 && currentPage < Math.ceil(totalLeads / itemsPerPage) - 2)
                      ) {
                        return <PaginationItem key={page}>...</PaginationItem>;
                      }
                      
                      return null;
                    })}

                    {currentPage < Math.ceil(totalLeads / itemsPerPage) && (
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

      {/* Lead Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Detailed information about this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedLead && (
              <div className="space-y-4">
                <div className="grid gap-2 p-4 border rounded-md bg-muted">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Full Name:</span>
                    <span>{selectedLead.full_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Email:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-right">{selectedLead.email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedLead.email)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Phone:</span>
                    <div className="flex items-center gap-2">
                      <span>{selectedLead.telephone}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedLead.telephone)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Interest:</span>
                    <Badge className={getInterestBadge(selectedLead.interested_in)}>
                      {selectedLead.interested_in}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Submitted:</span>
                    <span>{formatDate(selectedLead.created_at)}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = `mailto:${selectedLead.email}?subject=RE: Your interest in Battlebetz`;
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Lead
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      window.location.href = `tel:${selectedLead.telephone}`;
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Lead
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 