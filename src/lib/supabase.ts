import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          role: 'individual' | 'business' | 'driver' | 'admin';
          name: string;
          avatar_url: string | null;
          is_verified: boolean;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          password_hash: string;
          password_salt: string;
          password_reset_token: string | null;
          password_reset_expires: string | null;
          last_password_change: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          role?: 'individual' | 'business' | 'driver' | 'admin';
          name: string;
          avatar_url?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          password_hash: string;
          password_salt: string;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          last_password_change?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          role?: 'individual' | 'business' | 'driver' | 'admin';
          name?: string;
          avatar_url?: string | null;
          is_verified?: boolean;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          password_hash?: string;
          password_salt?: string;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          last_password_change?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          tax_id: string | null;
          business_type: string | null;
          website: string | null;
          billing_address: string | null;
          billing_city: string | null;
          billing_state: string | null;
          billing_zip_code: string | null;
          business_document_url: string | null;
          credit_limit: number | null;
          payment_terms: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          tax_id?: string | null;
          business_type?: string | null;
          website?: string | null;
          billing_address?: string | null;
          billing_city?: string | null;
          billing_state?: string | null;
          billing_zip_code?: string | null;
          business_document_url?: string | null;
          credit_limit?: number | null;
          payment_terms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          tax_id?: string | null;
          business_type?: string | null;
          website?: string | null;
          billing_address?: string | null;
          billing_city?: string | null;
          billing_state?: string | null;
          billing_zip_code?: string | null;
          business_document_url?: string | null;
          credit_limit?: number | null;
          payment_terms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          license_number: string;
          license_expiry_date: string;
          truck_type: 'pickup' | 'box' | 'flatbed' | 'semi' | 'refrigerated' | 'other';
          truck_capacity: number;
          truck_make: string | null;
          truck_model: string | null;
          truck_year: number | null;
          truck_plate_number: string | null;
          truck_vin: string | null;
          license_document_url: string | null;
          insurance_document_url: string | null;
          truck_registration_url: string | null;
          availability_status: 'available' | 'busy' | 'offline';
          hourly_rate: number | null;
          per_mile_rate: number | null;
          rating: number;
          total_jobs: number;
          total_earnings: number;
          is_background_checked: boolean;
          background_check_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          license_number: string;
          license_expiry_date: string;
          truck_type: 'pickup' | 'box' | 'flatbed' | 'semi' | 'refrigerated' | 'other';
          truck_capacity: number;
          truck_make?: string | null;
          truck_model?: string | null;
          truck_year?: number | null;
          truck_plate_number?: string | null;
          truck_vin?: string | null;
          license_document_url?: string | null;
          insurance_document_url?: string | null;
          truck_registration_url?: string | null;
          availability_status?: 'available' | 'busy' | 'offline';
          hourly_rate?: number | null;
          per_mile_rate?: number | null;
          rating?: number;
          total_jobs?: number;
          total_earnings?: number;
          is_background_checked?: boolean;
          background_check_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          license_number?: string;
          license_expiry_date?: string;
          truck_type?: 'pickup' | 'box' | 'flatbed' | 'semi' | 'refrigerated' | 'other';
          truck_capacity?: number;
          truck_make?: string | null;
          truck_model?: string | null;
          truck_year?: number | null;
          truck_plate_number?: string | null;
          truck_vin?: string | null;
          license_document_url?: string | null;
          insurance_document_url?: string | null;
          truck_registration_url?: string | null;
          availability_status?: 'available' | 'busy' | 'offline';
          hourly_rate?: number | null;
          per_mile_rate?: number | null;
          rating?: number;
          total_jobs?: number;
          total_earnings?: number;
          is_background_checked?: boolean;
          background_check_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}