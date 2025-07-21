import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Bell, User, Menu, X, LogOut, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { user, notifications, auth, toast } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    // Only set signing out state when user actually clicks logout
    setIsSigningOut(true);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    
    try {
      const { error } = await auth.signOut();
      
      if (error) {
        toast.showError('Sign Out Failed', 'There was an issue signing you out. Please try again.');
      } else {
        toast.showSuccess('Signed Out', 'You have been successfully signed out.');
      }
      
      // Navigate to login page immediately after sign out
      navigate('/login', { replace: true });
    } catch (error) {
      toast.showError('Sign Out Failed', 'An unexpected error occurred during sign out.');
      
      // Force navigation to login even on error
      navigate('/login', { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'driver': return 'bg-accent-sage-100 text-accent-sage-700';
      case 'business': return 'bg-accent-peach-100 text-accent-peach-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'business': return 'Business';
      case 'driver': return 'Driver';
      case 'admin': return 'Admin';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-accent-beige-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-800 rounded-lg group-hover:bg-secondary-700 transition-colors duration-200">
              <Truck className="h-6 w-6 text-white" />
            </div>
            {/* Desktop Logo Text */}
            <span className="hidden sm:block text-xl font-bold text-primary-800">TruckConnect</span>
            {/* Mobile Logo Text - Flex Column */}
            <div className="flex sm:hidden flex-col leading-tight">
              <span className="text-sm font-bold text-primary-800">Truck</span>
              <span className="text-sm font-bold text-primary-800">Connect</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200 font-medium">
              Services
            </Link>
            <Link to="/features" className="text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200 font-medium">
              Features
            </Link>
            <Link to="/about" className="text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200 font-medium">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button 
                  className="relative p-2 text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-peach-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    disabled={isSigningOut}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-primary-800">{user.name}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(user.type)}`}>
                        {getUserTypeLabel(user.type)}
                      </p>
                    </div>
                  </button>

                  {/* Profile Dropdown - Only show when menu is open and not signing out */}
                  {isProfileMenuOpen && !isSigningOut && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-accent-beige-200 py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-accent-beige-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-accent-beige-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}

                  {/* Sign Out Loading Overlay - Only show when actually signing out */}
                  {isSigningOut && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-accent-beige-200 py-4 z-50">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin text-accent-peach-400" />
                        <span className="text-sm text-secondary-600">Signing out...</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-accent-peach-400 text-white px-4 py-2 rounded-lg hover:bg-accent-peach-500 transition-colors duration-200 font-medium"
                  >
                    Get Started
                  </Link>
                </div>

                {/* Mobile Get Started Button - Always visible on mobile */}
                <div className="flex md:hidden">
                  <Link
                    to="/register"
                    className="bg-accent-peach-400 text-white px-3 py-1.5 rounded-md hover:bg-accent-peach-500 transition-colors duration-200 font-medium text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isSigningOut}
              className="md:hidden p-2 text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only show when not signing out */}
        {isMenuOpen && !isSigningOut && (
          <div className="md:hidden py-4 border-t border-accent-beige-200">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/services"
                className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/features"
                className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth Links in Menu (when not logged in) */}
              {!user && (
                <>
                  <hr className="my-2 border-accent-beige-200" />
                  <Link
                    to="/login"
                    className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}

              {/* Mobile User Profile Links (when logged in) */}
              {user && (
                <>
                  <hr className="my-2 border-accent-beige-200" />
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary-800">{user.name}</p>
                        <p className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(user.type)}`}>
                          {getUserTypeLabel(user.type)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-secondary-600 hover:text-accent-peach-400 hover:bg-accent-beige-100 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="w-full text-left px-3 py-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Mobile Sign Out Loading Overlay - Only show when actually signing out */}
        {isSigningOut && (
          <div className="md:hidden py-4 border-t border-accent-beige-200">
            <div className="flex items-center justify-center space-x-2 px-3 py-2">
              <Loader className="h-4 w-4 animate-spin text-accent-peach-400" />
              <span className="text-sm text-secondary-600">Signing out...</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;