// components/bets/BetDetailView.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, DollarSign, Gamepad2, User, Clock } from "lucide-react";
import { useUser } from "@/hooks/useUsers";
import { useGame } from "@/hooks/useGames";
import { Bet } from "@/types/bet";

interface BetDetailViewProps {
  bet: Bet;
}

export default function BetDetailView({ bet }: BetDetailViewProps) {
  const { data: user, isLoading: isLoadingUser } = useUser(bet.user_id);
  const { data: game, isLoading: isLoadingGame } = useGame(bet.game_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Bet #{bet.id.substring(0, 8)}</h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(bet.created_at).toLocaleString()}
          </p>
        </div>
        
        <Badge className={`${
          bet.outcome === 'win' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : bet.outcome === 'loss'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {bet.outcome.charAt(0).toUpperCase() + bet.outcome.slice(1)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
              Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${bet.amount.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
              Potential Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(bet.amount * 2).toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
              Profit/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              bet.outcome === 'win' 
                ? 'text-green-600' 
                : bet.outcome === 'loss' 
                  ? 'text-red-600' 
                  : ''
            }`}>
              {bet.outcome === 'win' 
                ? `+$${bet.profit_loss?.toFixed(2) || (bet.amount).toFixed(2)}`
                : bet.outcome === 'loss' 
                  ? `-$${Math.abs(bet.profit_loss || bet.amount).toFixed(2)}`
                  : '$0.00'
              }
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUser ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">Name: <span className="font-normal">{user?.name || bet.users.name}</span></p>
                <p className="text-sm font-medium">Email: <span className="font-normal">{user?.email || bet.users.email}</span></p>
                {user?.phone && (
                  <p className="text-sm font-medium">Phone: <span className="font-normal">{user.phone}</span></p>
                )}
                <p className="text-sm font-medium">Status: <span className="font-normal">{user?.status || 'N/A'}</span></p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Game Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingGame ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">Game: <span className="font-normal">{game?.name || bet.games.name}</span></p>
                {game?.description && (
                  <p className="text-sm font-medium">Description: <span className="font-normal">{game.description}</span></p>
                )}
                <p className="text-sm font-medium">Type: <span className="font-normal">{game?.game_type || 'N/A'}</span></p>
                <p className="text-sm font-medium">Status: <span className="font-normal">{game?.status || 'N/A'}</span></p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bet Timeline</CardTitle>
          <CardDescription>Timeline of events for this bet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <div className="mr-4 flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="h-full w-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div>
                <p className="text-sm font-medium">Bet Placed</p>
                <p className="text-xs text-gray-500">{new Date(bet.created_at).toLocaleString()}</p>
                <p className="text-sm mt-1">
                  User placed a bet of ${bet.amount.toFixed(2)} on {bet.games.name}
                </p>
              </div>
            </div>
            {bet.outcome !== 'pending' && (
              <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full
                    ${bet.outcome === 'win' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                    }
                  `}>
                    {bet.outcome === 'win' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium
                    ${bet.outcome === 'win' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}
                  `}>
                    Bet {bet.outcome === 'win' ? 'Won' : 'Lost'}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(bet.updated_at || bet.created_at).toLocaleString()}</p>
                  <p className="text-sm mt-1">
                    {bet.outcome === 'win'
                      ? `User won $${(bet.profit_loss || bet.amount).toFixed(2)}`
                      : `User lost $${Math.abs(bet.profit_loss || bet.amount).toFixed(2)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

