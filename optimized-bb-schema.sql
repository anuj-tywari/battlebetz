-- =========================================================
-- ROLE AND PERMISSION TABLES
-- =========================================================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- =========================================================
-- CORE USER TABLES
-- =========================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  referred_by UUID REFERENCES users(id),
  promo_code TEXT UNIQUE,
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_username_idx ON users(username);
CREATE INDEX users_promo_code_idx ON users(promo_code);
CREATE INDEX users_referred_by_idx ON users(referred_by);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  private_profile BOOLEAN DEFAULT FALSE,
  show_winnings BOOLEAN DEFAULT TRUE,
  show_battle_history BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE user_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  battle_count INTEGER DEFAULT 0,
  battle_won_count INTEGER DEFAULT 0,
  battle_lost_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  friend_count INTEGER DEFAULT 0,
  referral_earnings NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================
-- FINANCIAL TABLES
-- =========================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bbz_balance NUMERIC NOT NULL DEFAULT 0,
  bbzt_balance NUMERIC NOT NULL DEFAULT 0,
  usd_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX wallets_user_id_idx ON wallets(user_id);

CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'bet_placed', 'winning', 'referral_bonus');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX transactions_reference_id_idx ON transactions(reference_id);
CREATE INDEX transactions_type_status_idx ON transactions(type, status);

-- =========================================================
-- SPORTS AND BETTING TABLES
-- =========================================================

CREATE TYPE bet_status AS ENUM ('pending', 'won', 'lost', 'cancelled');
CREATE TYPE game_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE odds_status AS ENUM ('open', 'closed', 'won', 'lost');

CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX teams_sport_id_idx ON teams(sport_id);

CREATE TABLE games (
  id BIGINT PRIMARY KEY,
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  home_team_id BIGINT NOT NULL REFERENCES teams(id),
  away_team_id BIGINT NOT NULL REFERENCES teams(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status game_status NOT NULL DEFAULT 'scheduled',
  score_home INTEGER,
  score_away INTEGER,
  bet_status odds_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX games_sport_id_idx ON games(sport_id);
CREATE INDEX games_team_ids_idx ON games(home_team_id, away_team_id);
CREATE INDEX games_start_time_idx ON games(start_time);
CREATE INDEX games_status_idx ON games(status);

CREATE TABLE bet_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id BIGINT NOT NULL REFERENCES games(id),
  bet_type_id INTEGER NOT NULL REFERENCES bet_types(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  odds NUMERIC NOT NULL,
  points NUMERIC,
  status odds_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(game_id, bet_type_id, name, description)
);

CREATE INDEX odds_game_id_idx ON odds(game_id);
CREATE INDEX odds_status_idx ON odds(status);

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  risk NUMERIC NOT NULL,
  odds NUMERIC NOT NULL,
  potential_payout NUMERIC NOT NULL,
  net_amount NUMERIC NOT NULL DEFAULT 0,
  status bet_status NOT NULL DEFAULT 'pending',
  bet_type_id INTEGER NOT NULL REFERENCES bet_types(id),
  prediction TEXT,
  tournament_id UUID,
  tournament_round_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX bets_user_id_idx ON bets(user_id);
CREATE INDEX bets_tournament_id_idx ON bets(tournament_id);
CREATE INDEX bets_status_idx ON bets(status);

CREATE TABLE subbets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_id UUID NOT NULL REFERENCES bets(id) ON DELETE CASCADE,
  odds_id UUID NOT NULL REFERENCES odds(id),
  status bet_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX subbets_bet_id_idx ON subbets(bet_id);
CREATE INDEX subbets_odds_id_idx ON subbets(odds_id);

-- =========================================================
-- TOURNAMENT TABLES
-- =========================================================

CREATE TYPE tournament_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE tournament_type AS ENUM ('public', 'private', 'invitational');
CREATE TYPE tournament_round_type AS ENUM ('cumulative', 'knockout', 'survivor');
CREATE TYPE tournament_payout_type AS ENUM ('percentage', 'fixed');
CREATE TYPE round_status AS ENUM ('upcoming', 'active', 'completed');

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type tournament_type NOT NULL DEFAULT 'public',
  status tournament_status NOT NULL DEFAULT 'upcoming',
  prize_pool NUMERIC NOT NULL DEFAULT 0,
  entry_fee NUMERIC NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  entry_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER NOT NULL DEFAULT 16,
  round_count INTEGER NOT NULL DEFAULT 1,
  round_type tournament_round_type NOT NULL DEFAULT 'cumulative',
  payout_type tournament_payout_type NOT NULL DEFAULT 'percentage',
  rules TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX tournaments_status_idx ON tournaments(status);
CREATE INDEX tournaments_type_idx ON tournaments(type);
CREATE INDEX tournaments_start_date_idx ON tournaments(start_date);

CREATE TABLE tournament_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  round_name TEXT NOT NULL,
  status round_status NOT NULL DEFAULT 'upcoming',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, round_number)
);

CREATE INDEX tournament_rounds_tournament_id_idx ON tournament_rounds(tournament_id);
CREATE INDEX tournament_rounds_status_idx ON tournament_rounds(status);

CREATE TABLE tournament_round_rules (
  round_id UUID PRIMARY KEY REFERENCES tournament_rounds(id) ON DELETE CASCADE,
  max_total_bets INTEGER NOT NULL DEFAULT 5,
  minimum_risk NUMERIC NOT NULL DEFAULT 1000,
  max_parlay_length INTEGER,
  survivor_metric NUMERIC,
  survivor_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

CREATE INDEX tournament_participants_tournament_id_idx ON tournament_participants(tournament_id);
CREATE INDEX tournament_participants_user_id_idx ON tournament_participants(user_id);

CREATE TABLE tournament_round_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES tournament_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  token_balance NUMERIC NOT NULL DEFAULT 0,
  rank INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(round_id, user_id)
);

CREATE INDEX tournament_round_participants_round_id_idx ON tournament_round_participants(round_id);
CREATE INDEX tournament_round_participants_user_id_idx ON tournament_round_participants(user_id);

CREATE TABLE tournament_prize_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  percentage NUMERIC,
  amount NUMERIC,
  recipient_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, position)
);

CREATE INDEX tournament_prize_dist_tournament_id_idx ON tournament_prize_distribution(tournament_id);

-- =========================================================
-- SOCIAL AND INVITATION TABLES
-- =========================================================

CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  status invite_status NOT NULL DEFAULT 'pending',
  tournament_id UUID REFERENCES tournaments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX invites_sender_id_idx ON invites(sender_id);
CREATE INDEX invites_recipient_email_idx ON invites(recipient_email);
CREATE INDEX invites_tournament_id_idx ON invites(tournament_id);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telephone TEXT,
  interested_in TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX leads_email_idx ON leads(email);
CREATE INDEX leads_status_idx ON leads(status);

-- =========================================================
-- TRIGGERS AND FUNCTIONS
-- =========================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_timestamp trigger to all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_timestamp
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    ', t);
  END LOOP;
END;
$$;

-- Function to generate unique promo code
CREATE OR REPLACE FUNCTION generate_promo_code(username TEXT)
RETURNS TEXT AS $$
DECLARE
  base_code TEXT;
  full_code TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base code from username (first 5 chars)
  base_code := upper(substr(regexp_replace(username, '[^a-zA-Z0-9]', '', 'g'), 1, 5));
  
  -- Add random numbers until unique
  LOOP
    -- Generate full code
    full_code := base_code || lpad(counter::text, 4, '0');
    
    -- Check if code exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE promo_code = full_code) THEN
      RETURN full_code;
    END IF;
    
    counter := counter + 1;
    
    -- Prevent infinite loop
    IF counter > 9999 THEN
      RAISE EXCEPTION 'Could not generate unique promo code';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle referrals
CREATE OR REPLACE FUNCTION handle_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if there's a referrer
  IF NEW.referred_by IS NOT NULL THEN
    -- Update referrer's stats
    UPDATE users
    SET referral_count = referral_count + 1
    WHERE id = NEW.referred_by;
    
    -- Update referrer's wallet
    UPDATE wallets
    SET bbz_balance = bbz_balance + 10
    WHERE user_id = NEW.referred_by;
    
    -- Update referrer's metrics
    UPDATE user_metrics
    SET referral_earnings = referral_earnings + 10
    WHERE user_id = NEW.referred_by;
    
    -- Create transaction record
    INSERT INTO transactions (
      user_id, 
      amount, 
      type, 
      status, 
      reference_id,
      description
    ) VALUES (
      NEW.referred_by, 
      10, 
      'referral_bonus', 
      'completed', 
      NEW.id,
      'Referral bonus for ' || NEW.username
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_referred
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION handle_referral_reward();

-- Trigger to update bet status based on subbets
CREATE OR REPLACE FUNCTION update_bet_status()
RETURNS TRIGGER AS $$
DECLARE
  all_won BOOLEAN;
  any_lost BOOLEAN;
  any_pending BOOLEAN;
  related_bet_record RECORD;
BEGIN
  -- Only proceed if status has changed
  IF (OLD.status = 'pending' AND (NEW.status = 'won' OR NEW.status = 'lost')) THEN
    
    -- Check all subbets for this bet
    SELECT
      BOOL_AND(status = 'won') AS all_won,
      BOOL_OR(status = 'lost') AS any_lost,
      BOOL_OR(status = 'pending') AS any_pending
    INTO
      all_won, any_lost, any_pending
    FROM
      subbets
    WHERE
      bet_id = NEW.bet_id;
    
    -- Get the bet record
    SELECT * INTO related_bet_record
    FROM bets
    WHERE id = NEW.bet_id;
    
    -- If any subbets are pending, do nothing
    IF any_pending THEN
      RETURN NEW;
    END IF;
    
    -- If all subbets won, mark bet as won
    IF all_won THEN
      UPDATE bets
      SET 
        status = 'won',
        net_amount = potential_payout - risk,
        updated_at = NOW()
      WHERE id = NEW.bet_id;
    
    -- If any subbets lost, mark bet as lost
    ELSIF any_lost THEN
      UPDATE bets
      SET 
        status = 'lost',
        net_amount = -risk,
        updated_at = NOW()
      WHERE id = NEW.bet_id;
    
    -- Handle single subbet case
    ELSE
      IF NEW.status = 'won' THEN
        UPDATE bets
        SET 
          status = 'won',
          net_amount = ROUND(potential_payout - risk, 0),
          updated_at = NOW()
        WHERE id = NEW.bet_id;
      ELSE
        UPDATE bets
        SET 
          status = 'lost',
          net_amount = -risk,
          updated_at = NOW()
        WHERE id = NEW.bet_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bet_update
AFTER UPDATE ON subbets
FOR EACH ROW
EXECUTE FUNCTION update_bet_status();

-- Trigger to update subbets when odds change
CREATE OR REPLACE FUNCTION update_subbets_from_odds()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status has changed from 'open' to 'won' or 'lost'
  IF (OLD.status = 'open' AND (NEW.status = 'won' OR NEW.status = 'lost')) THEN
    
    -- Update related subbets
    UPDATE subbets
    SET 
      status = NEW.status::bet_status,
      updated_at = NOW()
    WHERE 
      odds_id = NEW.id AND
      status = 'pending';
      
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subbets_from_odds
AFTER UPDATE ON odds
FOR EACH ROW
EXECUTE FUNCTION update_subbets_from_odds();

-- Trigger to update wallet balance on bet status change
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- If bet changed from pending to won
  IF (OLD.status = 'pending' AND NEW.status = 'won') THEN
    -- Add winnings to wallet
    UPDATE wallets
    SET bbz_balance = bbz_balance + NEW.potential_payout
    WHERE user_id = NEW.user_id;
    
    -- Create transaction record
    INSERT INTO transactions (
      user_id, 
      amount, 
      type, 
      status, 
      reference_id,
      description
    ) VALUES (
      NEW.user_id, 
      NEW.potential_payout, 
      'winning', 
      'completed', 
      NEW.id,
      'Winnings from bet'
    );
    
    -- If this is a tournament bet, update tournament balance
    IF NEW.tournament_round_id IS NOT NULL THEN
      UPDATE tournament_round_participants
      SET token_balance = token_balance + NEW.potential_payout
      WHERE round_id = NEW.tournament_round_id
        AND user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bet_update
AFTER UPDATE ON bets
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();

-- Trigger to update tournament participant count
CREATE OR REPLACE FUNCTION update_tournament_round_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tournament_rounds
    SET participant_count = participant_count + 1
    WHERE id = NEW.round_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tournament_rounds
    SET participant_count = participant_count - 1
    WHERE id = OLD.round_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_tournament_round_participant_change
AFTER INSERT OR DELETE ON tournament_round_participants
FOR EACH ROW
EXECUTE FUNCTION update_tournament_round_participant_count();

-- =========================================================
-- DEFAULT DATA
-- =========================================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrator with full access'),
('user', 'Standard user with basic permissions');

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('manage_users', 'Can manage all users', 'users', 'all'),
('manage_tournaments', 'Can manage all tournaments', 'tournaments', 'all'),
('view_tournaments', 'Can view tournaments', 'tournaments', 'read'),
('join_tournaments', 'Can join tournaments', 'tournaments', 'join'),
('place_bets', 'Can place bets', 'bets', 'create'),
('manage_own_profile', 'Can manage own profile', 'users', 'self');

-- Link roles and permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), -- admin can manage users
(1, 2), -- admin can manage tournaments
(1, 3), -- admin can view tournaments
(1, 4), -- admin can join tournaments
(1, 5), -- admin can place bets
(1, 6), -- admin can manage own profile
(2, 3), -- user can view tournaments
(2, 4), -- user can join tournaments
(2, 5), -- user can place bets
(2, 6); -- user can manage own profile

-- Insert default bet types
INSERT INTO bet_types (name, description) VALUES
('Moneyline', 'Straight bet on who will win'),
('Spread', 'Bet with point spread'),
('Total', 'Over/under bet on total points'),
('Parlay', 'Multiple bets combined'),
('Prop', 'Proposition bet on specific outcomes');

-- Insert default sports
INSERT INTO sports (name, description) VALUES
('Football', 'American Football'),
('Basketball', 'Basketball'),
('Baseball', 'Baseball'),
('Hockey', 'Ice Hockey'),
('Soccer', 'Soccer/Football');
