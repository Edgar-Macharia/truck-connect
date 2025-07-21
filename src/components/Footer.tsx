import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-accent-peach-400 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">TruckConnect</span>
            </div>
            <p className="text-accent-beige-200 mb-6 leading-relaxed">
              Connecting businesses and individuals with trusted truck drivers for efficient, 
              reliable transportation services across the country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-accent-beige-200 hover:text-accent-peach-300 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-beige-200 hover:text-accent-peach-300 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-beige-200 hover:text-accent-peach-300 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-accent-beige-200 hover:text-accent-peach-300 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* For Drivers */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Drivers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/driver-signup" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Drive with Us
                </Link>
              </li>
              <li>
                <Link to="/driver-requirements" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Requirements
                </Link>
              </li>
              <li>
                <Link to="/driver-earnings" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Earnings
                </Link>
              </li>
              <li>
                <Link to="/driver-support" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Driver Support
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-accent-beige-200 hover:text-white transition-colors duration-200">
                  Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent-peach-400" />
                <span className="text-accent-beige-200">1-800-TRUCK-CO</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent-peach-400" />
                <span className="text-accent-beige-200">support@truckconnect.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent-peach-400 mt-1" />
                <span className="text-accent-beige-200">
                  123 Logistics Ave<br />
                  Transport City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-accent-beige-200 text-sm mb-4 md:mb-0">
              © 2025 TruckConnect. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-accent-beige-200 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-accent-beige-200 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-accent-beige-200 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;