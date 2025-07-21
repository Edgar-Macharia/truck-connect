import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign, 
  Clock,
  Truck,
  User,
  Star,
  Phone
} from 'lucide-react';
import { AvailableTruck, BookingRequest, Location } from '../types';

interface BookingModalProps {
  truck: AvailableTruck;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: BookingRequest) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  truck,
  isOpen,
  onClose,
  onConfirmBooking
}) => {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    cargoType: 'general',
    cargoWeight: '',
    cargoDescription: '',
    scheduledTime: '',
    specialRequirements: [] as string[],
    notes: ''
  });

  const [estimatedCost, setEstimatedCost] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(0);

  const cargoTypes = [
    { value: 'general', label: 'General Cargo' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'construction', label: 'Construction Materials' },
    { value: 'perishable', label: 'Perishable Goods' },
    { value: 'hazardous', label: 'Hazardous Materials' }
  ];

  const specialRequirementOptions = [
    'Loading assistance required',
    'Fragile items',
    'Time-sensitive delivery',
    'Special handling required',
    'Multiple stops',
    'Heavy lifting equipment needed'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate estimated cost when relevant fields change
    if (name === 'cargoWeight' || name === 'pickupAddress' || name === 'dropoffAddress') {
      calculateEstimatedCost();
    }
  };

  const handleSpecialRequirementChange = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const calculateEstimatedCost = () => {
    // Mock calculation - in real app, use Google Maps Distance Matrix API
    const baseDistance = 15; // miles
    const baseCost = truck.hourlyRate * 2; // 2 hours base
    const distanceCost = baseDistance * truck.perMileRate;
    const total = baseCost + distanceCost;
    
    setEstimatedDistance(baseDistance);
    setEstimatedCost(total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const booking: BookingRequest = {
      pickupLocation: {
        address: formData.pickupAddress,
        lat: 40.7128, // Mock coordinates
        lng: -74.0060
      },
      dropoffLocation: {
        address: formData.dropoffAddress,
        lat: 40.7589,
        lng: -73.9851
      },
      cargo: {
        type: formData.cargoType,
        weight: parseFloat(formData.cargoWeight),
        description: formData.cargoDescription
      },
      scheduledTime: formData.scheduledTime,
      specialRequirements: formData.specialRequirements,
      notes: formData.notes
    };

    onConfirmBooking(booking);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Truck Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Truck & Driver Info */}
            <div className="space-y-6">
              {/* Truck Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Truck Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{truck.truck.year} {truck.truck.make} {truck.truck.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License Plate:</span>
                    <span className="font-medium">{truck.truck.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{truck.truck.capacity.toLocaleString()} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {truck.truck.dimensions.length}' × {truck.truck.dimensions.width}' × {truck.truck.dimensions.height}'
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Driver Information
                </h3>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    {truck.driver.avatar ? (
                      <img src={truck.driver.avatar} alt={truck.driver.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{truck.driver.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{truck.driver.rating.toFixed(1)} rating</span>
                      <span>•</span>
                      <span>{truck.driver.totalJobs} completed jobs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{truck.driver.phone}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">${truck.hourlyRate}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Mile Rate:</span>
                    <span className="font-medium">${truck.perMileRate}/mile</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Distance:</span>
                    <span className="font-medium">{estimatedDistance} miles</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Estimated Total:</span>
                    <span className="text-blue-600">${estimatedCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter pickup address"
                    required
                  />
                </div>

                {/* Dropoff Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    name="dropoffAddress"
                    value={formData.dropoffAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter dropoff address"
                    required
                  />
                </div>

                {/* Scheduled Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Scheduled Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Cargo Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo Type
                    </label>
                    <select
                      name="cargoType"
                      value={formData.cargoType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {cargoTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      name="cargoWeight"
                      value={formData.cargoWeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Cargo Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Description
                  </label>
                  <textarea
                    name="cargoDescription"
                    value={formData.cargoDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your cargo..."
                  />
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {specialRequirementOptions.map(requirement => (
                      <label key={requirement} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.specialRequirements.includes(requirement)}
                          onChange={() => handleSpecialRequirementChange(requirement)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{requirement}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional instructions or notes..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
                  >
                    Confirm Booking - ${estimatedCost.toFixed(2)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;