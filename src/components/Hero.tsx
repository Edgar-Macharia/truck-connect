import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, Clock, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://assets.grok.com/users/ad04b833-dab7-4536-b175-a09614beb9e2/generated/a594a36b-35a3-4fca-9593-a04de5562326/image.jpg" 
          alt="Professional truck drivers and logistics" 
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 via-primary-700/80 to-secondary-700/80"></div>
      </div>

      {/* Bolt Badge */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 z-10 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
        <img 
          src="/black_circle_360x360.png" 
          alt="Powered by Bolt" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Connect with
              <span className="text-accent-peach-300 block">Trusted Truck Drivers</span>
            </h1>
            <p className="text-xl text-accent-beige-200 mb-8 leading-relaxed">
              The fastest, most reliable way to transport your goods. Book a truck in minutes, 
              track in real-time, and get your cargo delivered safely.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/register"
                className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Book a Truck Now
              </Link>
              <Link
                to="/register?type=driver"
                className="bg-transparent border-2 border-accent-beige-300 text-accent-beige-100 hover:bg-accent-peach-400 hover:border-accent-peach-400 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Drive with Us
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-accent-beige-200 text-sm">Active Drivers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-accent-beige-200 text-sm">Jobs Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-accent-beige-200 text-sm">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-accent-beige-200 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-accent-peach-100 rounded-lg p-3 w-fit mb-4">
                    <Truck className="h-6 w-6 text-accent-peach-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Multiple Truck Types</h3>
                  <p className="text-secondary-600 text-sm">From pickup trucks to semi-trailers</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-accent-sage-100 rounded-lg p-3 w-fit mb-4">
                    <Users className="h-6 w-6 text-accent-sage-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Verified Drivers</h3>
                  <p className="text-secondary-600 text-sm">Background checked professionals</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-warning-100 rounded-lg p-3 w-fit mb-4">
                    <Clock className="h-6 w-6 text-warning-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Real-time Tracking</h3>
                  <p className="text-secondary-600 text-sm">Know exactly where your cargo is</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="bg-secondary-100 rounded-lg p-3 w-fit mb-4">
                    <Shield className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Insured Delivery</h3>
                  <p className="text-secondary-600 text-sm">Full cargo protection coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;