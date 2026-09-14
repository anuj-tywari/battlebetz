'use client';

import { useState } from 'react';
import { SupabaseConnectionTest } from '@/components/ui/SupabaseConnectionTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUsers } from '@/services/directApiService';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { AlertCircle, CheckCircle, Database, UserCog, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DevToolsPage() {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [setAdminResult, setSetAdminResult] = useState<any>(null);
  const [setAdminLoading, setSetAdminLoading] = useState(false);

  // Test direct fetching of users
  const testFetchUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchUsers();
      setTestResults(prev => [
        {
          name: 'Direct API User Fetch',
          success: true,
          time: new Date().toISOString(),
          details: {
            count: result.users.length,
            sample: result.users.slice(0, 2)
          }
        },
        ...prev
      ]);
      
      toast({
        title: "API Test Successful",
        description: `Successfully fetched ${result.users.length} users via direct API`,
      });
    } catch (error: any) {
      setTestResults(prev => [
        {
          name: 'Direct API User Fetch',
          success: false,
          time: new Date().toISOString(),
          error: error.message
        },
        ...prev
      ]);
      
      toast({
        title: "API Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set admin role for a user
  const setUserAsAdmin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setSetAdminLoading(true);
    try {
      // First try with direct API
      const response = await fetch('/api/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to set user as admin');
      }
      
      setSetAdminResult({
        success: true,
        time: new Date().toISOString(),
        details: result
      });
      
      toast({
        title: "Success",
        description: `User ${email} has been set as admin`,
      });
    } catch (error: any) {
      setSetAdminResult({
        success: false,
        time: new Date().toISOString(),
        error: error.message
      });
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSetAdminLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
      </div>
      
      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Connection Tests</TabsTrigger>
          <TabsTrigger value="users">User Tools</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="space-y-4 pt-4">
          <SupabaseConnectionTest />
          
          <Card>
            <CardHeader>
              <CardTitle>Direct API Tests</CardTitle>
              <CardDescription>
                Test direct REST API calls to Supabase without using the SDK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testFetchUsers} disabled={loading}>
                {loading ? 'Testing...' : 'Test Direct User API'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Set User as Admin</CardTitle>
              <CardDescription>
                Grant admin privileges to a user by email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  User Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {setAdminResult && (
                <div className={`mt-4 p-3 rounded-md ${
                  setAdminResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <div className="flex items-center">
                    {setAdminResult.success ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 mr-2" />
                    )}
                    <p>
                      {setAdminResult.success 
                        ? 'User successfully set as admin' 
                        : `Error: ${setAdminResult.error}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={setUserAsAdmin} disabled={setAdminLoading} className="w-full">
                <UserCog className="mr-2 h-4 w-4" />
                {setAdminLoading ? 'Processing...' : 'Set as Admin'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results History</CardTitle>
              <CardDescription>
                Results from previous API and connection tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No test results yet. Run some tests to see results here.
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded-md border ${
                      result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center font-medium">
                          {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          {result.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(result.time).toLocaleString()}
                        </div>
                      </div>
                      
                      {result.error && (
                        <div className="text-red-600 mt-2 text-sm">
                          Error: {result.error}
                        </div>
                      )}
                      
                      {result.details && (
                        <div className="mt-2 text-xs overflow-auto">
                          <pre className="bg-background p-2 rounded">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 