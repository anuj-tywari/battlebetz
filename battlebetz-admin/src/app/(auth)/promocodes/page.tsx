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
  Tag, 
  Plus,
  AlertCircle,
  Loader2,
  PencilIcon,
  Trash2,
  ArrowLeft,
  User,
  CalendarIcon,
  Trophy
} from 'lucide-react';
import { format } from 'date-fns';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface PromoCode {
  id: number;
  user_id: string | null;
  promo_code: string | null;
  tournament_id: string | null;
  updated_at: string | null;
  created_at: string;
  username: string | null;
  referral_count: number | null;
  avatar_url: string | null;
  user?: {
    username: string;
    email: string;
  };
}

export default function PromoCodesPage() {
  const router = useRouter();
  const { supabase, isAuthenticated } = useSupabase();
  
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPromoCodes, setTotalPromoCodes] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  
  // Form state
  const [formPromoCode, setFormPromoCode] = useState<string>('');
  const [formUsername, setFormUsername] = useState<string>('');
  const [formUserId, setFormUserId] = useState<string>('');
  const [formTournamentId, setFormTournamentId] = useState<string>('');
  
  const itemsPerPage = 10;
  
  // Fetch promo codes
  const fetchPromoCodes = async (page: number, search: string = '') => {
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
        .from('promo_codes')
        .select(`
          *,
          user:user_id (username, email)
        `);
      
      let countQuery = supabase
        .from('promo_codes')
        .select('*', { count: 'exact', head: true });
      
      // Add search filter if provided
      if (search) {
        const searchFilter = `promo_code.ilike.%${search}%,username.ilike.%${search}%`;
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
      setPromoCodes(dataResponse.data || []);
      setTotalPromoCodes(countResponse.count || 0);
    } catch (err: any) {
      console.error('Error fetching promo codes:', err);
      setError(err.message || 'Failed to fetch promo codes');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Effect to fetch promo codes when filters change
  useEffect(() => {
    fetchPromoCodes(currentPage, searchTerm);
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
    fetchPromoCodes(currentPage, searchTerm);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Handle add promo code
  const handleAddPromoCode = async () => {
    try {
      setLoading(true);
      
      if (!formPromoCode) {
        setError('Promo code is required');
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('promo_codes')
        .insert({
          promo_code: formPromoCode,
          username: formUsername || null,
          user_id: formUserId || null,
          tournament_id: formTournamentId || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          referral_count: 0
        })
        .select();
      
      if (error) throw error;
      
      setShowAddDialog(false);
      resetForm();
      await fetchPromoCodes(currentPage, searchTerm);
      
    } catch (err: any) {
      console.error('Error adding promo code:', err);
      setError(err.message || 'Failed to add promo code');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit promo code
  const handleEditPromoCode = async () => {
    try {
      if (!selectedPromoCode?.id) return;
      
      setLoading(true);
      
      if (!formPromoCode) {
        setError('Promo code is required');
        setLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from('promo_codes')
        .update({
          promo_code: formPromoCode,
          username: formUsername || null,
          user_id: formUserId || null,
          tournament_id: formTournamentId || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPromoCode.id);
      
      if (error) throw error;
      
      setShowEditDialog(false);
      resetForm();
      await fetchPromoCodes(currentPage, searchTerm);
      
    } catch (err: any) {
      console.error('Error updating promo code:', err);
      setError(err.message || 'Failed to update promo code');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete promo code
  const handleDeletePromoCode = async () => {
    try {
      if (!selectedPromoCode?.id) return;
      
      setLoading(true);
      
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', selectedPromoCode.id);
      
      if (error) throw error;
      
      setDeleteDialogOpen(false);
      await fetchPromoCodes(currentPage, searchTerm);
      
    } catch (err: any) {
      console.error('Error deleting promo code:', err);
      setError(err.message || 'Failed to delete promo code');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormPromoCode('');
    setFormUsername('');
    setFormUserId('');
    setFormTournamentId('');
    setSelectedPromoCode(null);
  };
  
  // Handle edit button click
  const handleEditClick = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setFormPromoCode(promoCode.promo_code || '');
    setFormUsername(promoCode.username || '');
    setFormUserId(promoCode.user_id || '');
    setFormTournamentId(promoCode.tournament_id || '');
    setShowEditDialog(true);
  };
  
  // Handle delete button click
  const handleDeleteClick = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setDeleteDialogOpen(true);
  };
  
  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground">Manage promotional codes and track their usage</p>
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
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Promo Code
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
              <CardTitle>All Promo Codes</CardTitle>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search promo codes..."
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
                    <TableHead>ID</TableHead>
                    <TableHead>Promo Code</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Tournament ID</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          Loading promo codes...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : promoCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <Tag className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground block">
                          No promo codes found
                        </span>
                        <Button
                          variant="link"
                          onClick={() => {
                            resetForm();
                            setShowAddDialog(true);
                          }}
                          className="mt-2"
                        >
                          Add a promo code
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    promoCodes.map((promoCode) => (
                      <TableRow key={promoCode.id}>
                        <TableCell className="font-medium">{promoCode.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {promoCode.promo_code || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={promoCode.avatar_url || ''} />
                              <AvatarFallback>
                                {(promoCode.user?.username || promoCode.username || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[120px]">
                              {promoCode.user?.username || promoCode.username || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {promoCode.tournament_id || 'N/A'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(promoCode.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(promoCode)}
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(promoCode)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPromoCodes > itemsPerPage && (
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

                    {Array.from({ length: Math.ceil(totalPromoCodes / itemsPerPage) }).map((_, index) => {
                      const page = index + 1;
                      // Show current page, first page, last page, and pages around current
                      if (
                        page === currentPage ||
                        page === 1 ||
                        page === Math.ceil(totalPromoCodes / itemsPerPage) ||
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
                        (page === Math.ceil(totalPromoCodes / itemsPerPage) - 1 && currentPage < Math.ceil(totalPromoCodes / itemsPerPage) - 2)
                      ) {
                        return <PaginationItem key={page}>...</PaginationItem>;
                      }
                      
                      return null;
                    })}

                    {currentPage < Math.ceil(totalPromoCodes / itemsPerPage) && (
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

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Promo Code</DialogTitle>
            <DialogDescription>
              Create a new promotional code for users or tournaments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="promo-code" className="text-sm font-medium">
                Promo Code
              </label>
              <Input
                id="promo-code"
                placeholder="Enter promo code"
                value={formPromoCode}
                onChange={(e) => setFormPromoCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                placeholder="(Optional) User's username"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="user-id" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="user-id"
                placeholder="(Optional) User ID"
                value={formUserId}
                onChange={(e) => setFormUserId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tournament-id" className="text-sm font-medium">
                Tournament ID
              </label>
              <Input
                id="tournament-id"
                placeholder="(Optional) Tournament ID"
                value={formTournamentId}
                onChange={(e) => setFormTournamentId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPromoCode} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update the details for this promotional code.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-promo-code" className="text-sm font-medium">
                Promo Code
              </label>
              <Input
                id="edit-promo-code"
                placeholder="Enter promo code"
                value={formPromoCode}
                onChange={(e) => setFormPromoCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="edit-username"
                placeholder="(Optional) User's username"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-user-id" className="text-sm font-medium">
                User ID
              </label>
              <Input
                id="edit-user-id"
                placeholder="(Optional) User ID"
                value={formUserId}
                onChange={(e) => setFormUserId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-tournament-id" className="text-sm font-medium">
                Tournament ID
              </label>
              <Input
                id="edit-tournament-id"
                placeholder="(Optional) Tournament ID"
                value={formTournamentId}
                onChange={(e) => setFormTournamentId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPromoCode} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promo code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPromoCode && (
              <div className="p-4 border rounded-md bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-semibold">Code:</span>
                  <Badge variant="secondary" className="font-mono">
                    {selectedPromoCode.promo_code || 'N/A'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">User:</span>
                  <span>
                    {selectedPromoCode.user?.username || selectedPromoCode.username || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePromoCode}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 