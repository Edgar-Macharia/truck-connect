import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Set a temporary user immediately to allow dashboard to render
          setTemporaryUser(session.user);
          // Then fetch the full profile in the background
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          setProfileLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          // Clear any previous state first
          setUser(null);
          setLoading(true);
          // Set temporary user immediately
          setTemporaryUser(session.user);
          // Fetch full profile in background
          await fetchUserProfile(session.user);
          return;
        }

        if (session?.user) {
          // Set temporary user immediately
          setTemporaryUser(session.user);
          // Fetch full profile in background
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
          setProfileLoading(false);
        }
      } catch (error) {
        setUser(null);
        setLoading(false);
        setProfileLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setTemporaryUser = (authUser: SupabaseUser) => {
    // Create a temporary user object to allow immediate dashboard access
    const tempUser: User = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      phone: authUser.user_metadata?.phone || '',
      type: authUser.user_metadata?.role || 'individual',
      avatar: authUser.user_metadata?.avatar_url,
      verified: authUser.email_confirmed_at ? true : false,
      rating: 5.0,
      totalJobs: 0,
      createdAt: new Date().toISOString(),
    };
    
    setUser(tempUser);
    setLoading(false); // Allow dashboard to render immediately
  };

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      setProfileLoading(true);
      
      // Use maybeSingle() to handle cases where user might not exist
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('id, name, email, phone, role, avatar_url, is_verified, created_at')
        .eq('id', authUser.id)
        .maybeSingle();

      // Handle actual database errors (not "no rows found")
      if (error) {
        // Keep the temporary user if there's a database error
        return;
      }

      // If user profile exists, update with full profile
      if (userProfile) {
        const user: User = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone || '',
          type: userProfile.role,
          avatar: userProfile.avatar_url,
          verified: userProfile.is_verified,
          rating: 5.0,
          totalJobs: 0,
          createdAt: userProfile.created_at,
        };
        setUser(user);

        // Update last login (don't await this)
        supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', authUser.id)
          .then(({ error: updateError }) => {
            // Silently handle update errors
          });
      } else {
        // No user profile found (userProfile is null), create one
        const insertData = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          phone: authUser.user_metadata?.phone || null,
          role: authUser.user_metadata?.role || 'individual',
          avatar_url: authUser.user_metadata?.avatar_url || null,
          is_verified: authUser.email_confirmed_at ? true : false,
          password_hash: 'managed_by_supabase_auth',
          password_salt: 'managed_by_supabase_auth'
        };
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert(insertData)
          .select('id, name, email, phone, role, avatar_url, is_verified, created_at')
          .single();

        if (insertError) {
          // Keep the temporary user if insert fails
          return;
        }

        if (newUser) {
          const user: User = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || '',
            type: newUser.role,
            avatar: newUser.avatar_url,
            verified: newUser.is_verified,
            rating: 5.0,
            totalJobs: 0,
            createdAt: newUser.created_at,
          };
          setUser(user);
        }
      }
    } catch (error) {
      // Keep the temporary user even on unexpected error
    } finally {
      setProfileLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      name: string;
      phone?: string;
      role: 'individual' | 'business' | 'driver';
      companyName?: string;
      businessType?: string;
      licenseNumber?: string;
      truckType?: string;
      truckCapacity?: number;
    }
  ) => {
    try {
      setLoading(true);

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: userData.role === 'business' ? userData.companyName || userData.name : userData.name,
          phone: userData.phone,
          role: userData.role,
          is_verified: false,
          password_hash: 'managed_by_supabase_auth',
          password_salt: 'managed_by_supabase_auth'
        });

      if (profileError) {
        // Don't throw here as the auth user was created successfully
      }

      // Create role-specific profile (only for business or driver)
      if (userData.role === 'business' && userData.companyName) {
        const { error: businessError } = await supabase
          .from('businesses')
          .insert({
            user_id: authData.user.id,
            company_name: userData.companyName,
            business_type: userData.businessType,
          });

        if (businessError) {
          // Silently handle business profile creation error
        }
      }

      if (userData.role === 'driver' && userData.licenseNumber) {
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            user_id: authData.user.id,
            license_number: userData.licenseNumber,
            license_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            truck_type: userData.truckType || 'pickup',
            truck_capacity: userData.truckCapacity || 2000,
            availability_status: 'offline',
            hourly_rate: 45,
            per_mile_rate: 2.5,
            rating: 5.0,
            total_jobs: 0,
            total_earnings: 0,
            is_background_checked: false,
          });

        if (driverError) {
          // Silently handle driver profile creation error
        }
      }

      return { user: authData.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      // The auth state change listener will handle setting temporary user
      // and fetching the full profile in the background
      
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately to prevent any UI delays
      setUser(null);
      setLoading(false);
      setProfileLoading(false);
      
      // Sign out from Supabase - this will trigger the auth state change listener
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out locally, not from all sessions
      });
      
      if (error) {
        // Even if there's an error, we've already cleared the local state
        // This ensures the user is logged out from the UI perspective
      }
      
      return { error: null };
    } catch (error: any) {
      // Even on error, ensure user is logged out locally
      setUser(null);
      setLoading(false);
      setProfileLoading(false);
      return { error: error.message };
    }
  };

  return {
    user,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
  };
};