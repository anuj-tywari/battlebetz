// components/users/UserDetailView.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, CreditCard, DollarSign, Gamepad2, Settings, Mail, Phone, MapPin, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase-auth-provider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailViewProps {
  user: any;
}

export default function UserDetailView({ user }: UserDetailViewProps) {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const { supabase, isAuthenticated } = useSupabase();
  const router = useRouter();

  const { data: userBets = [], isLoading: betsLoading, error: betsError } = useQuery({
    queryKey: ['userBets', user.id],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to fetch bets");
      }
      
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user.id && isAuthenticated,
  });

  const { data: userTransactions = [], isLoading: transactionsLoading, error: transactionsError } = useQuery({
    queryKey: ['userTransactions', user.id],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to fetch transactions");
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user.id && isAuthenticated,
  });

  // Combine bets and transactions into activity feed
  useEffect(() => {
    if (!betsLoading && !transactionsLoading) {
      try {
        // Transform bets to activity items
        const betActivities = userBets.map(bet => ({
          id: `bet-${bet.id}`,
          description: `Placed a bet on ${bet.prediction || bet.game_id || 'a game'}`,
          date: bet.created_at,
          type: 'bet'
        }));
        
        // Transform transactions to activity items
        const transactionActivities = userTransactions.map(transaction => ({
          id: `transaction-${transaction.id}`,
          description: `${transaction.type === 'deposit' ? 'Deposited' : 'Withdrew'} $${transaction.amount}`,
          date: transaction.created_at,
          type: 'transaction'
        }));
        
        // Combine and sort activities
        const combinedActivities = [...betActivities, ...transactionActivities]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        
        setRecentActivity(combinedActivities);
      } catch (error) {
        console.error("Error processing activity data:", error);
      } finally {
        setIsActivityLoading(false);
      }
    }
  }, [userBets, userTransactions, betsLoading, transactionsLoading]);

  const isDataLoading = betsLoading || transactionsLoading || isActivityLoading;
  const hasError = betsError || transactionsError;

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
            You need to be authenticated to view user details.
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
      <div className="flex items-start space-x-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
          <AvatarFallback className="text-2xl">{user.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="mr-1 h-4 w-4" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="mr-1 h-4 w-4" />
              {user.phone}
            </div>
          )}
          {user.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              {user.location}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="mr-1 h-4 w-4" />
            Member since {new Date(user.created_at || user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.balance?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Gamepad2 className="mr-1 h-4 w-4 text-gray-500" />
              Total Bets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalBets || userBets.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="mr-1 h-4 w-4 text-gray-500" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              user.is_active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="bets">Bet History</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
              <CardDescription>Key metrics and summary for this user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Wallet Info</h3>
                    <p className="text-sm">Balance: ${user.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm">Lifetime Deposits: ${user.totalDeposits || '0.00'}</p>
                    <p className="text-sm">Lifetime Withdrawals: ${user.totalWithdrawals || '0.00'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bet Statistics</h3>
                    <p className="text-sm">Total Bets: {user.totalBets || userBets.length || 0}</p>
                    <p className="text-sm">Win Rate: {user.winRate || '0'}%</p>
                    <p className="text-sm">Largest Win: ${user.largestWin || '0.00'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Recent Activity</h3>
                  {isDataLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/5" />
                        </div>
                      ))}
                    </div>
                  ) : hasError ? (
                    <div className="py-4 text-center text-sm text-red-500">
                      Error loading activity data. Please try again.
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <ul className="space-y-2">
                      {recentActivity.map((activity) => (
                        <li key={activity.id} className="text-sm flex justify-between">
                          <span>{activity.description}</span>
                          <span>{new Date(activity.date).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">No recent activity found</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bet History</CardTitle>
              <CardDescription>Record of all bets placed by this user.</CardDescription>
            </CardHeader>
            <CardContent>
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
              ) : userBets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Game</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBets.map((bet: any) => (
                      <TableRow key={bet.id}>
                        <TableCell>{bet.prediction || bet.game_id || 'Unknown'}</TableCell>
                        <TableCell>${bet.risk || bet.amount || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            bet.status === 'won' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : bet.status === 'lost'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {bet.status === 'won' ? 'Win' : bet.status === 'lost' ? 'Loss' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(bet.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">No bets found for this user</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Record of all financial transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-full">
                      <Skeleton className="h-10 w-full mb-2" />
                    </div>
                  ))}
                </div>
              ) : transactionsError ? (
                <div className="py-4 text-center text-sm text-red-500">
                  Error loading transaction history. Please try again.
                </div>
              ) : userTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTransactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.type || 'Unknown'}</TableCell>
                        <TableCell>${transaction.amount || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">No transactions found for this user</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage user account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Account Actions</h3>
                  <div className="flex space-x-2">
                    <Button variant={user.status === 'active' ? 'destructive' : 'default'}>
                      {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                    </Button>
                    <Button variant="outline">Reset Password</Button>
                    <Button variant="outline">Send Notification</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Permissions</h3>
                  <div className="text-sm">
                    <p>Role: {user.role || 'User'}</p>
                    <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 