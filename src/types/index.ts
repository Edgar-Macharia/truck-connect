export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business' | 'driver';
  avatar?: string;
  verified: boolean;
  rating: number;
  totalJobs: number;
  createdAt: string;
}

export interface Driver extends User {
  type: 'driver';
  licenseNumber: string;
  truckSpecs: TruckSpecs;
  availability: DriverAvailability;
  earnings: number;
  completedJobs: number;
}

export interface TruckSpecs {
  type: 'pickup' | 'box' | 'flatbed' | 'semi' | 'refrigerated' | 'double_cab' | 'dry_van';
  capacity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  licensePlate: string;
  year: number;
  make: string;
  model: string;
}

export interface DriverAvailability {
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Job {
  id: string;
  userId: string;
  driverId?: string;
  status: 'posted' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
  pickup: Location;
  dropoff: Location;
  cargo: CargoDetails;
  scheduledTime: string;
  estimatedDuration: number;
  price: number; // In KES (Kenyan Shillings)
  bookingType?: 'hourly' | 'daily';
  durationHours?: number;
  createdAt: string;
  completedAt?: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
  instructions?: string;
}

export interface CargoDetails {
  type: string;
  weight: number; // In kg
  description: string;
  specialRequirements?: string[];
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number; // In KES
  method: 'card' | 'wallet' | 'invoice';
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  jobId: string;
  raterId: string;
  ratedId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'job_offer' | 'status_update' | 'payment' | 'rating';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AvailableTruck {
  id: string;
  driverId: string;
  driver: {
    name: string;
    rating: number;
    totalJobs: number;
    phone: string;
    avatar?: string;
  };
  truck: {
    type: 'pickup' | 'box' | 'flatbed' | 'semi' | 'refrigerated' | 'double_cab' | 'dry_van';
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    capacity: number; // In kg
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedArrival: number; // minutes
  hourlyRate: number; // KES per hour
  dailyRate: number; // KES per day
  perMileRate: number; // KES per km
  availability: 'available' | 'busy' | 'offline';
}

export interface BookingRequest {
  pickupLocation: Location;
  dropoffLocation: Location;
  cargo: CargoDetails;
  scheduledTime: string;
  bookingType: 'hourly' | 'daily';
  durationHours: number;
  specialRequirements?: string[];
  notes?: string;
}

export interface TruckFilter {
  type: string;
  minCapacity: number;
  maxCapacity: number;
  minRating: number;
  searchRadius: number;
  bookingType: 'hourly' | 'daily';
}

export interface PricingRule {
  id: string;
  truckType: string;
  bookingType: 'hourly' | 'daily';
  baseRate: number; // KES
  perKmRate: number; // KES
  createdAt: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  userId: string;
  amount: number; // In KES
  pdfUrl: string;
  status: 'pending' | 'paid' | 'disputed';
  breakdown: {
    baseRate: number; // KES
    distanceFee: number; // KES
    platformFee: number; // KES
    taxes: number; // KES (VAT 16%)
    total: number; // KES
  };
  createdAt: string;
}

export interface SearchCriteria {
  pickupLocation: string;
  pickupCoords?: { lat: number; lng: number };
  truckType: string;
  bookingType: 'hourly' | 'daily';
  durationHours: number;
  minCapacity: number; // In kg
  minRating: number;
  searchRadius: number; // In km
}