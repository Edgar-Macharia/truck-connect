import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Truck,
  Star,
  Weight
} from 'lucide-react';
import { SearchCriteria, AvailableTruck } from '../types';

interface TruckSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  onFilterChange: (trucks: AvailableTruck[]) => void;
  availableTrucks: AvailableTruck[];
}

const TruckSearchForm: React.FC<TruckSearchFormProps> = ({
  onSearch,
  onFilterChange,
  availableTrucks
}) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    pickupLocation: '',
    truckType: 'all',
    bookingType: 'hourly',
    durationHours: 2,
    minCapacity: 0,
    minRating: 0,
    searchRadius: 10
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const truckTypes = [
    { value: 'all', label: 'All Truck Types' },
    { value: 'pickup', label: 'Pickup Truck' },
    { value: 'double_cab', label: 'Double Cab' },
    { value: 'box', label: 'Box Truck' },
    { value: 'flatbed', label: 'Flatbed' },
    { value: 'dry_van', label: 'Dry Van' },
    { value: 'refrigerated', label: 'Refrigerated' },
    { value: 'semi', label: 'Semi-Trailer' }
  ];

  // Kenyan cities and locations
  const kenyanLocations = [
    'Nairobi CBD',
    'Westlands, Nairobi',
    'Karen, Nairobi',
    'Kileleshwa, Nairobi',
    'Industrial Area, Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Machakos',
    'Nyeri',
    'Meru',
    'Kitale',
    'Malindi'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: name === 'durationHours' || name === 'minCapacity' || name === 'minRating' || name === 'searchRadius'
        ? Number(value)
        : value
    }));
  };

  const handleSearch = () => {
    // Mock geocoding for Kenyan locations
    const mockCoords = { lat: -1.2921, lng: 36.8219 }; // Nairobi coordinates
    
    const criteriaWithCoords = {
      ...searchCriteria,
      pickupCoords: mockCoords
    };
    
    onSearch(criteriaWithCoords);
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Mock reverse geocoding for Kenya
          setSearchCriteria(prev => ({
            ...prev,
            pickupLocation: 'Current Location',
            pickupCoords: coords
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    }
  };

  // Filter trucks based on criteria
  useEffect(() => {
    let filteredTrucks = availableTrucks;

    if (searchCriteria.truckType !== 'all') {
      filteredTrucks = filteredTrucks.filter(truck => 
        truck.truck.type === searchCriteria.truckType
      );
    }

    if (searchCriteria.minCapacity > 0) {
      filteredTrucks = filteredTrucks.filter(truck => 
        truck.truck.capacity >= searchCriteria.minCapacity
      );
    }

    if (searchCriteria.minRating > 0) {
      filteredTrucks = filteredTrucks.filter(truck => 
        truck.driver.rating >= searchCriteria.minRating
      );
    }

    onFilterChange(filteredTrucks);
  }, [searchCriteria, availableTrucks, onFilterChange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-accent-beige-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary-800">Search for Trucks in Kenya</h2>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center space-x-2 text-accent-peach-400 hover:text-accent-peach-500 font-medium"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Search */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pickup Location */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="pickupLocation"
                value={searchCriteria.pickupLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                placeholder="Enter pickup location in Kenya"
                list="kenyan-locations"
              />
              <datalist id="kenyan-locations">
                {kenyanLocations.map((location, index) => (
                  <option key={index} value={location} />
                ))}
              </datalist>
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
              <button
                type="button"
                onClick={handleLocationDetection}
                className="absolute right-3 top-3 text-accent-peach-400 hover:text-accent-peach-500 text-sm font-medium"
              >
                Use Current
              </button>
            </div>
          </div>

          {/* Truck Type */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Truck Type
            </label>
            <select
              name="truckType"
              value={searchCriteria.truckType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
            >
              {truckTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Trucks</span>
            </button>
          </div>
        </div>

        {/* Booking Type and Duration */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Booking Type
            </label>
            <select
              name="bookingType"
              value={searchCriteria.bookingType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
            >
              <option value="hourly">Hourly Rental</option>
              <option value="daily">Daily Rental</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Duration ({searchCriteria.bookingType === 'hourly' ? 'Hours' : 'Days'})
            </label>
            <input
              type="number"
              name="durationHours"
              value={searchCriteria.durationHours}
              onChange={handleInputChange}
              min="1"
              max={searchCriteria.bookingType === 'hourly' ? 24 : 30}
              className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Search Radius (km)
            </label>
            <select
              name="searchRadius"
              value={searchCriteria.searchRadius}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t border-accent-beige-200 pt-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Advanced Filters</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Weight className="inline h-4 w-4 mr-1" />
                  Minimum Capacity (kg)
                </label>
                <input
                  type="range"
                  name="minCapacity"
                  value={searchCriteria.minCapacity}
                  onChange={handleInputChange}
                  min="0"
                  max="10000"
                  step="250"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-secondary-600 mt-1">
                  <span>0 kg</span>
                  <span className="font-medium">{searchCriteria.minCapacity.toLocaleString()} kg</span>
                  <span>10,000 kg</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Star className="inline h-4 w-4 mr-1" />
                  Minimum Driver Rating
                </label>
                <input
                  type="range"
                  name="minRating"
                  value={searchCriteria.minRating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.5"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-secondary-600 mt-1">
                  <span>Any Rating</span>
                  <span className="font-medium">
                    {searchCriteria.minRating > 0 ? `${searchCriteria.minRating}+ stars` : 'Any Rating'}
                  </span>
                  <span>5 stars</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TruckSearchForm;