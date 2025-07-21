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
  Phone,
  FileText,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { AvailableTruck, BookingRequest, SearchCriteria } from '../types';

interface EnhancedBookingModalProps {
  truck: AvailableTruck;
  searchCriteria: SearchCriteria;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: BookingRequest) => void;
}

const EnhancedBookingModal: React.FC<EnhancedBookingModalProps> = ({
  truck,
  searchCriteria,
  isOpen,
  onClose,
  onConfirmBooking
}) => {
  const [formData, setFormData] = useState({
    pickupAddress: searchCriteria.pickupLocation || '',
    dropoffAddress: '',
    cargoType: 'general',
    cargoWeight: '',
    cargoDescription: '',
    scheduledTime: '',
    specialRequirements: [] as string[],
    notes: '',
    paymentMethod: 'card'
  });

  const [currentStep, setCurrentStep] = useState(1);

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

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Equity Bank' },
    { value: 'wallet', label: 'Mobile Money', icon: '📱', description: 'M-Pesa, Airtel Money' },
    { value: 'invoice', label: 'Invoice (Business)', icon: '📄', description: 'Net 30 payment terms' }
  ];

  // Kenyan locations for dropdowns
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
    'Nyeri'
  ];

  const calculateCostBreakdown = () => {
    const baseRate = searchCriteria.bookingType === 'hourly' ? truck.hourlyRate : truck.dailyRate;
    const duration = searchCriteria.durationHours;
    const baseCost = baseRate * duration;
    
    // Mock distance calculation
    const distanceCost = 15 * truck.perMileRate;
    
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

  const costBreakdown = calculateCostBreakdown();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialRequirementChange = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const booking: BookingRequest = {
      pickupLocation: {
        address: formData.pickupAddress,
        lat: -1.2921, // Mock coordinates for Nairobi
        lng: 36.8219
      },
      dropoffLocation: {
        address: formData.dropoffAddress,
        lat: -1.3197,
        lng: 36.9275
      },
      cargo: {
        type: formData.cargoType,
        weight: parseFloat(formData.cargoWeight),
        description: formData.cargoDescription
      },
      scheduledTime: formData.scheduledTime,
      bookingType: searchCriteria.bookingType,
      durationHours: searchCriteria.durationHours,
      specialRequirements: formData.specialRequirements,
      notes: formData.notes
    };

    onConfirmBooking(booking);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-accent-beige-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-accent-beige-200">
          <div>
            <h2 className="text-2xl font-bold text-primary-800">Book Truck Service</h2>
            <p className="text-secondary-600">
              {searchCriteria.bookingType === 'hourly' ? 'Hourly' : 'Daily'} rental for {searchCriteria.durationHours} {searchCriteria.bookingType === 'hourly' ? 'hours' : 'days'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-accent-beige-200">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Trip Details', icon: MapPin },
              { step: 2, title: 'Cargo Info', icon: Package },
              { step: 3, title: 'Payment', icon: CreditCard }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step ? 'bg-accent-peach-400 text-white' : 'bg-accent-beige-200 text-secondary-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-accent-peach-600' : 'text-secondary-600'
                }`}>
                  {title}
                </span>
                {step < 3 && <div className="w-16 h-0.5 bg-accent-beige-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Truck & Driver Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Truck Details */}
              <div className="bg-accent-beige-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Truck Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Vehicle:</span>
                    <span className="font-medium">{truck.truck.year} {truck.truck.make} {truck.truck.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">License Plate:</span>
                    <span className="font-medium">{truck.truck.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Capacity:</span>
                    <span className="font-medium">{truck.truck.capacity.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Dimensions:</span>
                    <span className="font-medium">
                      {truck.truck.dimensions.length}' × {truck.truck.dimensions.width}' × {truck.truck.dimensions.height}'
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver Details */}
              <div className="bg-accent-beige-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Driver Information
                </h3>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center">
                    {truck.driver.avatar ? (
                      <img src={truck.driver.avatar} alt={truck.driver.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-primary-800">{truck.driver.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Star className="h-4 w-4 text-warning-500" />
                      <span>{truck.driver.rating.toFixed(1)} rating</span>
                      <span>•</span>
                      <span>{truck.driver.totalJobs} completed jobs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Phone className="h-4 w-4" />
                  <span>{truck.driver.phone}</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-accent-peach-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cost Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">
                      Base Rate ({searchCriteria.durationHours} {searchCriteria.bookingType === 'hourly' ? 'hrs' : 'days'}):
                    </span>
                    <span className="font-medium">KES {costBreakdown.baseRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Distance Fee:</span>
                    <span className="font-medium">KES {costBreakdown.distanceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Platform Fee:</span>
                    <span className="font-medium">KES {costBreakdown.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">VAT (16%):</span>
                    <span className="font-medium">KES {costBreakdown.vat.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-accent-peach-600">KES {costBreakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Steps */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Trip Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary-800">Trip Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        placeholder="Enter pickup address in Kenya"
                        list="pickup-locations"
                        required
                      />
                      <datalist id="pickup-locations">
                        {kenyanLocations.map((location, index) => (
                          <option key={index} value={location} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Dropoff Location
                      </label>
                      <input
                        type="text"
                        name="dropoffAddress"
                        value={formData.dropoffAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        placeholder="Enter dropoff address in Kenya"
                        list="dropoff-locations"
                        required
                      />
                      <datalist id="dropoff-locations">
                        {kenyanLocations.map((location, index) => (
                          <option key={index} value={location} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Scheduled Pickup Time
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledTime"
                        value={formData.scheduledTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        required
                      />
                    </div>

                    <div className="bg-accent-beige-50 rounded-lg p-4">
                      <h4 className="font-medium text-primary-800 mb-2">Booking Summary</h4>
                      <div className="text-sm text-secondary-600 space-y-1">
                        <p>Type: {searchCriteria.bookingType === 'hourly' ? 'Hourly' : 'Daily'} rental</p>
                        <p>Duration: {searchCriteria.durationHours} {searchCriteria.bookingType === 'hourly' ? 'hours' : 'days'}</p>
                        <p>Truck: {truck.truck.year} {truck.truck.make} {truck.truck.model}</p>
                        <p>Location: Kenya</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Cargo Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary-800">Cargo Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Cargo Type
                        </label>
                        <select
                          name="cargoType"
                          value={formData.cargoType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        >
                          {cargoTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="cargoWeight"
                          value={formData.cargoWeight}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cargo Description
                      </label>
                      <textarea
                        name="cargoDescription"
                        value={formData.cargoDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        placeholder="Describe your cargo..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Special Requirements
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {specialRequirementOptions.map(requirement => (
                          <label key={requirement} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.specialRequirements.includes(requirement)}
                              onChange={() => handleSpecialRequirementChange(requirement)}
                              className="h-4 w-4 text-accent-peach-400 focus:ring-accent-peach-400 border-accent-beige-300 rounded"
                            />
                            <span className="ml-2 text-sm text-secondary-700">{requirement}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        placeholder="Any additional instructions or notes..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary-800">Payment Method</h3>
                    
                    <div className="grid gap-4">
                      {paymentMethods.map(method => (
                        <label key={method.value} className="flex items-center p-4 border border-accent-beige-300 rounded-lg cursor-pointer hover:bg-accent-beige-50 transition-colors duration-200">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-accent-peach-400 focus:ring-accent-peach-400"
                          />
                          <span className="ml-3 text-2xl">{method.icon}</span>
                          <div className="ml-3">
                            <span className="font-medium text-primary-800 block">{method.label}</span>
                            <span className="text-sm text-secondary-600">{method.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-warning-600 mr-2" />
                        <span className="font-medium text-warning-800">Invoice Generation</span>
                      </div>
                      <p className="text-sm text-warning-700 mt-1">
                        An invoice will be automatically generated upon booking completion and sent to your email. 
                        You can also access it from your dashboard.
                      </p>
                    </div>

                    <div className="bg-accent-peach-50 border border-accent-peach-200 rounded-lg p-4">
                      <h4 className="font-medium text-accent-peach-800 mb-2">Booking Confirmation</h4>
                      <div className="text-sm text-accent-peach-700 space-y-1">
                        <p>• Driver will be notified immediately</p>
                        <p>• You'll receive real-time tracking updates</p>
                        <p>• Payment will be processed upon completion</p>
                        <p>• Invoice will be generated automatically</p>
                        <p>• Service available across Kenya</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-accent-beige-200">
                  <button
                    type="button"
                    onClick={currentStep === 1 ? onClose : prevStep}
                    className="flex items-center px-6 py-3 border border-accent-beige-300 rounded-lg font-semibold text-secondary-700 hover:bg-accent-beige-50 transition-colors duration-200"
                  >
                    {currentStep === 1 ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </>
                    )}
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center px-6 py-3 bg-accent-peach-400 hover:bg-accent-peach-500 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center px-6 py-3 bg-success-600 hover:bg-success-700 text-white rounded-lg font-semibold transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking - KES {costBreakdown.total.toLocaleString()}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingModal;