import React from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign,
  Star,
  Shield,
  Smartphone,
  CreditCard
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Location-Based Truck Search',
      description: 'Find available trucks near your pickup location with advanced search and filtering capabilities.',
      details: [
        'Search by city, zip code, or current location',
        'Filter by truck type, capacity, and driver ratings',
        'Real-time availability updates',
        'Interactive map view with truck locations'
      ],
      color: 'bg-accent-peach-500'
    },
    {
      icon: Filter,
      title: 'Advanced Filtering System',
      description: 'Narrow down your search with comprehensive filters to find the perfect truck for your needs.',
      details: [
        'Filter by truck type (pickup, double cab, flatbed, etc.)',
        'Capacity and dimension requirements',
        'Driver rating and experience level',
        'Search radius customization'
      ],
      color: 'bg-accent-sage-500'
    },
    {
      icon: Calendar,
      title: 'Flexible Booking Options',
      description: 'Book trucks for hourly or daily rentals with transparent pricing and instant confirmation.',
      details: [
        'Hourly rentals for short-term needs',
        'Daily rentals for extended projects',
        'Flexible scheduling and duration',
        'Instant booking confirmation'
      ],
      color: 'bg-secondary-700'
    },
    {
      icon: FileText,
      title: 'Automated Invoice Generation',
      description: 'Receive detailed invoices automatically generated upon booking completion.',
      details: [
        'Comprehensive cost breakdown',
        'PDF invoices sent via email',
        'In-app invoice management',
        'Payment status tracking'
      ],
      color: 'bg-warning-500'
    },
    {
      icon: MapPin,
      title: 'Real-Time GPS Tracking',
      description: 'Track your shipment in real-time with accurate location updates and ETAs.',
      details: [
        'Live truck location tracking',
        'Accurate arrival time estimates',
        'Route optimization',
        'Delivery notifications'
      ],
      color: 'bg-error-500'
    },
    {
      icon: Star,
      title: 'Rating & Review System',
      description: 'Quality assurance through comprehensive ratings and reviews for drivers and customers.',
      details: [
        'Driver performance ratings',
        'Customer feedback system',
        'Service quality metrics',
        'Verified review system'
      ],
      color: 'bg-warning-500'
    },
    {
      icon: Truck,
      title: 'Fleet Variety',
      description: 'Access to various truck types from pickup trucks to heavy-duty semi-trailers.',
      details: [
        'Pickup trucks for small moves',
        'Box trucks for secure transport',
        'Flatbeds for construction materials',
        'Refrigerated trucks for perishables'
      ],
      color: 'bg-accent-peach-600'
    },
    {
      icon: Shield,
      title: 'Insurance Coverage',
      description: 'Full cargo protection and liability coverage for peace of mind during transport.',
      details: [
        'Comprehensive cargo insurance',
        'Driver background verification',
        'Secure payment processing',
        'Dispute resolution system'
      ],
      color: 'bg-primary-700'
    }
  ];

  const pricingFeatures = [
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise charges',
      icon: DollarSign
    },
    {
      title: 'Multiple Payment Options',
      description: 'Credit cards, M-Pesa, and invoicing',
      icon: CreditCard
    },
    {
      title: 'Instant Cost Estimates',
      description: 'Get accurate pricing before booking',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Advanced logistics technology" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 via-primary-700/80 to-secondary-700/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Modern Logistics
          </h1>
          <p className="text-xl text-accent-beige-200 max-w-3xl mx-auto mb-8">
            Discover the comprehensive features that make TruckConnect the leading platform 
            for truck services and transportation management in Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-accent-beige-300 text-accent-beige-100 hover:bg-accent-peach-400 hover:border-accent-peach-400 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Everything You Need for Efficient Transportation
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design 
              to deliver the best truck booking experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-accent-beige-200"
              >
                <div className={`${feature.color} p-4 rounded-lg w-fit mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-primary-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-secondary-700">
                      <div className="w-2 h-2 bg-accent-peach-400 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Features Section */}
      <div className="bg-white py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246266/pexels-photo-4246266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Transparent pricing and payments" 
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Fair & Transparent Pricing
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our pricing model is designed to be fair, transparent, and competitive 
              with no hidden fees or surprise charges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pricingFeatures.map((feature, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg border border-accent-beige-200">
                <div className="bg-accent-peach-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-accent-peach-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown Example */}
          <div className="bg-accent-beige-50 rounded-xl p-8 max-w-2xl mx-auto border border-accent-beige-200">
            <h3 className="text-xl font-semibold text-primary-800 mb-6 text-center">
              Sample Pricing Breakdown (KES)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Base Rate (4 hours):</span>
                <span className="font-medium">10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Distance Fee (15 km):</span>
                <span className="font-medium">2,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Platform Fee (10%):</span>
                <span className="font-medium">1,225</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">VAT (16%):</span>
                <span className="font-medium">2,156</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-accent-peach-600">15,631</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-secondary-700 py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Join TruckConnect today" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-accent-beige-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TruckConnect 
            for their transportation needs across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-800 hover:bg-accent-beige-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Get Started Today
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;