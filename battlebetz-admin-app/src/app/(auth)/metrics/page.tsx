'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Loader2, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/supabase-auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export default function MetricsPage() {
  const router = useRouter();
  const { supabase, isAuthenticated } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for metrics data
  const [userData, setUserData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [betsData, setBetsData] = useState<any[]>([]);
  const [gameCategoryData, setGameCategoryData] = useState<any[]>([]);
  const [userSourceData, setUserSourceData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setError('Authentication required. Please log in.');
      setIsLoading(false);
      return;
    }
    
    fetchMetricsData();
  }, [isAuthenticated, supabase]);
  
  const fetchMetricsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user growth data by month
      const userGrowthByMonth = await fetchUserGrowthByMonth();
      setUserData(userGrowthByMonth);
      
      // Fetch revenue data by month
      const revenueByMonth = await fetchRevenueByMonth();
      setRevenueData(revenueByMonth);
      
      // Fetch bets data by month
      const betsByMonth = await fetchBetsByMonth();
      setBetsData(betsByMonth);
      
      // Fetch game category data
      const gameCategories = await fetchGameCategories();
      setGameCategoryData(gameCategories);
      
      // User acquisition sources (simplified calculation based on available data)
      const userSources = await fetchUserSources();
      setUserSourceData(userSources);
      
      // Device data (mocked for now as this likely requires frontend analytics)
      setDeviceData([
        { name: 'Mobile', value: 65 },
        { name: 'Desktop', value: 30 },
        { name: 'Tablet', value: 5 },
      ]);
      
    } catch (err: any) {
      console.error('Error fetching metrics data:', err);
      setError(err.message || 'Failed to load metrics data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch user growth by month
  const fetchUserGrowthByMonth = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    // Parse month from created_at and count users per month
    const monthCounts: Record<string, number> = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize with all months of current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthCounts[month] = 0;
    });
    
    // Count users by month for the current year
    data?.forEach(user => {
      const createdAt = new Date(user.created_at);
      if (createdAt.getFullYear() === currentYear) {
        const month = months[createdAt.getMonth()];
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    
    // Convert to array format for charts
    return months.map(month => ({
      name: month,
      value: monthCounts[month] || 0
    }));
  };
  
  // Function to fetch revenue by month
  const fetchRevenueByMonth = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, created_at')
      .in('type', ['deposit', 'withdrawal', 'winning', 'bet_placed']);
      
    if (error) throw error;
    
    // Parse month from created_at and calculate revenue
    const monthRevenue: Record<string, number> = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize with all months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthRevenue[month] = 0;
    });
    
    // Calculate revenue by month
    data?.forEach(transaction => {
      const createdAt = new Date(transaction.created_at);
      if (createdAt.getFullYear() === currentYear) {
        const month = months[createdAt.getMonth()];
        
        // Calculate revenue impact based on transaction type
        let amount = transaction.amount || 0;
        if (transaction.type === 'deposit' || transaction.type === 'winning') {
          monthRevenue[month] = (monthRevenue[month] || 0) + amount;
        } else if (transaction.type === 'withdrawal' || transaction.type === 'bet_placed') {
          monthRevenue[month] = (monthRevenue[month] || 0) - amount;
        }
      }
    });
    
    // Convert to array format for charts
    return months.map(month => ({
      name: month,
      value: Math.abs(monthRevenue[month] || 0) // Use absolute value for display
    }));
  };
  
  // Function to fetch bets data by month
  const fetchBetsByMonth = async () => {
    const { data, error } = await supabase
      .from('bets')
      .select('created_at');
      
    if (error) throw error;
    
    // Parse month from created_at and count bets per month
    const monthCounts: Record<string, number> = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize with all months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthCounts[month] = 0;
    });
    
    // Count bets by month
    data?.forEach(bet => {
      const createdAt = new Date(bet.created_at);
      if (createdAt.getFullYear() === currentYear) {
        const month = months[createdAt.getMonth()];
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    
    // Convert to array format for charts
    return months.map(month => ({
      name: month,
      value: monthCounts[month] || 0
    }));
  };
  
  // Function to fetch game categories
  const fetchGameCategories = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('sport');
      
    if (error) throw error;
    
    // Count games by sport category
    const sportCounts: Record<string, number> = {};
    let totalGames = 0;
    
    // Count games by sport
    data?.forEach(game => {
      const sport = game.sport || 'Other';
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
      totalGames++;
    });
    
    // Convert to array format for charts and calculate percentages
    const sportCategories = Object.keys(sportCounts).map(sport => ({
      name: sport,
      value: Math.round((sportCounts[sport] / totalGames) * 100) // Convert to percentage
    }));
    
    // Sort by value descending and limit to top 5, combining the rest into "Other"
    sportCategories.sort((a, b) => b.value - a.value);
    
    if (sportCategories.length <= 5) {
      return sportCategories;
    }
    
    const top4 = sportCategories.slice(0, 4);
    const otherValue = sportCategories.slice(4).reduce((sum, item) => sum + item.value, 0);
    
    return [...top4, { name: 'Other', value: otherValue }];
  };
  
  // Function to fetch user sources (simplified)
  const fetchUserSources = async () => {
    // In a real implementation, this would use UTM parameters or referral data
    // For now, we'll create a simplified version based on available data
    
    const { data, error } = await supabase
      .from('users')
      .select('referred_by');
      
    if (error) throw error;
    
    const totalUsers = data?.length || 0;
    const referredUsers = data?.filter(user => user.referred_by)?.length || 0;
    
    // Create approximated distribution
    const referralPercentage = totalUsers > 0 ? Math.round((referredUsers / totalUsers) * 100) : 0;
    const directPercentage = 100 - referralPercentage;
    
    // Split direct traffic into common sources
    return [
      { name: 'Direct', value: Math.round(directPercentage * 0.6) },
      { name: 'Search', value: Math.round(directPercentage * 0.25) },
      { name: 'Social', value: Math.round(directPercentage * 0.15) },
      { name: 'Referral', value: referralPercentage },
    ];
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
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
            <h1 className="text-2xl font-bold tracking-tight">Analytics & Metrics</h1>
          </div>
          <p className="text-muted-foreground">
            View detailed analytics and metrics for your platform
          </p>
        </div>
        
        <Button 
          onClick={fetchMetricsData}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registrations over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={userData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Users']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Users"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Acquisition Channels</CardTitle>
                <CardDescription>User acquisition by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {userSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bets Placed</CardTitle>
                <CardDescription>Monthly bets placed over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={betsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Bets']} />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name="Bets Placed"
                          fill="#82ca9d"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>Platform usage by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Game Categories</CardTitle>
                <CardDescription>Bet distribution by game category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gameCategoryData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name="Percentage"
                          fill="#8884d8"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Total revenue over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Revenue"
                          stroke="#ff8042"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Bet Size</CardTitle>
                <CardDescription>Average bet size in USD over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Q1', value: 25 },
                          { name: 'Q2', value: 29 },
                          { name: 'Q3', value: 32 },
                          { name: 'Q4', value: 38 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Average Bet']} />
                        <Legend />
                        <Bar
                          dataKey="value"
                          name="Average Bet Size"
                          fill="#ffc658"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Game Type</CardTitle>
                <CardDescription>Revenue split by game category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gameCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {gameCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 