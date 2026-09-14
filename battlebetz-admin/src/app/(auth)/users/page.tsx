'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Search, 
  MoreHorizontal, 
  Loader2, 
  AlertTriangle,
  RefreshCw,
  ArrowUpDown,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { testSupabaseConnection } from '@/lib/supabase';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { Skeleton } from '@/components/ui/skeleton';
import { addUser, deleteUser } from '@/services/userService';

const addUserSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['admin', 'internal', 'promoter', 'comp-owner', 'consumer', 'fantasy-manager'] as [UserRole, ...UserRole[]]),
});

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { supabase, isAuthenticated, hasCredentials, authError } = useSupabase();
  
  // State for user data
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Fetch users directly using Supabase
  const fetchUsers = async (params: { 
    page?: number; 
    pageSize?: number; 
    search?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    setLoading(true);
    setError(null);

    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setError("Authentication required to view users data");
      setLoading(false);
      return;
    }

    try {
      // Calculate range for pagination
      const from = ((params.page || page) - 1) * (params.pageSize || pageSize);
      const to = from + (params.pageSize || pageSize) - 1;
      
      // Basic query with authenticated supabase client
      let query = supabase.from('users').select('*', { count: 'exact' });
      
      // Add search if provided
      if (params.search || searchQuery) {
        const searchTerm = params.search || searchQuery;
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      // Add sorting
      if (params.sortField) {
        query = query.order(params.sortField, { ascending: params.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Add pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error: fetchError, count } = await query;
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Update state with results
      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers({ page, pageSize, search: searchQuery });
    } else {
      setLoading(false);
      setError("Authentication required to view users data");
    }
  }, [page, pageSize, searchQuery, isAuthenticated]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers({ page: newPage, pageSize, search: searchQuery });
  };
  
  // View user details
  const viewUser = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Check Supabase connection on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (!hasCredentials) {
        toast({
          title: "Missing Supabase Credentials",
          description: "Supabase credentials are not configured. Please check your environment variables.",
          variant: "destructive",
        });
        return;
      }
      
      if (!isAuthenticated) {
        return; // Don't check connection if not authenticated
      }
      
      const connected = await testSupabaseConnection();
      if (!connected) {
        toast({
          title: "Database Connection Error",
          description: "Failed to connect to Supabase. Using mock data for development.",
          variant: "destructive",
        });
      }
    };
    
    checkConnection();
  }, [hasCredentials, isAuthenticated]);

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      fetchUsers({ sortField: field, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortField(field);
      setSortOrder('asc');
      fetchUsers({ sortField: field, sortOrder: 'asc' });
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof addUserSchema>) => {
      // First register the user with auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) throw authError;
      
      // Then add user profile data using the userService
      return await addUser({
        id: authData.user?.id,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'consumer',
        status: 'active',
      });
    },
    onSuccess: () => {
      toast({
        title: "User added",
        description: "The user has been added successfully.",
      });
      setShowAddDialog(false);
      // Refetch users to update the list
      fetchUsers({ page: 1 });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await deleteUser(userId);
    },
    onSuccess: () => {
      toast({
        title: "User deactivated",
        description: "The user has been deactivated successfully.",
        variant: "destructive",
      });
      setUserToDelete(null);
      // Refetch users to update the list
      fetchUsers({ page: 1 });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deactivate user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add user form
  const addUserForm = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "consumer" as UserRole,
    },
  });

  // Handle add user form submission
  const handleAddUser = (values: z.infer<typeof addUserSchema>) => {
    addUserMutation.mutate(values);
  };

  // Handle delete user action
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete);
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">{role}</Badge>;
      case 'internal':
        return <Badge variant="secondary">{role}</Badge>;
      case 'promoter':
        return <Badge variant="default">{role}</Badge>;
      case 'comp-owner':
        return <Badge variant="outline">{role}</Badge>;
      default:
        return <Badge variant="outline">{role || 'consumer'}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>;
    }
  };

  if (error && !loading && !isAuthenticated) {
    return (
      <div className="p-4 md:p-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400 mb-4">
              You need to be authenticated to view users data.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            </div>
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
            <h1 className="text-3xl font-bold">Users Management</h1>
          </div>
          <p className="text-muted-foreground">Manage your users</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            className="w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('username')}>
                    Username {sortField === 'username' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                    Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort('created_at')}>
                    Created {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found. {searchQuery && <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.username || 'N/A'}</span>
                          <div className="md:hidden flex flex-col mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{getStatusBadge(user.is_active)}</span>
                              <span>•</span>
                              <span>{user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="hidden md:table-cell">{getStatusBadge(user.is_active)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.created_at ? 
                          format(new Date(user.created_at), 'MMM d, yyyy') : 
                          'N/A'}
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
                            <DropdownMenuItem onClick={() => viewUser(user.id)}>
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => setUserToDelete(user.id)}
                            >
                              Deactivate
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
            Showing {users.length} of {totalCount} users
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={addUserForm.control}
                name="username"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="role"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "consumer"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="promoter">Promoter</SelectItem>
                        <SelectItem value="comp-owner">Competition Owner</SelectItem>
                        <SelectItem value="consumer">Consumer</SelectItem>
                        <SelectItem value="fantasy-manager">Fantasy Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit"
                  disabled={addUserMutation.isPending}
                >
                  {addUserMutation.isPending ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Deactivate User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this user? The user will no longer be able to access the system, but their data will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Deactivating..." : "Deactivate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 