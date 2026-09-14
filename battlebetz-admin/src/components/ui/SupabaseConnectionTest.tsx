'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Label } from './label';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
import { CheckCircle, XCircle, Database, ArrowUpDown, Code, RotateCcw } from 'lucide-react';
import { testDirectApiConnection } from '@/services/directApiService';

export function SupabaseConnectionTest() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [directApiResult, setDirectApiResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [directApiLoading, setDirectApiLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const isConnected = await testSupabaseConnection();
      
      if (isConnected) {
        setTestResult({
          success: true,
          message: 'Connected to Supabase'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Failed to connect to Supabase'
        });
      }
      
      // Additional tests for specific tables
      try {
        // Test users table
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, username')
          .limit(1);
        
        if (usersError) {
          setTestResult({
            success: false,
            message: 'Failed to query users table',
            details: usersError.message
          });
        }
      } catch (error: any) {
        console.error("Error testing users table:", error);
      }
      
      try {
        // Test tournaments table
        const { data: tournamentsData, error: tournamentsError } = await supabase
          .from('tournaments')
          .select('id, name')
          .limit(1);
        
        if (tournamentsError && !tournamentsError.message.includes('does not exist')) {
          setTestResult(prev => ({
            success: prev?.success || false,
            message: prev?.success ? prev.message : 'Failed to query tournaments table',
            details: {
              ...prev?.details,
              tournaments: tournamentsError.message
            }
          }));
        }
      } catch (error: any) {
        console.error("Error testing tournaments table:", error);
      }
      
      try {
        // Test games table
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('event_id, home_team, away_team')
          .limit(1);
        
        if (gamesError && !gamesError.message.includes('does not exist')) {
          setTestResult(prev => ({
            success: prev?.success || false,
            message: prev?.success ? prev.message : 'Failed to query games table',
            details: {
              ...prev?.details,
              games: gamesError.message
            }
          }));
        }
      } catch (error: any) {
        console.error("Error testing games table:", error);
      }
      
    } catch (error: any) {
      setTestResult({
        success: false,
        message: 'Unexpected error',
        details: error.message || error
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectApi = async () => {
    setDirectApiLoading(true);
    try {
      const isDirectApiConnected = await testDirectApiConnection();
      
      if (isDirectApiConnected) {
        setDirectApiResult({
          success: true,
          message: 'Direct API connection successful',
          details: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
            timestamp: new Date().toISOString()
          }
        });
      } else {
        setDirectApiResult({
          success: false,
          message: 'Direct API connection failed'
        });
      }
    } catch (error: any) {
      setDirectApiResult({
        success: false,
        message: 'Direct API test error',
        details: error.message || 'Unknown error'
      });
    } finally {
      setDirectApiLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Database className="mr-2 h-5 w-5" /> 
          Supabase Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Database SDK Connection</Label>
          <div className="text-sm rounded-md p-3 bg-secondary/50">
            {testResult ? (
              <div className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{testResult.message}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Not tested yet</span>
            )}
            
            {testResult?.details && (
              <div className="mt-2 text-xs text-muted-foreground">
                <pre className="overflow-auto p-2 bg-background rounded">{JSON.stringify(testResult.details, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Direct REST API Connection</Label>
          <div className="text-sm rounded-md p-3 bg-secondary/50">
            {directApiResult ? (
              <div className="flex items-center space-x-2">
                {directApiResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{directApiResult.message}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Not tested yet</span>
            )}
            
            {directApiResult?.details && (
              <div className="mt-2 text-xs text-muted-foreground">
                <pre className="overflow-auto p-2 bg-background rounded">{JSON.stringify(directApiResult.details, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={runConnectionTest} 
          disabled={loading}
          variant="outline"
          className="flex items-center"
        >
          {loading ? (
            <RotateCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ArrowUpDown className="h-4 w-4 mr-2" />
          )}
          Test SDK Connection
        </Button>
        
        <Button 
          onClick={testDirectApi} 
          disabled={directApiLoading}
          variant="outline"
          className="flex items-center"
        >
          {directApiLoading ? (
            <RotateCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Code className="h-4 w-4 mr-2" />
          )}
          Test Direct API
        </Button>
      </CardFooter>
    </Card>
  );
} 