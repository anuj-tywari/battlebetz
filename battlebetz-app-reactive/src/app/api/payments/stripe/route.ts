import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
}) : null;

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 });
    }

    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    const { tournamentId, amount } = body;
    
    if (!tournamentId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get tournament details
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', tournamentId)
      .single();
      
    if (tournamentError || !tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: session.user.id,
        tournamentId,
        purpose: 'tournament_registration'
      }
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get('payment_intent_id');
  
  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing payment intent ID' }, { status: 400 });
  }

  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 });
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Check if payment is successful
    if (paymentIntent.status === 'succeeded') {
      const { tournamentId, userId } = paymentIntent.metadata;
      
      // Register user for the tournament
      if (tournamentId && userId) {
        const { error } = await supabase
          .from('tournament_round_participants')
          .insert({
            tournament_id: tournamentId,
            user_id: userId,
            joined_at: new Date().toISOString(),
            token_balance: 1000, // Default starting tokens
            status: 'ACTIVE'
          });
          
        if (error) {
          console.error('Error registering for tournament:', error);
          return NextResponse.json({ error: 'Failed to register for tournament' }, { status: 500 });
        }
      }
      
      return NextResponse.json({ success: true, status: paymentIntent.status });
    }
    
    return NextResponse.json({ success: false, status: paymentIntent.status });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 