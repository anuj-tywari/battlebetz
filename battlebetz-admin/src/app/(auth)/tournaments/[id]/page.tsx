'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import TournamentDetailView from '@/components/tournaments/TournamentDetailView';
import TournamentForm from '@/components/tournaments/TournamentForm';
import { Tournament, DEFAULT_TOURNAMENT } from '@/types/tournament';
import { 
  useTournamentDetails, 
  useUpdateTournament
} from '@/hooks/useTournaments';

// Helper function to ensure we have a complete Tournament object
function ensureComplete(tournament: any): Tournament {
  return {
    ...DEFAULT_TOURNAMENT,
    ...tournament,
    // Make sure required fields have values
    id: tournament.id || DEFAULT_TOURNAMENT.id,
    createdAt: tournament.createdAt || new Date().toISOString()
  };
}

export default function TournamentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use our tournament details hook
  const { 
    tournament: basicTournamentData, 
    isLoading: isLoadingBasic, 
    error: basicError,
    refetch: refetchBasic
  } = useTournamentDetails(params.id);
  
  // We'll use the same hook for detailed data for now
  const {
    tournament: detailedData,
    isLoading: isLoadingDetailed,
    error: detailedError,
    refetch: refetchDetailed
  } = useTournamentDetails(params.id);

  // Update mutation
  const { 
    updateTournament,
    isUpdating: isSubmitting,
    error: updateError,
    isSuccess
  } = useUpdateTournament();

  // Determine which data to use based on what's available
  const tournamentData = detailedData || basicTournamentData;
  
  const isLoading = isLoadingBasic || isLoadingDetailed;
  const error = detailedError || basicError;
  const isError = !!updateError;

  // Ensure we have a complete tournament object
  const tournament = tournamentData ? ensureComplete(tournamentData) : null;

  // Go back to tournaments list
  const handleBack = () => {
    router.push('/tournaments');
  };

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(true);
    router.push(`/tournaments/${params.id}?mode=edit`);
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchBasic(), refetchDetailed()]);
    setIsRefreshing(false);
  };

  // Handle tournament update
  const handleUpdateTournament = async (formData: any) => {
    try {
      // Make a copy of the form data
      const formDataCopy = { ...formData };
      
      // Handle date conversion properly
      if (formDataCopy.startDate) {
        // Ensure startDate is a Date object before conversion
        const startDate = formDataCopy.startDate instanceof Date 
          ? formDataCopy.startDate 
          : new Date(formDataCopy.startDate);
        formDataCopy.startDate = startDate.toISOString();
      }
      
      if (formDataCopy.endDate) {
        // Ensure endDate is a Date object before conversion
        const endDate = formDataCopy.endDate instanceof Date 
          ? formDataCopy.endDate 
          : new Date(formDataCopy.endDate);
        formDataCopy.endDate = endDate.toISOString();
      }
      
      // Map form field names to database field names
      const tournamentUpdate = {
        id: params.id,
        name: formDataCopy.name,
        description: formDataCopy.description,
        rules: formDataCopy.rules,
        status: formDataCopy.status,
        prize_pool: formDataCopy.prizePool,
        entry_fee: formDataCopy.entryFee,
        start_date: formDataCopy.startDate,
        end_date: formDataCopy.endDate,
        max_participants: formDataCopy.maxParticipants,
        is_public: formDataCopy.isPublic,
        type: formDataCopy.type,
        // Keep original values for fields not in the form
        round_count: detailedData?.round_count || 1,
        round_type: detailedData?.round_type || 'CUMULATIVE ROI',
        payout_type: detailedData?.payout_type || 'PERCENTAGE',
        entry_deadline: detailedData?.entry_deadline || formDataCopy.startDate,
      };
      
      console.log('Updating tournament with data:', tournamentUpdate);
      
      // Use our update mutation with the correct structure
      updateTournament({
        id: params.id,
        data: {
          ...tournamentUpdate,
          // Include existing prize distribution and rounds if available
          prize_distribution: detailedData?.prize_distribution || [],
          rounds: detailedData?.rounds || []
        }
      });
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  };

  // Effect to handle successful updates
  useEffect(() => {
    if (isSuccess) {
      console.log('Tournament update successful, returning to details view');
      setIsEditing(false);
      router.push(`/tournaments/${params.id}`);
    }
  }, [isSuccess, params.id, router]);

  // Use effect to log tournament data when it changes
  useEffect(() => {
    if (tournament) {
      console.log('Tournament data loaded:', tournament);
      if (tournament.startDate) {
        console.log('Start date:', new Date(tournament.startDate));
      }
      if (tournament.endDate) {
        console.log('End date:', new Date(tournament.endDate));
      }
    }
  }, [tournament]);

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    router.push(`/tournaments/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading tournament details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>Error loading tournament details: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBack} variant="default">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>Tournament not found</p>
          </div>
          <Button onClick={handleBack} variant="default">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Edit Tournament</h1>
            </div>
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>Error updating tournament: {updateError instanceof Error ? updateError.message : 'Unknown error'}</p>
              </div>
            </div>
          )}

          <TournamentForm
            tournament={tournament}
            mode="edit"
            onSubmit={handleUpdateTournament}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <TournamentDetailView
          tournament={tournament}
          detailedData={detailedData}
          onBack={handleBack}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      )}
    </div>
  );
} 