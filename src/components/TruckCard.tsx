import React from 'react';
import { 
  Truck, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  Package,
  Ruler
} from 'lucide-react';
import { AvailableTruck } from '../types';

interface TruckCardProps {
  truck: AvailableTruck;
  onRequestService: (truck: AvailableTruck) => void;
  userLocation?: { lat: number; lng: number };
}

const TruckCard: React.FC<TruckCardProps> = ({ 
  truck, 
  onRequestService,
  userLocation 
}) => {
  const getTruckIcon = (type: string) => {
    const icons = {
      pickup: '🚚',
      box: '📦',
      flatbed: '🚛',
      semi: '🚜',
      refrigerated: '🧊'
    };
    return icons[type as keyof typeof icons] || '🚚';
  };

  const getTruckTypeLabel = (type: string) => {
    const labels = {
      pickup: 'Pickup Truck',
      box: 'Box Truck',
      flatbed: 'Flatbed',
      semi: 'Semi-Trailer',
      refrigerated: 'Refrigerated'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateDistance = () => {
    if (!userLocation) return null;
    
    // Simple distance calculation (in a real app, use Google Maps Distance Matrix API)
    const R = 3959; // Earth's radius in miles
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

  const distance = calculateDistance();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getTruckIcon(truck.truck.type)}</div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {truck.truck.year} {truck.truck.make} {truck.truck.model}
            </h3>
            <p className="text-sm text-gray-600">{getTruckTypeLabel(truck.truck.type)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(truck.availability)}`}>
          {truck.availability.toUpperCase()}
        </span>
      </div>

      {/* Driver Info */}
      <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          {truck.driver.avatar ? (
            <img src={truck.driver.avatar} alt={truck.driver.name} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{truck.driver.name}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{truck.driver.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{truck.driver.totalJobs} jobs</span>
          </div>
        </div>
        <a href={`tel:${truck.driver.phone}`} className="text-blue-600 hover:text-blue-700">
          <Phone className="h-5 w-5" />
        </a>
      </div>

      {/* Truck Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{truck.truck.capacity.toLocaleString()} lbs</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Ruler className="h-4 w-4" />
          <span>{truck.truck.dimensions.length}' × {truck.truck.dimensions.width}'</span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Plate:</span> {truck.truck.licensePlate}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Type:</span> {getTruckTypeLabel(truck.truck.type)}
        </div>
      </div>

      {/* Location & ETA */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{truck.location.address}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>ETA: {truck.estimatedArrival} min</span>
          </div>
          {distance && (
            <span className="text-gray-500">{distance} miles away</span>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm">
          <div className="font-medium text-gray-900">${truck.hourlyRate}/hour</div>
          <div className="text-gray-600">${truck.perMileRate}/mile</div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div>Base rate</div>
          <div>+ distance</div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onRequestService(truck)}
        disabled={truck.availability !== 'available'}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          truck.availability === 'available'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {truck.availability === 'available' ? 'Request Service' : 'Not Available'}
      </button>
    </div>
  );
};

export default TruckCard;