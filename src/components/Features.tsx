import React from 'react';
import { 
  Smartphone, 
  CreditCard, 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign, 
  Truck, 
  Shield 
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Easy Booking',
      description: 'Book a truck in just a few taps. Simple, fast, and intuitive interface for all user types.',
      color: 'bg-accent-peach-500'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options with secure processing. Transparent pricing with no hidden fees.',
      color: 'bg-accent-sage-500'
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Track your shipment in real-time with GPS. Get accurate ETAs and delivery notifications.',
      color: 'bg-error-500'
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Quality assurance through comprehensive rating and review system for drivers and customers.',
      color: 'bg-warning-500'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Schedule deliveries for now or later. Recurring shipments available for business users.',
      color: 'bg-secondary-500'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'Fair, competitive rates with upfront pricing. No surprises or hidden charges.',
      color: 'bg-primary-600'
    },
    {
      icon: Truck,
      title: 'Fleet Variety',
      description: 'Access to various truck types from pickup trucks to heavy-duty semi-trailers.',
      color: 'bg-accent-peach-600'
    },
    {
      icon: Shield,
      title: 'Insurance Coverage',
      description: 'Full cargo protection and liability coverage for peace of mind during transport.',
      color: 'bg-accent-sage-600'
    }
  ];

  return (
    <section className="py-20 bg-accent-beige-50 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/4246266/pexels-photo-4246266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
          alt="Modern logistics and transportation" 
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
            Why Choose TruckConnect?
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We've built the most comprehensive platform for truck services, 
            connecting you with verified drivers for safe, reliable transportation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-accent-beige-200"
            >
              <div className={`${feature.color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto relative border border-accent-beige-200">
            <div className="absolute inset-0 rounded-2xl">
              <img 
                src="https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1" 
                alt="Professional truck service team" 
                className="w-full h-full object-cover rounded-2xl opacity-10"
              />
            </div>
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-800 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-secondary-600 mb-8 text-lg">
                Join thousands of satisfied customers who trust TruckConnect for their transportation needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Book Your First Delivery
                </button>
                <button className="border-2 border-accent-peach-400 text-accent-peach-400 hover:bg-accent-peach-400 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;