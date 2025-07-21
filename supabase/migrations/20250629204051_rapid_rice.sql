/*
  # Allow User Registration

  1. New Policies
    - Allow authenticated users to insert records with their own ID
    - Allow anonymous users to insert records during registration
    
  2. Security
    - Maintains existing RLS policies for SELECT and UPDATE operations
    - Only allows insertion of records, not modification of existing ones
*/

-- Add policy to allow user registration (INSERT for new users)
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow anon users to insert during the brief moment of registration
CREATE POLICY "Allow anonymous user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);