/*
  # Populate Database with Kenyan Market Data

  1. Sample Data Creation
    - Driver users with Kenyan names and phone numbers
    - Truck specifications with Kenyan license plates
    - Customer users for testing
    - Business profiles
    - Job locations across major Kenyan cities
    - Pricing rules in Kenyan Shillings (KES)
    - Sample analytics events

  2. Data Relationships
    - Users linked to driver profiles
    - Business users linked to business profiles
    - Realistic truck specifications for Kenyan market
    - Geographic distribution of drivers across Kenya

  3. Performance Optimization
    - Indexes for common queries
    - Updated statistics for realistic data
*/

-- First, let's create some sample driver users with Kenyan names
INSERT INTO users (id, email, name, phone, role, is_verified, is_active, created_at, updated_at) VALUES
  ('01234567-89ab-cdef-0123-456789abcdef', 'john.mwangi@email.com', 'John Mwangi', '+254-712-345-678', 'driver', true, true, NOW() - INTERVAL '6 months', NOW()),
  ('11234567-89ab-cdef-0123-456789abcdef', 'grace.wanjiku@email.com', 'Grace Wanjiku', '+254-722-456-789', 'driver', true, true, NOW() - INTERVAL '8 months', NOW()),
  ('21234567-89ab-cdef-0123-456789abcdef', 'peter.kiprotich@email.com', 'Peter Kiprotich', '+254-733-567-890', 'driver', true, true, NOW() - INTERVAL '4 months', NOW()),
  ('31234567-89ab-cdef-0123-456789abcdef', 'mary.achieng@email.com', 'Mary Achieng', '+254-744-678-901', 'driver', true, true, NOW() - INTERVAL '1 year', NOW()),
  ('41234567-89ab-cdef-0123-456789abcdef', 'samuel.mutua@email.com', 'Samuel Mutua', '+254-755-789-012', 'driver', true, true, NOW() - INTERVAL '2 years', NOW()),
  ('51234567-89ab-cdef-0123-456789abcdef', 'faith.njeri@email.com', 'Faith Njeri', '+254-766-890-123', 'driver', true, true, NOW() - INTERVAL '3 months', NOW()),
  ('61234567-89ab-cdef-0123-456789abcdef', 'david.otieno@email.com', 'David Otieno', '+254-777-901-234', 'driver', true, true, NOW() - INTERVAL '1.5 years', NOW()),
  ('71234567-89ab-cdef-0123-456789abcdef', 'esther.wambui@email.com', 'Esther Wambui', '+254-788-012-345', 'driver', true, true, NOW() - INTERVAL '9 months', NOW()),
  ('81234567-89ab-cdef-0123-456789abcdef', 'james.kipchoge@email.com', 'James Kipchoge', '+254-799-123-456', 'driver', true, true, NOW() - INTERVAL '7 months', NOW()),
  ('91234567-89ab-cdef-0123-456789abcdef', 'lucy.nyambura@email.com', 'Lucy Nyambura', '+254-701-234-567', 'driver', true, true, NOW() - INTERVAL '5 months', NOW()),
  ('a1234567-89ab-cdef-0123-456789abcdef', 'moses.kamau@email.com', 'Moses Kamau', '+254-712-345-678', 'driver', true, true, NOW() - INTERVAL '2.5 years', NOW()),
  ('b1234567-89ab-cdef-0123-456789abcdef', 'jane.wairimu@email.com', 'Jane Wairimu', '+254-723-456-789', 'driver', true, true, NOW() - INTERVAL '11 months', NOW()),
  ('c1234567-89ab-cdef-0123-456789abcdef', 'daniel.kiptoo@email.com', 'Daniel Kiptoo', '+254-734-567-890', 'driver', true, true, NOW() - INTERVAL '6 months', NOW()),
  ('d1234567-89ab-cdef-0123-456789abcdef', 'rose.wanjala@email.com', 'Rose Wanjala', '+254-745-678-901', 'driver', true, true, NOW() - INTERVAL '1.2 years', NOW()),
  ('e1234567-89ab-cdef-0123-456789abcdef', 'francis.ochieng@email.com', 'Francis Ochieng', '+254-756-789-012', 'driver', true, true, NOW() - INTERVAL '8 months', NOW()),
  ('f1234567-89ab-cdef-0123-456789abcdef', 'mercy.muthoni@email.com', 'Mercy Muthoni', '+254-767-890-123', 'driver', true, true, NOW() - INTERVAL '4 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde0', 'joseph.kimani@email.com', 'Joseph Kimani', '+254-778-901-234', 'driver', true, true, NOW() - INTERVAL '1.8 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde1', 'ann.chebet@email.com', 'Ann Chebet', '+254-789-012-345', 'driver', true, true, NOW() - INTERVAL '10 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde2', 'michael.wekesa@email.com', 'Michael Wekesa', '+254-700-123-456', 'driver', true, true, NOW() - INTERVAL '3 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde3', 'beatrice.nyong@email.com', 'Beatrice Nyong', '+254-711-234-567', 'driver', true, true, NOW() - INTERVAL '1.3 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde4', 'robert.macharia@email.com', 'Robert Macharia', '+254-722-345-678', 'driver', true, true, NOW() - INTERVAL '7 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde5', 'caroline.jepkoech@email.com', 'Caroline Jepkoech', '+254-733-456-789', 'driver', true, true, NOW() - INTERVAL '2.2 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde6', 'anthony.mbugua@email.com', 'Anthony Mbugua', '+254-744-567-890', 'driver', true, true, NOW() - INTERVAL '5 months', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde7', 'helen.chepkemoi@email.com', 'Helen Chepkemoi', '+254-755-678-901', 'driver', true, true, NOW() - INTERVAL '1.6 years', NOW()),
  ('01234567-89ab-cdef-0123-456789abcde8', 'patrick.mwenda@email.com', 'Patrick Mwenda', '+254-766-789-012', 'driver', true, true, NOW() - INTERVAL '9 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding driver profiles with Kenyan truck information and KES pricing
INSERT INTO drivers (
  id, user_id, license_number, license_expiry_date, truck_type, truck_capacity,
  truck_make, truck_model, truck_year, truck_plate_number, truck_vin,
  availability_status, hourly_rate, per_mile_rate, rating, total_jobs, total_earnings,
  is_background_checked, background_check_date, created_at, updated_at
) VALUES
  -- Pickup Trucks (Popular in Kenya)
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'DL123456789', '2026-12-31', 'pickup', 1500, 'Toyota', 'Hilux', 2022, 'KCA 123A', '1FTFW1ET5NFC12345', 'available', 2500.00, 150.00, 4.8, 156, 650000.00, true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'DL234567890', '2027-03-15', 'pickup', 1200, 'Isuzu', 'D-Max', 2023, 'KBZ 456B', '3TMCZ5AN5NM123456', 'available', 2800.00, 170.00, 4.9, 203, 980000.00, true, NOW() - INTERVAL '7 months', NOW() - INTERVAL '8 months', NOW()),
  (gen_random_uuid(), '21234567-89ab-cdef-0123-456789abcdef', 'DL345678901', '2025-08-20', 'pickup', 1800, 'Mitsubishi', 'L200', 2021, 'KAY 789C', '1GCUYDED5MZ123456', 'busy', 2300.00, 140.00, 4.7, 89, 470000.00, true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 months', NOW()),
  (gen_random_uuid(), '31234567-89ab-cdef-0123-456789abcdef', 'DL456789012', '2026-06-10', 'pickup', 2000, 'Ford', 'Ranger', 2020, 'KBX 012D', '1C6SRFFT4LN123456', 'available', 2600.00, 160.00, 4.6, 134, 820000.00, true, NOW() - INTERVAL '11 months', NOW() - INTERVAL '1 year', NOW()),
  (gen_random_uuid(), '41234567-89ab-cdef-0123-456789abcdef', 'DL567890123', '2025-11-25', 'pickup', 1400, 'Nissan', 'Navara', 2022, 'KCB 345E', '1N6AD0EV4NN123456', 'available', 2400.00, 145.00, 4.9, 287, 1500000.00, true, NOW() - INTERVAL '1.8 years', NOW() - INTERVAL '2 years', NOW()),

  -- Box Trucks (Common for urban deliveries)
  (gen_random_uuid(), '51234567-89ab-cdef-0123-456789abcdef', 'DL678901234', '2027-01-12', 'box', 5000, 'Isuzu', 'NPR', 2021, 'KCD 678F', '54DC4W1B8LS123456', 'available', 3800.00, 200.00, 4.8, 98, 860000.00, true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 months', NOW()),
  (gen_random_uuid(), '61234567-89ab-cdef-0123-456789abcdef', 'DL789012345', '2026-09-05', 'box', 6000, 'Mitsubishi', 'Canter', 2020, 'KCE 901G', '1FDWE3FL4LDA12345', 'available', 4200.00, 220.00, 4.7, 178, 1290000.00, true, NOW() - INTERVAL '1.2 years', NOW() - INTERVAL '1.5 years', NOW()),
  (gen_random_uuid(), '71234567-89ab-cdef-0123-456789abcdef', 'DL890123456', '2025-12-18', 'box', 4500, 'Hino', '300 Series', 2022, 'KCF 234H', 'WD3PE8CC5NP123456', 'offline', 3600.00, 190.00, 4.9, 145, 1040000.00, true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '9 months', NOW()),
  (gen_random_uuid(), '81234567-89ab-cdef-0123-456789abcdef', 'DL901234567', '2026-04-22', 'box', 5500, 'Tata', 'Ultra', 2021, 'KCG 567I', '1GB0G2CL8M1123456', 'available', 3900.00, 210.00, 4.6, 112, 900000.00, true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '7 months', NOW()),

  -- Flatbed Trucks (Construction and heavy cargo)
  (gen_random_uuid(), '91234567-89ab-cdef-0123-456789abcdef', 'DL012345678', '2027-02-28', 'flatbed', 8000, 'Mitsubishi', 'Canter', 2020, 'KCH 890J', '1FUJGHDV8LLBX1234', 'available', 4500.00, 250.00, 4.8, 167, 1700000.00, true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 months', NOW()),
  (gen_random_uuid(), 'a1234567-89ab-cdef-0123-456789abcdef', 'DL123456780', '2025-10-14', 'flatbed', 10000, 'Isuzu', 'FVZ', 2019, 'KCI 123K', '1XPWD40X1KD123456', 'busy', 5200.00, 280.00, 4.9, 298, 2550000.00, true, NOW() - INTERVAL '2.2 years', NOW() - INTERVAL '2.5 years', NOW()),
  (gen_random_uuid(), 'b1234567-89ab-cdef-0123-456789abcdef', 'DL234567801', '2026-07-08', 'flatbed', 9000, 'Hino', '500 Series', 2021, 'KCJ 456L', '1XKWD40X1LJ123456', 'available', 4800.00, 260.00, 4.7, 189, 2030000.00, true, NOW() - INTERVAL '10 months', NOW() - INTERVAL '11 months', NOW()),

  -- Semi-Trailers (Long distance transport)
  (gen_random_uuid(), 'c1234567-89ab-cdef-0123-456789abcdef', 'DL345678012', '2025-05-30', 'semi', 25000, 'Scania', 'R-Series', 2020, 'KCK 789M', '4V4NC9EH8LN123456', 'available', 7500.00, 350.00, 4.8, 234, 3440000.00, true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), 'd1234567-89ab-cdef-0123-456789abcdef', 'DL456789023', '2026-11-16', 'semi', 30000, 'Mercedes', 'Actros', 2021, 'KCL 012N', '1M1AW07Y8LM123456', 'offline', 8200.00, 380.00, 4.9, 312, 4130000.00, true, NOW() - INTERVAL '1 year', NOW() - INTERVAL '1.2 years', NOW()),
  (gen_random_uuid(), 'e1234567-89ab-cdef-0123-456789abcdef', 'DL567890134', '2027-01-03', 'semi', 28000, 'Volvo', 'FH', 2022, 'KCM 345O', '1HSDJSJR5NN123456', 'available', 7800.00, 360.00, 4.6, 156, 2740000.00, true, NOW() - INTERVAL '7 months', NOW() - INTERVAL '8 months', NOW()),

  -- Refrigerated Trucks (Cold chain logistics)
  (gen_random_uuid(), 'f1234567-89ab-cdef-0123-456789abcdef', 'DL678901245', '2026-03-21', 'refrigerated', 6000, 'Hino', '300 Series', 2021, 'KCN 678P', '1FUJGHDV8MLBX1234', 'available', 5200.00, 300.00, 4.8, 87, 1030000.00, true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde0', 'DL789012356', '2025-09-12', 'refrigerated', 8000, 'Mitsubishi', 'Canter', 2020, 'KCO 901Q', '1FUJGHDV8KLBX1234', 'busy', 5800.00, 320.00, 4.9, 198, 2240000.00, true, NOW() - INTERVAL '1.5 years', NOW() - INTERVAL '1.8 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde1', 'DL890123467', '2026-12-07', 'refrigerated', 7000, 'Isuzu', 'FVZ', 2022, 'KCP 234R', '1UYVS2538NL123456', 'available', 5500.00, 310.00, 4.7, 124, 1520000.00, true, NOW() - INTERVAL '9 months', NOW() - INTERVAL '10 months', NOW()),

  -- Additional Mixed Types
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde2', 'DL901234578', '2027-04-15', 'pickup', 1600, 'Toyota', 'Hilux', 2023, 'KCQ 567S', '1GTU9EED5NZ123456', 'available', 2700.00, 165.00, 4.6, 45, 204000.00, true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde3', 'DL012345689', '2025-08-28', 'box', 5200, 'Isuzu', 'NPR', 2021, 'KCR 890T', '5PVNE8JF8M4123456', 'available', 4000.00, 215.00, 4.9, 167, 1230000.00, true, NOW() - INTERVAL '1.1 years', NOW() - INTERVAL '1.3 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde4', 'DL123456790', '2026-06-19', 'flatbed', 9500, 'Hino', '500 Series', 2020, 'KCS 123U', '5KJJF7D58LB123456', 'offline', 4900.00, 270.00, 4.8, 134, 1560000.00, true, NOW() - INTERVAL '6 months', NOW() - INTERVAL '7 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde5', 'DL234567891', '2025-11-02', 'semi', 26000, 'Scania', 'P-Series', 2019, 'KCT 456V', '1FUJGHDV8KLBX5678', 'available', 7200.00, 340.00, 4.9, 387, 4700000.00, true, NOW() - INTERVAL '2 years', NOW() - INTERVAL '2.2 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde6', 'DL345678902', '2026-09-25', 'pickup', 1700, 'Mitsubishi', 'L200', 2022, 'KCU 789W', '5FPYK3F59NB123456', 'available', 2650.00, 155.00, 4.7, 78, 355000.00, true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 months', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde7', 'DL456789013', '2027-02-11', 'refrigerated', 6500, 'Hino', '300 Series', 2021, 'KCV 012X', 'JL6DFE1A8LK123456', 'busy', 5400.00, 305.00, 4.8, 189, 1870000.00, true, NOW() - INTERVAL '1.4 years', NOW() - INTERVAL '1.6 years', NOW()),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcde8', 'DL567890124', '2025-12-04', 'box', 5800, 'Tata', 'Ultra', 2020, 'KCW 345Y', 'ZCFC35A500S123456', 'available', 4100.00, 225.00, 4.6, 145, 1145000.00, true, NOW() - INTERVAL '8 months', NOW() - INTERVAL '9 months', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample customer users for testing with Kenyan context
INSERT INTO users (id, email, name, phone, role, is_verified, is_active, created_at, updated_at) VALUES
  ('customer-001-89ab-cdef-0123-456789abcdef', 'alice.wanjiru@email.com', 'Alice Wanjiru', '+254-701-234-567', 'individual', true, true, NOW() - INTERVAL '3 months', NOW()),
  ('customer-002-89ab-cdef-0123-456789abcdef', 'bob.kiprotich@email.com', 'Bob Kiprotich', '+254-712-345-678', 'individual', true, true, NOW() - INTERVAL '2 months', NOW()),
  ('customer-003-89ab-cdef-0123-456789abcdef', 'carol.nyambura@email.com', 'Carol Nyambura', '+254-723-456-789', 'individual', true, true, NOW() - INTERVAL '4 months', NOW()),
  ('business-001-89ab-cdef-0123-456789abcdef', 'info@safaricomke.com', 'Safaricom Kenya Ltd', '+254-722-000-000', 'business', true, true, NOW() - INTERVAL '6 months', NOW()),
  ('business-002-89ab-cdef-0123-456789abcdef', 'logistics@eastafricanbreweries.com', 'East African Breweries Ltd', '+254-733-111-111', 'business', true, true, NOW() - INTERVAL '8 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert business profiles for business users with Kenyan companies
INSERT INTO businesses (
  id, user_id, company_name, business_type, website, 
  billing_address, billing_city, billing_state, billing_zip_code,
  credit_limit, payment_terms, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'business-001-89ab-cdef-0123-456789abcdef', 'Safaricom Kenya Ltd', 'telecommunications', 'https://safaricom.co.ke', 
   'Safaricom House, Waiyaki Way', 'Nairobi', 'Nairobi County', '00100', 2500000.00, 30, NOW() - INTERVAL '6 months', NOW()),
  (gen_random_uuid(), 'business-002-89ab-cdef-0123-456789abcdef', 'East African Breweries Ltd', 'manufacturing', 'https://eabl.com',
   'Ruaraka Brewery, Thika Road', 'Nairobi', 'Nairobi County', '00618', 5000000.00, 15, NOW() - INTERVAL '8 months', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample job locations for major Kenyan cities
INSERT INTO job_locations (
  id, address, city, state, zip_code, country, 
  latitude, longitude, created_at
) VALUES
  (gen_random_uuid(), 'Westlands, Nairobi', 'Nairobi', 'Nairobi County', '00100', 'KE', -1.2921, 36.8219, NOW()),
  (gen_random_uuid(), 'Karen, Nairobi', 'Nairobi', 'Nairobi County', '00502', 'KE', -1.3032, 36.7073, NOW()),
  (gen_random_uuid(), 'Industrial Area, Nairobi', 'Nairobi', 'Nairobi County', '00200', 'KE', -1.3197, 36.9275, NOW()),
  (gen_random_uuid(), 'Kileleshwa, Nairobi', 'Nairobi', 'Nairobi County', '00800', 'KE', -1.2634, 36.8155, NOW()),
  (gen_random_uuid(), 'CBD, Nairobi', 'Nairobi', 'Nairobi County', '00100', 'KE', -1.2864, 36.8172, NOW()),
  (gen_random_uuid(), 'Thika Road, Nairobi', 'Nairobi', 'Nairobi County', '00232', 'KE', -1.2297, 36.8890, NOW()),
  (gen_random_uuid(), 'Mombasa Road, Nairobi', 'Nairobi', 'Nairobi County', '00100', 'KE', -1.3197, 36.9275, NOW()),
  (gen_random_uuid(), 'Mombasa Island', 'Mombasa', 'Mombasa County', '80100', 'KE', -4.0435, 39.6682, NOW()),
  (gen_random_uuid(), 'Kisumu City', 'Kisumu', 'Kisumu County', '40100', 'KE', -0.0917, 34.7680, NOW()),
  (gen_random_uuid(), 'Nakuru Town', 'Nakuru', 'Nakuru County', '20100', 'KE', -0.3031, 36.0800, NOW()),
  (gen_random_uuid(), 'Eldoret Town', 'Eldoret', 'Uasin Gishu County', '30100', 'KE', 0.5143, 35.2698, NOW()),
  (gen_random_uuid(), 'Thika Town', 'Thika', 'Kiambu County', '01000', 'KE', -1.0332, 37.0692, NOW())
ON CONFLICT (id) DO NOTHING;

-- Create some sample pricing rules with KES pricing
INSERT INTO pricing_rules (
  id, name, truck_type, base_rate, per_mile_rate, per_hour_rate, 
  minimum_charge, surge_multiplier, is_active, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'Pickup Truck Standard', 'pickup', 2000.00, 150.00, 2500.00, 4000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Box Truck Standard', 'box', 3500.00, 200.00, 3800.00, 7000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Flatbed Standard', 'flatbed', 4200.00, 250.00, 4500.00, 8500.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Semi-Trailer Standard', 'semi', 7000.00, 350.00, 7500.00, 14000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Refrigerated Standard', 'refrigerated', 5000.00, 300.00, 5200.00, 10000.00, 1.0, true, NOW(), NOW()),
  (gen_random_uuid(), 'Weekend Surge Pricing', NULL, 0.00, 0.00, 0.00, 0.00, 1.5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Holiday Premium', NULL, 0.00, 0.00, 0.00, 0.00, 2.0, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add some sample analytics events
INSERT INTO analytics (
  id, user_id, event_type, event_data, session_id, created_at
) VALUES
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'driver_online', '{"location": {"lat": -1.2921, "lng": 36.8219}}', 'session_001', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'job_completed', '{"job_id": "job_001", "earnings": 6500}', 'session_002', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), 'customer-001-89ab-cdef-0123-456789abcdef', 'search_trucks', '{"truck_type": "pickup", "location": "Nairobi, Kenya"}', 'session_003', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), 'business-001-89ab-cdef-0123-456789abcdef', 'booking_created', '{"truck_type": "box", "amount": 13000}', 'session_004', NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance (if not already exists)
CREATE INDEX IF NOT EXISTS idx_drivers_availability_location ON drivers(availability_status) WHERE availability_status = 'available';
CREATE INDEX IF NOT EXISTS idx_drivers_truck_type_rating ON drivers(truck_type, rating DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_hourly_rate ON drivers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_drivers_per_mile_rate ON drivers(per_mile_rate);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_job_locations_coordinates ON job_locations(latitude, longitude);

-- Update user profiles with last login times for active drivers
UPDATE users SET last_login_at = NOW() - INTERVAL '1 hour' 
WHERE role = 'driver' AND id IN (
    SELECT user_id FROM drivers WHERE availability_status = 'available'
);

-- Update some drivers to busy status for realism
UPDATE drivers SET availability_status = 'busy' 
WHERE truck_type = 'pickup' AND rating < 4.8 AND availability_status = 'available'
AND user_id IN (
    SELECT user_id FROM drivers 
    WHERE truck_type = 'pickup' AND rating < 4.8 AND availability_status = 'available'
    LIMIT 3
);

-- Update some drivers to offline status
UPDATE drivers SET availability_status = 'offline' 
WHERE truck_type IN ('box', 'semi', 'flatbed') AND rating < 4.7 AND availability_status = 'available'
AND user_id IN (
    SELECT user_id FROM drivers 
    WHERE truck_type IN ('box', 'semi', 'flatbed') AND rating < 4.7 AND availability_status = 'available'
    LIMIT 3
);

-- Final statistics update based on realistic patterns for Kenyan market
UPDATE drivers SET 
    total_jobs = CASE 
        WHEN rating >= 4.8 THEN FLOOR(RANDOM() * 200 + 150)::integer
        WHEN rating >= 4.5 THEN FLOOR(RANDOM() * 150 + 100)::integer
        ELSE FLOOR(RANDOM() * 100 + 50)::integer
    END,
    total_earnings = CASE 
        WHEN rating >= 4.8 THEN FLOOR(RANDOM() * 2500000 + 1500000)::numeric
        WHEN rating >= 4.5 THEN FLOOR(RANDOM() * 1500000 + 750000)::numeric
        ELSE FLOOR(RANDOM() * 750000 + 250000)::numeric
    END
WHERE user_id IN (SELECT id FROM users WHERE role = 'driver');

-- Add some user profiles for better user experience
INSERT INTO user_profiles (
    id, user_id, address, city, state, zip_code, country, preferences, created_at, updated_at
) 
SELECT 
    gen_random_uuid(),
    u.id,
    CASE 
        WHEN u.role = 'driver' THEN 'Kiambu Road, Nairobi'
        WHEN u.role = 'business' THEN 'Westlands, Nairobi'
        ELSE 'Karen, Nairobi'
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

-- Create some sample driver locations for real-time tracking around Nairobi
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
    RANDOM() * 10 + 5, -- Random accuracy 5-15 meters
    NOW() - INTERVAL '5 minutes',
    NOW()
FROM users u
JOIN drivers d ON d.user_id = u.id
WHERE d.availability_status = 'available'
LIMIT 15;

-- Add some notifications for drivers
INSERT INTO notifications (
    id, user_id, type, title, message, data, is_read, created_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    'job_offer',
    'New Job Available',
    'A new pickup job is available in your area. Tap to view details.',
    '{"job_type": "pickup", "distance": "3.7 km", "estimated_earnings": "KES 2,400"}'::jsonb,
    RANDOM() > 0.5, -- Random read status
    NOW() - INTERVAL '30 minutes'
FROM users u
WHERE u.role = 'driver'
LIMIT 10;

-- Create some sample jobs for testing with Kenyan locations and KES pricing
DO $$
DECLARE
    pickup_location_id UUID;
    dropoff_location_id UUID;
    customer_id UUID;
    driver_id UUID;
BEGIN
    -- Get some location IDs
    SELECT id INTO pickup_location_id FROM job_locations WHERE city = 'Nairobi' LIMIT 1;
    SELECT id INTO dropoff_location_id FROM job_locations WHERE city = 'Mombasa' LIMIT 1;
    
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
             NOW() - INTERVAL '2 days', 120, 8.5, 9500.00, 9200.00, 2, false,
             true, 'Handle with care - expensive equipment', NOW() - INTERVAL '2 days', NOW()),
            (gen_random_uuid(), customer_id, NULL, pickup_location_id, dropoff_location_id,
             'posted', 'furniture', 800.00, 'Moving furniture to new apartment',
             NOW() + INTERVAL '2 hours', 180, 12.3, 13200.00, NULL, 1, true,
             false, 'Need help loading heavy items', NOW(), NOW());
    END IF;
END $$;

-- Final verification and summary
DO $$
DECLARE
    driver_count INTEGER;
    customer_count INTEGER;
    business_count INTEGER;
    available_drivers INTEGER;
BEGIN
    SELECT COUNT(*) INTO driver_count FROM users WHERE role = 'driver';
    SELECT COUNT(*) INTO customer_count FROM users WHERE role = 'individual';
    SELECT COUNT(*) INTO business_count FROM users WHERE role = 'business';
    SELECT COUNT(*) INTO available_drivers FROM drivers WHERE availability_status = 'available';
    
    RAISE NOTICE 'Kenyan market database populated successfully!';
    RAISE NOTICE 'Total drivers: %', driver_count;
    RAISE NOTICE 'Total customers: %', customer_count;
    RAISE NOTICE 'Total businesses: %', business_count;
    RAISE NOTICE 'Available drivers: %', available_drivers;
    RAISE NOTICE 'Sample data includes: Kenyan drivers, trucks with KE plates, customers, businesses, locations across Kenya, pricing in KES, and analytics';
END $$;