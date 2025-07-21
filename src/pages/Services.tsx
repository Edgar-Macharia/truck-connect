import React from 'react';
import { 
  Truck, 
  Package, 
  Building, 
  Users, 
  Clock, 
  MapPin,
  Shield,
  Star,
  Calendar,
  DollarSign,
  Phone,
  Wrench,
  Home,
  Factory,
  Zap,
  Snowflake,
  HardHat,
  ShoppingCart,
  Briefcase,
  ArrowRight
} from 'lucide-react';

const Services: React.FC = () => {
  const truckTypes = [
    {
      icon: '🚚',
      name: 'Pickup Trucks',
      capacity: '1,500 - 3,000 lbs',
      description: 'Perfect for small moves, furniture delivery, and personal transportation needs.',
      features: ['Easy loading', 'City-friendly', 'Affordable rates'],
      hourlyRate: 'KES 2,500-3,000',
      dailyRate: 'KES 18,000-22,000'
    },
    {
      icon: '🚙',
      name: 'Double Cab Trucks',
      capacity: '1,200 - 2,500 lbs',
      description: 'Ideal for team moves with passenger seating and cargo space.',
      features: ['Passenger seating', 'Versatile cargo', 'Team transport'],
      hourlyRate: 'KES 2,800-3,200',
      dailyRate: 'KES 20,000-24,000'
    },
    {
      icon: '📦',
      name: 'Box Trucks',
      capacity: '3,000 - 10,000 lbs',
      description: 'Enclosed cargo space for weather protection and secure transport.',
      features: ['Weather protection', 'Secure loading', 'Medium capacity'],
      hourlyRate: 'KES 3,500-4,500',
      dailyRate: 'KES 25,000-32,000'
    },
    {
      icon: '🚛',
      name: 'Flatbed Trucks',
      capacity: '10,000 - 25,000 lbs',
      description: 'Open platform for oversized items, construction materials, and heavy equipment.',
      features: ['Oversized cargo', 'Easy loading', 'Heavy capacity'],
      hourlyRate: 'KES 4,500-5,500',
      dailyRate: 'KES 32,000-40,000'
    },
    {
      icon: '🚐',
      name: 'Dry Van Trucks',
      capacity: '5,000 - 15,000 lbs',
      description: 'Large enclosed space for bulk cargo and commercial deliveries.',
      features: ['Large capacity', 'Enclosed space', 'Commercial grade'],
      hourlyRate: 'KES 4,000-5,000',
      dailyRate: 'KES 28,000-36,000'
    },
    {
      icon: '🧊',
      name: 'Refrigerated Trucks',
      capacity: '8,000 - 20,000 lbs',
      description: 'Temperature-controlled transport for perishable goods and pharmaceuticals.',
      features: ['Temperature control', 'Perishable goods', 'Pharmaceutical grade'],
      hourlyRate: 'KES 5,000-6,000',
      dailyRate: 'KES 36,000-45,000'
    },
    {
      icon: '🚜',
      name: 'Semi-Trailers',
      capacity: '25,000 - 80,000 lbs',
      description: 'Heavy-duty transport for large-scale commercial and industrial needs.',
      features: ['Maximum capacity', 'Long distance', 'Commercial grade'],
      hourlyRate: 'KES 8,000-10,000',
      dailyRate: 'KES 60,000-75,000'
    }
  ];

  const serviceCategories = [
    {
      icon: Home,
      title: 'Residential Services',
      description: 'Moving and delivery services for homeowners and renters',
      services: [
        'Home moving and relocation',
        'Furniture delivery and pickup',
        'Appliance transportation',
        'Garage sale and estate cleanouts',
        'Storage unit moves',
        'Apartment and condo moves'
      ],
      color: 'bg-accent-peach-400'
    },
    {
      icon: Building,
      title: 'Commercial Services',
      description: 'Business transportation and logistics solutions',
      services: [
        'Office relocations',
        'Equipment transportation',
        'Inventory transfers',
        'Trade show logistics',
        'Document and file moves',
        'Retail merchandise delivery'
      ],
      color: 'bg-accent-sage-500'
    },
    {
      icon: Factory,
      title: 'Industrial Services',
      description: 'Heavy-duty transport for industrial operations',
      services: [
        'Machinery and equipment transport',
        'Raw material delivery',
        'Manufacturing logistics',
        'Warehouse operations',
        'Industrial waste removal',
        'Plant relocations'
      ],
      color: 'bg-secondary-700'
    },
    {
      icon: HardHat,
      title: 'Construction Services',
      description: 'Specialized transport for construction projects',
      services: [
        'Building materials delivery',
        'Tool and equipment transport',
        'Debris and waste removal',
        'Site-to-site transfers',
        'Heavy machinery transport',
        'Project logistics'
      ],
      color: 'bg-warning-500'
    },
    {
      icon: ShoppingCart,
      title: 'Retail & E-commerce',
      description: 'Last-mile delivery and retail logistics',
      services: [
        'Last-mile delivery',
        'Store restocking',
        'Customer deliveries',
        'Return pickups',
        'Seasonal inventory moves',
        'Pop-up store setup'
      ],
      color: 'bg-error-500'
    },
    {
      icon: Zap,
      title: 'Emergency Services',
      description: 'Urgent and time-sensitive transportation',
      services: [
        '24/7 emergency transport',
        'Same-day delivery',
        'Rush orders',
        'Emergency relocations',
        'Disaster response logistics',
        'Critical supply delivery'
      ],
      color: 'bg-primary-600'
    }
  ];

  const specializedServices = [
    {
      icon: Snowflake,
      title: 'Temperature-Controlled Transport',
      description: 'Specialized refrigerated and frozen goods transportation',
      features: [
        'Pharmaceutical transport',
        'Food and beverage delivery',
        'Frozen goods handling',
        'Temperature monitoring',
        'Cold chain compliance'
      ]
    },
    {
      icon: Shield,
      title: 'Secure Transport',
      description: 'High-value and sensitive cargo transportation',
      features: [
        'Valuable goods transport',
        'Secure loading/unloading',
        'GPS tracking',
        'Insurance coverage',
        'Background-checked drivers'
      ]
    },
    {
      icon: Wrench,
      title: 'White Glove Service',
      description: 'Premium handling for delicate and high-end items',
      features: [
        'Professional packing',
        'Careful handling',
        'Assembly/disassembly',
        'Premium insurance',
        'Dedicated service team'
      ]
    }
  ];

  const bookingOptions = [
    {
      icon: Clock,
      title: 'Hourly Rentals',
      description: 'Perfect for short-term needs and local moves',
      features: [
        'Minimum 2-hour booking',
        'Flexible duration',
        'Ideal for local moves',
        'Pay only for time used'
      ],
      pricing: 'Starting at KES 2,500/hour'
    },
    {
      icon: Calendar,
      title: 'Daily Rentals',
      description: 'Best value for extended projects and long-distance moves',
      features: [
        'Full day availability',
        'Better hourly rates',
        'Long-distance moves',
        'Multi-stop journeys'
      ],
      pricing: 'Starting at KES 18,000/day'
    },
    {
      icon: Briefcase,
      title: 'Contract Services',
      description: 'Ongoing logistics solutions for businesses',
      features: [
        'Volume discounts',
        'Dedicated drivers',
        'Custom scheduling',
        'Priority booking'
      ],
      pricing: 'Custom pricing'
    }
  ];

  const additionalServices = [
    'Loading and unloading assistance',
    'Packing and unpacking services',
    'Furniture assembly/disassembly',
    'Storage solutions',
    'Insurance coverage',
    'Real-time GPS tracking',
    'Photo documentation',
    'Delivery confirmation',
    '24/7 customer support',
    'Multi-language support'
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Comprehensive truck services" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 via-primary-700/80 to-secondary-700/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Truck Services
            </h1>
            <p className="text-xl text-accent-beige-200 max-w-3xl mx-auto mb-8">
              From small pickup trucks to heavy-duty semi-trailers, we provide complete 
              transportation solutions for individuals, businesses, and industries across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Book a Truck Now
              </button>
              <button className="bg-transparent border-2 border-accent-beige-300 text-accent-beige-100 hover:bg-accent-peach-400 hover:border-accent-peach-400 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Truck Types Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Our Fleet of Trucks
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose from our diverse fleet of vehicles to match your specific transportation needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {truckTypes.map((truck, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-accent-beige-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{truck.icon}</div>
                  <h3 className="text-xl font-semibold text-primary-800">{truck.name}</h3>
                  <p className="text-accent-peach-500 font-medium">{truck.capacity}</p>
                </div>
                
                <p className="text-secondary-600 mb-4 text-center">{truck.description}</p>
                
                <div className="space-y-2 mb-4">
                  {truck.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-secondary-700">
                      <div className="w-2 h-2 bg-accent-peach-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-accent-beige-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-secondary-600">Hourly:</span>
                      <span className="font-medium ml-1">{truck.hourlyRate}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Daily:</span>
                      <span className="font-medium ml-1">{truck.dailyRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Services by Industry
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Specialized transportation solutions tailored to different industries and use cases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <div key={index} className="bg-accent-beige-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-accent-beige-200">
                <div className={`${category.color} p-3 rounded-lg w-fit mb-4`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {category.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-center text-sm text-secondary-700">
                      <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full mr-3"></div>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Options */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Flexible Booking Options
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose the booking option that best fits your schedule and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bookingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 border border-accent-beige-200">
                <div className="bg-accent-peach-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <option.icon className="h-8 w-8 text-accent-peach-600" />
                </div>
                <h3 className="text-2xl font-semibold text-primary-800 mb-4">
                  {option.title}
                </h3>
                <p className="text-secondary-600 mb-6">
                  {option.description}
                </p>
                <div className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center text-sm text-secondary-700">
                      <div className="w-2 h-2 bg-accent-peach-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="text-lg font-semibold text-accent-peach-600 mb-4">
                  {option.pricing}
                </div>
                <button className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialized Services */}
      <div className="bg-accent-beige-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Specialized Services
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Premium services for specialized transportation needs requiring extra care and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specializedServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-accent-beige-200">
                <div className="bg-gradient-to-r from-accent-peach-400 to-accent-peach-500 p-3 rounded-lg w-fit mb-4">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-secondary-700">
                      <div className="w-2 h-2 bg-accent-peach-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Additional Services & Support
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Comprehensive support services to make your transportation experience seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="flex items-center p-4 bg-accent-beige-50 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200 border border-accent-beige-200">
                <div className="w-3 h-3 bg-accent-peach-400 rounded-full mr-4"></div>
                <span className="text-secondary-700 font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-accent-peach-50 py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246266/pexels-photo-4246266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Nationwide service coverage" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">
                Service Coverage Across Kenya
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                We provide transportation services across all major cities and regions in Kenya, 
                with local drivers who know their areas best.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-accent-peach-500 mr-3" />
                  <span className="text-secondary-700">10+ Major Cities</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-accent-peach-500 mr-3" />
                  <span className="text-secondary-700">1,000+ Drivers</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-accent-peach-500 mr-3" />
                  <span className="text-secondary-700">500+ Vehicles</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-accent-peach-500 mr-3" />
                  <span className="text-secondary-700">4.9 Average Rating</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-accent-beige-200">
              <h3 className="text-xl font-semibold text-primary-800 mb-6">
                Get a Custom Quote
              </h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Dropoff Location"
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400">
                    <option>Select Truck Type</option>
                    <option>Pickup Truck</option>
                    <option>Box Truck</option>
                    <option>Flatbed</option>
                    <option>Semi-Trailer</option>
                  </select>
                </div>
                <div>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                  />
                </div>
                <button className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                  Get Instant Quote
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-800 to-secondary-700 py-20 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
            alt="Ready to get started" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-accent-beige-200 mb-8 max-w-2xl mx-auto">
            Book your truck service today and experience the difference of professional, 
            reliable transportation across Kenya.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-800 hover:bg-accent-beige-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Book Now
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Call +254-700-TRUCK-KE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;