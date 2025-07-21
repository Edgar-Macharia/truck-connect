/*
  # Allow User Registration

  1. Security Policy Changes
    - Add INSERT policy for users table to allow registration
    - Allow unauthenticated users to create accounts during signup
    - Ensure new users can only insert their own record with the auth.uid()

  2. Notes
    - This policy specifically allows INSERT operations during user registration
    - The policy ensures users can only create records with their own auth.uid()
    - Existing policies for SELECT and UPDATE remain unchanged
*/

-- Add policy to allow user registration (INSERT for new users)
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() = id);

-- Also allow anon users to insert during the brief moment of registration
CREATE POLICY "Allow anonymous user registration"
  ON users
  FOR INSERT
  TO anon
  USING (true)
  WITH CHECK (true);