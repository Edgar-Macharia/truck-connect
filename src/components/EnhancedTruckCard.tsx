import React from 'react';
import { 
  Truck, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  Package,
  Ruler,
  Calendar,
  DollarSign
} from 'lucide-react';
import { AvailableTruck, SearchCriteria } from '../types';

interface EnhancedTruckCardProps {
  truck: AvailableTruck;
  searchCriteria: SearchCriteria;
  onRequestService: (truck: AvailableTruck) => void;
  userLocation?: { lat: number; lng: number };
}

const EnhancedTruckCard: React.FC<EnhancedTruckCardProps> = ({ 
  truck, 
  searchCriteria,
  onRequestService,
  userLocation 
}) => {
  const getTruckIcon = (type: string) => {
    const icons = {
      pickup: '🚚',
      double_cab: '🚙',
      box: '📦',
      flatbed: '🚛',
      dry_van: '🚐',
      semi: '🚜',
      refrigerated: '🧊'
    };
    return icons[type as keyof typeof icons] || '🚚';
  };

  const getTruckTypeLabel = (type: string) => {
    const labels = {
      pickup: 'Pickup Truck',
      double_cab: 'Double Cab',
      box: 'Box Truck',
      flatbed: 'Flatbed',
      dry_van: 'Dry Van',
      semi: 'Semi-Trailer',
      refrigerated: 'Refrigerated'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-700';
      case 'busy': return 'bg-warning-100 text-warning-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  const calculateDistance = () => {
    if (!userLocation) return null;
    
    // Simple distance calculation (in a real app, use Google Maps Distance Matrix API)
    const R = 6371; // Earth's radius in kilometers
    const dLat = (truck.location.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (truck.location.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(truck.location.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  const calculateEstimatedCost = () => {
    const baseRate = searchCriteria.bookingType === 'hourly' ? truck.hourlyRate : truck.dailyRate;
    const duration = searchCriteria.durationHours;
    const baseCost = baseRate * duration;
    
    // Add distance-based cost (mock 10 km)
    const distanceCost = 10 * truck.perMileRate;
    
    // Platform fee (10%)
    const platformFee = (baseCost + distanceCost) * 0.1;
    
    // VAT (16% in Kenya)
    const vat = (baseCost + distanceCost + platformFee) * 0.16;
    
    const total = baseCost + distanceCost + platformFee + vat;
    
    return {
      baseRate: baseCost,
      distanceFee: distanceCost,
      platformFee,
      vat,
      total
    };
  };

  const distance = calculateDistance();
  const costBreakdown = calculateEstimatedCost();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getTruckIcon(truck.truck.type)}</div>
          <div>
            <h3 className="font-semibold text-primary-800 text-lg">
              {truck.truck.year} {truck.truck.make} {truck.truck.model}
            </h3>
            <p className="text-sm text-secondary-600">{getTruckTypeLabel(truck.truck.type)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.availability)}`}>
          {truck.availability.toUpperCase()}
        </span>
      </div>

      {/* Driver Info */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-accent-beige-50 rounded-lg">
        <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center">
          {truck.driver.avatar ? (
            <img src={truck.driver.avatar} alt={truck.driver.name} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-primary-800">{truck.driver.name}</p>
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Star className="h-4 w-4 text-warning-500" />
            <span>{truck.driver.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{truck.driver.totalJobs} jobs</span>
          </div>
        </div>
        <a href={`tel:${truck.driver.phone}`} className="text-accent-peach-400 hover:text-accent-peach-500">
          <Phone className="h-5 w-5" />
        </a>
      </div>

      {/* Truck Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-secondary-600">
          <Package className="h-4 w-4" />
          <span>{truck.truck.capacity.toLocaleString()} kg</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-secondary-600">
          <Ruler className="h-4 w-4" />
          <span>{truck.truck.dimensions.length}' × {truck.truck.dimensions.width}'</span>
        </div>
        <div className="text-sm text-secondary-600">
          <span className="font-medium">Plate:</span> {truck.truck.licensePlate}
        </div>
        <div className="text-sm text-secondary-600">
          <span className="font-medium">Type:</span> {getTruckTypeLabel(truck.truck.type)}
        </div>
      </div>

      {/* Location & ETA */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-secondary-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{truck.location.address}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-secondary-600">
            <Clock className="h-4 w-4" />
            <span>ETA: {truck.estimatedArrival} min</span>
          </div>
          {distance && (
            <span className="text-secondary-500">{distance} km away</span>
          )}
        </div>
      </div>

      {/* Booking Type & Duration */}
      <div className="bg-accent-peach-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-accent-peach-600" />
            <span className="text-sm font-medium text-accent-peach-800">
              {searchCriteria.bookingType === 'hourly' ? 'Hourly Rental' : 'Daily Rental'}
            </span>
          </div>
          <span className="text-sm text-accent-peach-700">
            {searchCriteria.durationHours} {searchCriteria.bookingType === 'hourly' ? 'hours' : 'days'}
          </span>
        </div>
      </div>

      {/* Enhanced Pricing Breakdown */}
      <div className="bg-accent-beige-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-primary-800 mb-3 flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          Cost Breakdown
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">
              Base Rate ({searchCriteria.durationHours} {searchCriteria.bookingType === 'hourly' ? 'hrs' : 'days'}):
            </span>
            <span className="font-medium">KES {costBreakdown.baseRate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Distance Fee (~10 km):</span>
            <span className="font-medium">KES {costBreakdown.distanceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Platform Fee (10%):</span>
            <span className="font-medium">KES {costBreakdown.platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">VAT (16%):</span>
            <span className="font-medium">KES {costBreakdown.vat.toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Estimated Cost:</span>
            <span className="text-accent-peach-600">KES {costBreakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rates Display */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="text-center p-2 bg-white border border-accent-beige-200 rounded">
          <div className="font-medium text-primary-800">KES {truck.hourlyRate.toLocaleString()}/hr</div>
          <div className="text-secondary-600">Hourly Rate</div>
        </div>
        <div className="text-center p-2 bg-white border border-accent-beige-200 rounded">
          <div className="font-medium text-primary-800">KES {truck.dailyRate.toLocaleString()}/day</div>
          <div className="text-secondary-600">Daily Rate</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onRequestService(truck)}
        disabled={truck.availability !== 'available'}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          truck.availability === 'available'
            ? 'bg-accent-peach-400 hover:bg-accent-peach-500 text-white'
            : 'bg-accent-beige-300 text-secondary-500 cursor-not-allowed'
        }`}
      >
        {truck.availability === 'available' 
          ? `Book for KES ${costBreakdown.total.toLocaleString()}` 
          : 'Not Available'
        }
      </button>
    </div>
  );
};

export default EnhancedTruckCard;