'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTournaments, useDeleteTournament } from '@/hooks/useTournaments';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarIcon, MoreHorizontal, PlusIcon, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TournamentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);

  // Get tournaments with pagination
  const { tournaments, totalCount, isLoading, refetch } = useTournaments({
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
  });

  // Delete tournament hook
  const { deleteTournament, isDeleting } = useDeleteTournament();

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setTournamentToDelete(id);
  };

  // Handle actual deletion
  const handleDelete = () => {
    if (tournamentToDelete) {
      deleteTournament(tournamentToDelete);
      setTournamentToDelete(null);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Tournament status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
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
            <h1 className="text-3xl font-bold">Tournaments</h1>
          </div>
          <p className="text-muted-foreground">Manage your tournaments</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search tournaments..."
            className="w-full"
            value={search}
            onChange={handleSearch}
          />
          <Button 
            onClick={() => router.push('/tournaments/new')} 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <PlusIcon size={16} />
            <span>New Tournament</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('name')}
                  >
                    Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell" 
                    onClick={() => handleSort('start_date')}
                  >
                    Start Date {sortField === 'start_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('prize_pool')}
                  >
                    Prize Pool {sortField === 'prize_pool' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hidden md:table-cell"
                    onClick={() => handleSort('participant_count')}
                  >
                    Participants {sortField === 'participant_count' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tournaments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No tournaments found. {search && <Button variant="link" onClick={() => setSearch('')}>Clear search</Button>}
                    </TableCell>
                  </TableRow>
                ) : (
                  tournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium">
                        {tournament.name}
                        <div className="md:hidden flex flex-col mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{formatDate(tournament.startDate) || 'Not set'}</span>
                            <span>•</span>
                            <span>${tournament.prizePool || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tournament.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tournament.startDate ? formatDate(tournament.startDate) : 'Not set'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">${tournament.prizePool || 0}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tournament.participantCount || 0} / {tournament.maxParticipants || 'Unlimited'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/tournaments/${tournament.id}`)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/tournaments/${tournament.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => confirmDelete(tournament.id)}
                            >
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
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {tournaments.length} of {totalCount} tournaments
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!tournamentToDelete} onOpenChange={(open: boolean) => !open && setTournamentToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tournament</DialogTitle>
            <DialogDescription>
              This will permanently delete the tournament and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTournamentToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 