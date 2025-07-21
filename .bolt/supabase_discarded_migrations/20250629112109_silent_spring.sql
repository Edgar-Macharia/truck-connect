/*
  # Kenyan Market Database Population with Password Security

  1. Password Security Features
    - Add password-related columns to users table
    - Implement password hashing and security constraints
    - Add password reset functionality
    - Create password management functions

  2. Kenyan Market Data
    - Kenyan driver profiles with local names and phone numbers
    - Kenyan truck specifications and pricing in KES
    - Kenyan business profiles and locations
    - Realistic Kenyan market analytics

  3. Security and Performance
    - Row Level Security policies
    - Optimized indexes for common queries
    - Password strength validation
    - Automatic cleanup functions
*/

-- Add password-related columns to users table (only if they don't exist)
DO $$
BEGIN
    -- Add password_hash column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE users ADD COLUMN password_hash text;
    END IF;

    -- Add password_salt column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_salt'
    ) THEN
        ALTER TABLE users ADD COLUMN password_salt text;
    END IF;

    -- Add password_reset_token column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_reset_token'
    ) THEN
        ALTER TABLE users ADD COLUMN password_reset_token text;
    END IF;

    -- Add password_reset_expires column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_reset_expires'
    ) THEN
        ALTER TABLE users ADD COLUMN password_reset_expires timestamptz;
    END IF;

    -- Add last_password_change column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_password_change'
    ) THEN
        ALTER TABLE users ADD COLUMN last_password_change timestamptz DEFAULT now();
    END IF;
END $$;

-- Add constraints for password security (only if they don't exist)
DO $$
BEGIN
    -- Add password_hash constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'password_hash_not_empty'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT password_hash_not_empty CHECK (length(password_hash) >= 8);
    END IF;

    -- Add password_salt constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' AND constraint_name = 'password_salt_not_empty'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT password_salt_not_empty CHECK (length(password_salt) >= 8);
    END IF;
END $$;

-- Create indexes for password reset functionality
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_password_reset_expires ON users(password_reset_expires) WHERE password_reset_expires IS NOT NULL;

-- Update existing users with default password hash (only those without passwords)
UPDATE users 
SET 
  password_hash = '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy',
  password_salt = '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO',
  last_password_change = COALESCE(last_password_change, created_at)
WHERE password_hash IS NULL;

-- Make password fields required (only if they're not already)
DO $$
BEGIN
    -- Check if password_hash is nullable and make it NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash' AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
    END IF;

    -- Check if password_salt is nullable and make it NOT NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_salt' AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE users ALTER COLUMN password_salt SET NOT NULL;
    END IF;
END $$;

-- Add password change trigger function
CREATE OR REPLACE FUNCTION update_password_change_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.password_hash IS DISTINCT FROM NEW.password_hash THEN
    NEW.last_password_change = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS trigger_update_password_change ON users;
CREATE TRIGGER trigger_update_password_change
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_password_change_timestamp();

-- Password management functions
CREATE OR REPLACE FUNCTION cleanup_expired_password_tokens()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET 
    password_reset_token = NULL,
    password_reset_expires = NULL
  WHERE password_reset_expires < now();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_password_strength(password text)
RETURNS boolean AS $$
BEGIN
  IF length(password) < 8 THEN RETURN false; END IF;
  IF password !~ '[A-Z]' THEN RETURN false; END IF;
  IF password !~ '[a-z]' THEN RETURN false; END IF;
  IF password !~ '[0-9]' THEN RETURN false; END IF;
  IF password !~ '[^A-Za-z0-9]' THEN RETURN false; END IF;
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Clear existing sample data to avoid conflicts
DELETE FROM driver_locations WHERE driver_id IN (SELECT id FROM users WHERE role = 'driver');
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');
DELETE FROM analytics WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');
DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');
DELETE FROM drivers WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');
DELETE FROM businesses WHERE user_id IN (SELECT id FROM users WHERE role = 'business');
DELETE FROM users WHERE email LIKE '%@email.com' OR email LIKE '%@techstartup.com' OR email LIKE '%@retailcorp.com' OR email LIKE '%@gmail.com' OR email LIKE '%@safaritechke.com' OR email LIKE '%@eastafricacorp.co.ke';
DELETE FROM job_locations WHERE country IN ('US', 'KE');
DELETE FROM pricing_rules WHERE name LIKE '%Standard%' OR name LIKE '%Kenya%';

-- Insert Kenyan driver users with proper column names
INSERT INTO users (id, email, name, phone, role, is_verified, is_active, password_hash, password_salt, created_at, updated_at) VALUES
  ('01234567-89ab-cdef-0123-456789abcdef', 'john.mwangi@gmail.com', 'John Mwangi', '+254-712-345-678', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '6 months', NOW()),
  ('11234567-89ab-cdef-0123-456789abcdef', 'grace.wanjiku@gmail.com', 'Grace Wanjiku', '+254-722-456-789', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '8 months', NOW()),
  ('21234567-89ab-cdef-0123-456789abcdef', 'peter.kiprotich@gmail.com', 'Peter Kiprotich', '+254-733-567-890', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '4 months', NOW()),
  ('31234567-89ab-cdef-0123-456789abcdef', 'mary.achieng@gmail.com', 'Mary Achieng', '+254-744-678-901', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1 year', NOW()),
  ('41234567-89ab-cdef-0123-456789abcdef', 'samuel.mutua@gmail.com', 'Samuel Mutua', '+254-755-789-012', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '2 years', NOW()),
  ('51234567-89ab-cdef-0123-456789abcdef', 'faith.njeri@gmail.com', 'Faith Njeri', '+254-766-890-123', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '3 months', NOW()),
  ('61234567-89ab-cdef-0123-456789abcdef', 'david.kamau@gmail.com', 'David Kamau', '+254-777-901-234', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1.5 years', NOW()),
  ('71234567-89ab-cdef-0123-456789abcdef', 'esther.wambui@gmail.com', 'Esther Wambui', '+254-788-012-345', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '9 months', NOW()),
  ('81234567-89ab-cdef-0123-456789abcdef', 'james.ochieng@gmail.com', 'James Ochieng', '+254-799-123-456', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '7 months', NOW()),
  ('91234567-89ab-cdef-0123-456789abcdef', 'lucy.nyambura@gmail.com', 'Lucy Nyambura', '+254-701-234-567', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '5 months', NOW()),
  ('a1234567-89ab-cdef-0123-456789abcdef', 'michael.kipchoge@gmail.com', 'Michael Kipchoge', '+254-712-345-678', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '2.5 years', NOW()),
  ('b1234567-89ab-cdef-0123-456789abcdef', 'rose.muthoni@gmail.com', 'Rose Muthoni', '+254-723-456-789', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '11 months', NOW()),
  ('c1234567-89ab-cdef-0123-456789abcdef', 'daniel.kiptoo@gmail.com', 'Daniel Kiptoo', '+254-734-567-890', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '6 months', NOW()),
  ('d1234567-89ab-cdef-0123-456789abcdef', 'jane.wairimu@gmail.com', 'Jane Wairimu', '+254-745-678-901', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1.2 years', NOW()),
  ('e1234567-89ab-cdef-0123-456789abcdef', 'anthony.otieno@gmail.com', 'Anthony Otieno', '+254-756-789-012', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '8 months', NOW()),
  ('f1234567-89ab-cdef-0123-456789abcdef', 'mercy.chebet@gmail.com', 'Mercy Chebet', '+254-767-890-123', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '4 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde0', 'joseph.mbugua@gmail.com', 'Joseph Mbugua', '+254-778-901-234', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1.8 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde1', 'caroline.wanjala@gmail.com', 'Caroline Wanjala', '+254-789-012-345', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '10 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde2', 'francis.kimani@gmail.com', 'Francis Kimani', '+254-790-123-456', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '3 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde3', 'beatrice.mwende@gmail.com', 'Beatrice Mwende', '+254-701-234-567', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1.3 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde4', 'robert.macharia@gmail.com', 'Robert Macharia', '+254-712-345-678', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '7 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde5', 'agnes.wangari@gmail.com', 'Agnes Wangari', '+254-723-456-789', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '2.2 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde6', 'paul.maina@gmail.com', 'Paul Maina', '+254-734-567-890', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '5 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde7', 'susan.njoki@gmail.com', 'Susan Njoki', '+254-745-678-901', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '1.6 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde8', 'george.omondi@gmail.com', 'George Omondi', '+254-756-789-012', 'driver', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '9 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding driver profiles with Kenyan truck information and KES pricing
INSERT INTO drivers (
  id, user_id, license_number, license_expiry_date, truck_type, truck_capacity,
  truck_make, truck_model, truck_year, truck_plate_number, truck_vin,
  availability_status, hourly_rate, per_mile_rate, rating, total_jobs, total_earnings,
  is_background_checked, background_check_date, created_at, updated_at
) VALUES
  -- Pickup Trucks (Popular in Kenya)
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'DL123456789', '2026-12-31', 'pickup', 1500, 'Toyota', 'Hilux', 2022, 'KCA 123A', '1FTFW1ET5NFC12345', 'available', 2500.00, 150.00, 4.8, 156, 485000.00, true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'DL234567890', '2027-03-15', 'pickup', 1200, 'Isuzu', 'D-Max', 2023, 'KBZ 456B', '3TMCZ5AN5NM123456', 'available', 2800.00, 170.00, 4.9, 203, 720000.00, true, NOW() - INTERVAL '7 months', NOW() - INTERVAL '8 months', NOW()),
  (gen_random_uuid(), '21234567-89ab-cdef-0123-456789abcdef', 'DL345678901', '2025-08-20', 'pickup', 1800, 'Mitsubishi', 'L200', 2021, 'KAY 789C', '1GCUYDED5MZ123456', 'busy', 2300.00, 140.00, 4.7, 89, 340000.00, true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 months', NOW()),
  (gen_random_uuid(), '31234567-89ab-cdef-0123-456789abcdef', 'DL456789012', '2026-06-10', 'pickup', 2000, 'Ford', 'Ranger', 2020, 'KBX 012D', '1C6SRFFT4LN123456', 'available', 2600.00, 160.00, 4.6, 134, 580000.00, true, NOW() - INTERVAL '11 months', NOW() - INTERVAL '1 year', NOW()),
  (gen_random_uuid(), '41234567-89ab-cdef-0123-456789abcdef', 'DL567890123', '2025-11-25', 'pickup', 1400, 'Nissan', 'Navara', 2022, 'KCB 345E', '1N6AD0EV4NN123456', 'available', 2400.00, 145.00, 4.9, 287, 1100000.00, true, NOW() - INTERVAL '1.8 years', NOW() - INTERVAL '2 years', NOW()),

  -- Box Trucks (Common for urban deliveries)
  (gen_random_uuid(), '51234567-89ab-cdef-0123-456789abcdef', 'DL678901234', '2027-01-12', 'box', 5000, 'Isuzu', 'NPR', 2021, 'KCA 678F', '54DC4W1B8LS123456', 'available', 3800.00, 200.00, 4.8, 98, 620000.00, true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 months', NOW()),
  (gen_random_uuid(), '61234567-89ab-cdef-0123-456789abcdef', 'DL789012345', '2026-09-05', 'box', 6000, 'Mitsubishi', 'Canter', 2020, 'KBZ 901G', '1FDWE3FL4LDA12345', 'available', 4200.00, 220.00, 4.7, 178, 950000.00, true, NOW() - INTERVAL '1.2 years', NOW() - INTERVAL '1.5 years', NOW()),
  (gen_random_uuid(), '71234567-89ab-cdef-0123-456789abcdef', 'DL890123456', '2025-12-18', 'box', 4500, 'Hino', '300 Series', 2022, 'KAY 234H', 'WD3PE8CC5NP123456', 'offline', 3600.00, 190.00, 4.9, 145, 750000.00, true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '9 months', NOW()),
  (gen_random_uuid(), '81234567-89ab-cdef-0123-456789abcdef', 'DL901234567', '2026-04-22', 'box', 5500, 'Isuzu', 'FRR', 2021, 'KBX 567I', '1GB0G2CL8M1123456', 'available', 4000.00, 210.00, 4.6, 112, 650000.00, true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '7 months', NOW()),

  -- Flatbed Trucks (For construction materials)
  (gen_random_uuid(), '91234567-89ab-cdef-0123-456789abcdef', 'DL012345678', '2027-02-28', 'flatbed', 8000, 'Mitsubishi', 'Canter', 2020, 'KCA 890J', '1FUJGHDV8LLBX1234', 'available', 4500.00, 250.00, 4.8, 167, 1250000.00, true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 months', NOW()),
  (gen_random_uuid(), 'a1234567-89ab-cdef-0123-456789abcdef', 'DL123456780', '2025-10-14', 'flatbed', 10000, 'Isuzu', 'FVZ', 2019, 'KBZ 123K', '1XPWD40X1KD123456', 'busy', 5200.00, 280.00, 4.9, 298, 1850000.00, true, NOW() - INTERVAL '2.2 years', NOW() - INTERVAL '2.5 years', NOW()),
  (gen_random_uuid(), 'b1234567-89ab-cdef-0123-456789abcdef', 'DL234567801', '2026-07-08', 'flatbed', 9000, 'Hino', '500 Series', 2021, 'KAY 456L', '1XKWD40X1LJ123456', 'available', 4800.00, 260.00, 4.7, 189, 1480000.00, true, NOW() - INTERVAL '10 months', NOW() - INTERVAL '11 months', NOW()),

  -- Semi-Trailers (For long distance)
  (gen_random_uuid(), 'c1234567-89ab-cdef-0123-456789abcdef', 'DL345678012', '2025-05-30', 'semi', 25000, 'Scania', 'R-Series', 2020, 'KCA 789M', '4V4NC9EH8LN123456', 'available', 8500.00, 400.00, 4.8, 234, 2500000.00, true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), 'd1234567-89ab-cdef-0123-456789abcdef', 'DL456789023', '2026-11-16', 'semi', 30000, 'Volvo', 'FH', 2021, 'KBZ 012N', '1M1AW07Y8LM123456', 'offline', 9200.00, 450.00, 4.9, 312, 3000000.00, true, NOW() - INTERVAL '1 year', NOW() - INTERVAL '1.2 years', NOW()),
  (gen_random_uuid(), 'e1234567-89ab-cdef-0123-456789abcdef', 'DL567890134', '2027-01-03', 'semi', 28000, 'Mercedes', 'Actros', 2022, 'KAY 345O', '1HSDJSJR5NN123456', 'available', 8800.00, 420.00, 4.6, 156, 1980000.00, true, NOW() - INTERVAL '7 months', NOW() - INTERVAL '8 months', NOW()),

  -- Refrigerated Trucks (For perishables)
  (gen_random_uuid(), 'f1234567-89ab-cdef-0123-456789abcdef', 'DL678901245', '2026-03-21', 'refrigerated', 6000, 'Hino', '300 Series', 2021, 'KCA 678P', '1FUJGHDV8MLBX1234', 'available', 5200.00, 300.00, 4.8, 87, 740000.00, true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde0', 'DL789012356', '2025-09-12', 'refrigerated', 8000, 'Isuzu', 'FRR', 2020, 'KBZ 901Q', '1FUJGHDV8KLBX1234', 'busy', 5800.00, 340.00, 4.9, 198, 1620000.00, true, NOW() - INTERVAL '1.5 years', NOW() - INTERVAL '1.8 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde1', 'DL890123467', '2026-12-07', 'refrigerated', 7000, 'Mitsubishi', 'Canter', 2022, 'KAY 234R', '1UYVS2538NL123456', 'available', 5500.00, 320.00, 4.7, 124, 1100000.00, true, NOW() - INTERVAL '9 months', NOW() - INTERVAL '10 months', NOW()),

  -- Additional Mixed Types
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde2', 'DL901234578', '2027-04-15', 'pickup', 1600, 'Toyota', 'Hilux', 2023, 'KCA 567S', '1GTU9EED5NZ123456', 'available', 2700.00, 165.00, 4.6, 45, 148000.00, true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde3', 'DL012345689', '2025-08-28', 'box', 5200, 'Isuzu', 'NPR', 2021, 'KBZ 890T', '5PVNE8JF8M4123456', 'available', 3900.00, 205.00, 4.9, 167, 890000.00, true, NOW() - INTERVAL '1.1 years', NOW() - INTERVAL '1.3 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde4', 'DL123456790', '2026-06-19', 'flatbed', 9500, 'Hino', '500 Series', 2020, 'KAY 123U', '5KJJF7D58LB123456', 'offline', 4900.00, 270.00, 4.8, 134, 1130000.00, true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '7 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde5', 'DL234567891', '2025-11-02', 'semi', 26000, 'Scania', 'P-Series', 2019, 'KCA 456V', '1FUJGHDV8KLBX5678', 'available', 8200.00, 380.00, 4.9, 387, 3400000.00, true, NOW() - INTERVAL '2 years', NOW() - INTERVAL '2.2 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde6', 'DL345678902', '2026-09-25', 'pickup', 1700, 'Isuzu', 'D-Max', 2022, 'KBZ 789W', '5FPYK3F59NB123456', 'available', 2750.00, 175.00, 4.7, 78, 258000.00, true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde7', 'DL456789013', '2027-02-11', 'refrigerated', 6500, 'Mitsubishi', 'Canter', 2021, 'KAY 012X', 'JL6DFE1A8LK123456', 'busy', 5400.00, 310.00, 4.8, 189, 1350000.00, true, NOW() - INTERVAL '1.4 years', NOW() - INTERVAL '1.6 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde8', 'DL567890124', '2025-12-04', 'box', 5800, 'Hino', '300 Series', 2020, 'KCA 345Y', 'ZCFC35A500S123456', 'available', 4100.00, 215.00, 4.6, 145, 830000.00, true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '9 months', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample customer users for testing (Kenyan names and phone numbers)
INSERT INTO users (id, email, name, phone, role, is_verified, is_active, password_hash, password_salt, created_at, updated_at) VALUES
  ('customer-001-89ab-cdef-0123-456789abcdef', 'alice.wanjiru@gmail.com', 'Alice Wanjiru', '+254-712-001-234', 'individual', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '3 months', NOW()),
  ('customer-002-89ab-cdef-0123-456789abcdef', 'bob.kiprotich@gmail.com', 'Bob Kiprotich', '+254-722-002-345', 'individual', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '2 months', NOW()),
  ('customer-003-89ab-cdef-0123-456789abcdef', 'carol.akinyi@gmail.com', 'Carol Akinyi', '+254-733-003-456', 'individual', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '4 months', NOW()),
  ('business-001-89ab-cdef-0123-456789abcdef', 'info@safaritechke.com', 'Safari Tech Kenya Ltd', '+254-720-100-200', 'business', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '6 months', NOW()),
  ('business-002-89ab-cdef-0123-456789abcdef', 'logistics@eastafricacorp.co.ke', 'East Africa Corp', '+254-730-200-300', 'business', true, true, '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOYz6TtxMQJqhN8/LewdBXudO9QGaIdGy', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCO', NOW() - INTERVAL '8 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert business profiles for business users
INSERT INTO businesses (
  id, user_id, company_name, business_type, website, 
  billing_address, billing_city, billing_state, billing_zip_code,
  credit_limit, payment_terms, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'business-001-89ab-cdef-0123-456789abcdef', 'Safari Tech Kenya Ltd', 'technology', 'https://safaritechke.com', 
   'Westlands Square, Westlands', 'Nairobi', 'Nairobi County', '00100', 2000000.00, 30, NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), 'business-002-89ab-cdef-0123-456789abcdef', 'East Africa Corp', 'logistics', 'https://eastafricacorp.co.ke',
   'Industrial Area, Mombasa Road', 'Nairobi', 'Nairobi County', '00200', 5000000.00, 15, NOW() - INTERVAL '8 months', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert Kenyan job locations
INSERT INTO job_locations (
  id, address, city, state, zip_code, country, 
  latitude, longitude, created_at
) VALUES
  (gen_random_uuid(), 'Westlands Square', 'Nairobi', 'Nairobi County', '00100', 'KE', -1.2921, 36.8219, NOW()),
  (gen_random_uuid(), 'Karen Shopping Centre', 'Nairobi', 'Nairobi County', '00502', 'KE', -1.3032, 36.7073, NOW()),
  (gen_random_uuid(), 'Industrial Area', 'Nairobi', 'Nairobi County', '00200', 'KE', -1.3197, 36.9275, NOW()),
  (gen_random_uuid(), 'Kileleshwa', 'Nairobi', 'Nairobi County', '00800', 'KE', -1.2634, 36.8155, NOW()),
  (gen_random_uuid(), 'Thika Road Mall', 'Nairobi', 'Nairobi County', '00232', 'KE', -1.2297, 36.8890, NOW()),
  (gen_random_uuid(), 'Mombasa Port', 'Mombasa', 'Mombasa County', '80100', 'KE', -4.0435, 39.6682, NOW()),
  (gen_random_uuid(), 'Kisumu Central', 'Kisumu', 'Kisumu County', '40100', 'KE', -0.0917, 34.7680, NOW()),
  (gen_random_uuid(), 'Nakuru Town', 'Nakuru', 'Nakuru County', '20100', 'KE', -0.3031, 36.0800, NOW()),
  (gen_random_uuid(), 'Eldoret CBD', 'Eldoret', 'Uasin Gishu County', '30100', 'KE', 0.5143, 35.2698, NOW()),
  (gen_random_uuid(), 'Thika Town', 'Thika', 'Kiambu County', '01000', 'KE', -1.0332, 37.0692, NOW()),
  (gen_random_uuid(), 'Machakos Town', 'Machakos', 'Machakos County', '90100', 'KE', -1.5177, 37.2634, NOW()),
  (gen_random_uuid(), 'Nyeri Town', 'Nyeri', 'Nyeri County', '10100', 'KE', -0.4167, 36.9500, NOW())
ON CONFLICT (id) DO NOTHING;

-- Create Kenyan pricing rules with KES rates
INSERT INTO pricing_rules (
  id, name, truck_type, base_rate, per_mile_rate, per_hour_rate, 
  minimum_charge, surge_multiplier, is_active, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'Pickup Truck Standard Kenya', 'pickup', 2000.00, 150.00, 2500.00, 3000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Box Truck Standard Kenya', 'box', 3500.00, 200.00, 3800.00, 5000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Flatbed Standard Kenya', 'flatbed', 4000.00, 250.00, 4500.00, 6000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Semi-Trailer Standard Kenya', 'semi', 7500.00, 400.00, 8500.00, 10000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Refrigerated Standard Kenya', 'refrigerated', 5000.00, 300.00, 5200.00, 7000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Weekend Surge Pricing Kenya', NULL, 0.00, 0.00, 0.00, 0.00, 1.3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Holiday Premium Kenya', NULL, 0.00, 0.00, 0.00, 0.00, 1.8, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample analytics events for Kenyan market
INSERT INTO analytics (
  id, user_id, event_type, event_data, session_id, created_at
) VALUES
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'driver_online', '{"location": {"lat": -1.2921, "lng": 36.8219, "city": "Nairobi"}}', 'session_001', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'job_completed', '{"job_id": "job_001", "earnings": 4500.00, "currency": "KES"}', 'session_002', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), 'customer-001-89ab-cdef-0123-456789abcdef', 'search_trucks', '{"truck_type": "pickup", "location": "Nairobi, Kenya"}', 'session_003', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), 'business-001-89ab-cdef-0123-456789abcdef', 'booking_created', '{"truck_type": "box", "amount": 9500.00, "currency": "KES"}', 'session_004', NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- Add user profiles for Kenyan users
INSERT INTO user_profiles (
    id, user_id, address, city, state, zip_code, country, preferences, created_at, updated_at
) 
SELECT 
    gen_random_uuid(),
    u.id,
    CASE 
        WHEN u.role = 'driver' THEN 'Drivers Estate, Nairobi'
        WHEN u.role = 'business' THEN 'Business District, Nairobi'
        ELSE 'Residential Area, Nairobi'
    END,
    'Nairobi',
    'Nairobi County',
    '00100',
    'KE',
    '{"notifications": {"email": true, "sms": true}, "language": "en", "currency": "KES"}'::jsonb,
    u.created_at,
    NOW()
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.user_id = u.id
)
LIMIT 30;

-- Create driver locations around Kenyan cities
INSERT INTO driver_locations (
    id, driver_id, latitude, longitude, heading, speed, accuracy, recorded_at, created_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    -1.2921 + (RANDOM() - 0.5) * 0.2, -- Random location around Nairobi
    36.8219 + (RANDOM() - 0.5) * 0.2,
    RANDOM() * 360, -- Random heading
    RANDOM() * 80, -- Random speed 0-80 km/h
    RANDOM() * 15 + 5, -- Random accuracy 5-20 meters
    NOW() - INTERVAL '5 minutes',
    NOW()
FROM users u
JOIN drivers d ON d.user_id = u.id
WHERE d.availability_status = 'available'
LIMIT 15;

-- Add notifications for Kenyan drivers
INSERT INTO notifications (
    id, user_id, type, title, message, data, is_read, created_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    'job_offer',
    'New Job Available in Nairobi',
    'A new pickup job is available in your area. Tap to view details.',
    '{"job_type": "pickup", "distance": "3.5 km", "estimated_earnings": "KES 2,800", "location": "Nairobi"}'::jsonb,
    RANDOM() > 0.5, -- Random read status
    NOW() - INTERVAL '30 minutes'
FROM users u
WHERE u.role = 'driver'
LIMIT 10;

-- Create sample jobs for testing with Kenyan locations and KES pricing
DO $$
DECLARE
    pickup_location_id UUID;
    dropoff_location_id UUID;
    customer_id UUID;
    driver_id UUID;
BEGIN
    -- Get Kenyan location IDs
    SELECT id INTO pickup_location_id FROM job_locations WHERE city = 'Nairobi' AND address = 'Westlands Square' LIMIT 1;
    SELECT id INTO dropoff_location_id FROM job_locations WHERE city = 'Nairobi' AND address = 'Industrial Area' LIMIT 1;
    
    -- Get a customer and driver
    SELECT id INTO customer_id FROM users WHERE role = 'individual' LIMIT 1;
    SELECT id INTO driver_id FROM users WHERE role = 'driver' LIMIT 1;
    
    -- Insert sample jobs if we have the required data
    IF pickup_location_id IS NOT NULL AND dropoff_location_id IS NOT NULL AND customer_id IS NOT NULL THEN
        INSERT INTO jobs (
            id, user_id, driver_id, pickup_location_id, dropoff_location_id,
            status, cargo_type, cargo_weight, cargo_description,
            scheduled_pickup_time, estimated_duration, distance_miles,
            estimated_price, final_price, urgency_level, requires_helper,
            is_fragile, notes, created_at, updated_at
        ) VALUES
            (gen_random_uuid(), customer_id, driver_id, pickup_location_id, dropoff_location_id,
             'completed', 'electronics', 150.00, 'Computer equipment for office setup',
             NOW() - INTERVAL '2 days', 120, 12.5, 6800.00, 6500.00, 2, false,
             true, 'Handle with care - expensive equipment', NOW() - INTERVAL '2 days', NOW()),
            (gen_random_uuid(), customer_id, NULL, pickup_location_id, dropoff_location_id,
             'posted', 'furniture', 800.00, 'Moving furniture to new apartment',
             NOW() + INTERVAL '2 hours', 180, 18.3, 9500.00, NULL, 1, true,
             false, 'Need help loading heavy items', NOW(), NOW());
    END IF;
END $$;

-- Update statistics for realistic Kenyan market patterns
UPDATE drivers SET 
    total_jobs = CASE 
        WHEN rating >= 4.8 THEN FLOOR(RANDOM() * 200 + 150)::integer
        WHEN rating >= 4.5 THEN FLOOR(RANDOM() * 150 + 100)::integer
        ELSE FLOOR(RANDOM() * 100 + 50)::integer
    END,
    total_earnings = CASE 
        WHEN rating >= 4.8 THEN FLOOR(RANDOM() * 2000000 + 1200000)::numeric -- KES 1.2M - 3.2M
        WHEN rating >= 4.5 THEN FLOOR(RANDOM() * 1200000 + 600000)::numeric   -- KES 600K - 1.8M
        ELSE FLOOR(RANDOM() * 600000 + 200000)::numeric                       -- KES 200K - 800K
    END
WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');

-- Update last login times for active drivers
UPDATE users SET last_login_at = NOW() - INTERVAL '1 hour' 
WHERE role = 'driver' AND id IN (
    SELECT user_id FROM drivers WHERE availability_status = 'available'
);

-- Update some drivers to busy/offline status for realism
UPDATE drivers SET availability_status = 'busy' 
WHERE truck_type = 'pickup' AND rating < 4.8 AND availability_status = 'available'
AND user_id IN (
    SELECT user_id FROM drivers 
    WHERE truck_type = 'pickup' AND rating < 4.8 AND availability_status = 'available'
    LIMIT 3
);

UPDATE drivers SET availability_status = 'offline' 
WHERE truck_type IN ('box', 'semi', 'flatbed') AND rating < 4.7 AND availability_status = 'available'
AND user_id IN (
    SELECT user_id FROM drivers 
    WHERE truck_type IN ('box', 'semi', 'flatbed') AND rating < 4.7 AND availability_status = 'available'
    LIMIT 3
);

-- Create user auth view (drop and recreate to avoid conflicts)
DROP VIEW IF EXISTS user_auth_info;
CREATE VIEW user_auth_info AS
SELECT 
  id,
  email,
  name,
  phone,
  role,
  is_verified,
  is_active,
  last_login_at,
  last_password_change,
  created_at,
  updated_at,
  CASE 
    WHEN password_reset_token IS NOT NULL AND password_reset_expires > now() 
    THEN true 
    ELSE false 
  END as has_active_reset_token
FROM users;

-- Grant permissions
GRANT SELECT ON user_auth_info TO authenticated;

-- Add RLS policy for password reset (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can manage own password reset tokens'
    ) THEN
        CREATE POLICY "Users can manage own password reset tokens" ON users
          FOR UPDATE
          TO authenticated
          USING (id = auth.uid())
          WITH CHECK (id = auth.uid());
    END IF;
END $$;

-- Add comments (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_description d 
        JOIN pg_class c ON d.objoid = c.oid 
        JOIN pg_attribute a ON d.objoid = a.attrelid AND d.objsubid = a.attnum
        WHERE c.relname = 'users' AND a.attname = 'password_hash'
    ) THEN
        COMMENT ON COLUMN users.password_hash IS 'Bcrypt hash of the user password';
        COMMENT ON COLUMN users.password_salt IS 'Salt used for password hashing';
        COMMENT ON COLUMN users.password_reset_token IS 'Token for password reset functionality';
        COMMENT ON COLUMN users.password_reset_expires IS 'Expiration time for password reset token';
        COMMENT ON COLUMN users.last_password_change IS 'Timestamp of last password change';
    END IF;
END $$;

-- Create indexes for better performance (if not already exists)
CREATE INDEX IF NOT EXISTS idx_drivers_availability_location ON drivers(availability_status) WHERE availability_status = 'available';
CREATE INDEX IF NOT EXISTS idx_drivers_truck_type_rating ON drivers(truck_type, rating DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_hourly_rate ON drivers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_drivers_per_mile_rate ON drivers(per_mile_rate);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_job_locations_coordinates ON job_locations(latitude, longitude);

-- Final verification and summary
DO $$
DECLARE
    driver_count INTEGER;
    customer_count INTEGER;
    business_count INTEGER;
    available_drivers INTEGER;
    kenyan_locations INTEGER;
BEGIN
    SELECT COUNT(*) INTO driver_count FROM users WHERE role = 'driver';
    SELECT COUNT(*) INTO customer_count FROM users WHERE role = 'individual';
    SELECT COUNT(*) INTO business_count FROM users WHERE role = 'business';
    SELECT COUNT(*) INTO available_drivers FROM drivers WHERE availability_status = 'available';
    SELECT COUNT(*) INTO kenyan_locations FROM job_locations WHERE country = 'KE';
    
    RAISE NOTICE 'Kenyan market database populated successfully!';
    RAISE NOTICE 'Total drivers: % (with Kenyan names and phone numbers)', driver_count;
    RAISE NOTICE 'Total customers: % (Kenyan users)', customer_count;
    RAISE NOTICE 'Total businesses: % (Kenyan companies)', business_count;
    RAISE NOTICE 'Available drivers: %', available_drivers;
    RAISE NOTICE 'Kenyan locations: %', kenyan_locations;
    RAISE NOTICE 'Currency: KES (Kenyan Shillings)';
    RAISE NOTICE 'Password fields added with security features';
    RAISE NOTICE 'Sample data includes: Kenyan drivers, trucks, customers, businesses, locations, KES pricing, and analytics';
END $$;