import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Building, Truck, Eye, EyeOff, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast, auth } = useApp();
  
  const [userType, setUserType] = useState<'individual' | 'business' | 'driver'>(
    (searchParams.get('type') as 'driver') || 'individual'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Driver specific
    licenseNumber: '',
    truckType: 'pickup',
    truckCapacity: '2000',
    // Business specific
    companyName: '',
    businessType: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password || !formData.name) {
      toast.showError('Registration Failed', 'Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.showError('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    if (formData.password.length < 6) {
      toast.showWarning('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    // Role-specific validation
    if (userType === 'business' && !formData.companyName) {
      toast.showError('Missing Information', 'Company name is required for business accounts.');
      return;
    }

    if (userType === 'driver' && !formData.licenseNumber) {
      toast.showError('Missing Information', 'License number is required for driver accounts.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        name: userType === 'business' ? formData.companyName : formData.name,
        phone: formData.phone,
        role: userType,
        companyName: formData.companyName,
        businessType: formData.businessType,
        licenseNumber: formData.licenseNumber,
        truckType: formData.truckType,
        truckCapacity: parseInt(formData.truckCapacity),
      };

      const { user, error } = await auth.signUp(formData.email, formData.password, userData);

      if (error) {
        toast.showError('Registration Failed', error);
        return;
      }

      if (user) {
        // Show success message
        toast.showSuccess(
          'Account Created!', 
          `Welcome to TruckConnect! Your ${userType} account has been created successfully.`
        );
        
        // Auto-login: Sign in the user immediately after registration
        const { user: signInUser, error: signInError } = await auth.signIn(formData.email, formData.password);
        
        if (signInError) {
          // If auto-login fails, redirect to login page
          toast.showInfo('Please Sign In', 'Account created successfully. Please sign in to continue.');
          navigate('/login');
          return;
        }
        
        if (signInUser) {
          // Show additional success message for auto-login
          toast.showSuccess('Welcome!', 'You have been automatically signed in.');
          
          // The auth state change will handle navigation to dashboard
          // But we can also navigate directly to ensure it happens
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        }
      }
    } catch (error: any) {
      toast.showError('Registration Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypes = [
    {
      type: 'individual' as const,
      icon: User,
      title: 'Individual',
      description: 'Personal transportation needs'
    },
    {
      type: 'business' as const,
      icon: Building,
      title: 'Business',
      description: 'Commercial shipping solutions'
    },
    {
      type: 'driver' as const,
      icon: Truck,
      title: 'Driver',
      description: 'Join our driver network'
    }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50 py-12 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
          alt="Join TruckConnect today" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div className="relative max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-accent-beige-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">Create Account</h1>
            <p className="text-secondary-600">Join TruckConnect today</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-secondary-700 mb-4">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {userTypes.map((type) => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => setUserType(type.type)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    userType === type.type
                      ? 'border-accent-peach-400 bg-accent-peach-50'
                      : 'border-accent-beige-300 hover:border-accent-beige-400'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <type.icon className={`h-5 w-5 mx-auto mb-2 ${
                    userType === type.type ? 'text-accent-peach-500' : 'text-secondary-400'
                  }`} />
                  <div className={`text-xs font-medium leading-tight ${
                    userType === type.type ? 'text-accent-peach-700' : 'text-secondary-600'
                  }`}>
                    {type.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {userType === 'business' ? 'Company Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name={userType === 'business' ? 'companyName' : 'name'}
                value={userType === 'business' ? formData.companyName : formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                required
              />
            </div>

            {/* For business accounts, also collect contact person name */}
            {userType === 'business' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
              />
            </div>

            {/* Driver-specific fields */}
            {userType === 'driver' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Driver's License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Truck Type
                  </label>
                  <select
                    name="truckType"
                    value={formData.truckType}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                    required
                  >
                    <option value="pickup">Pickup Truck</option>
                    <option value="box">Box Truck</option>
                    <option value="flatbed">Flatbed</option>
                    <option value="semi">Semi-Trailer</option>
                    <option value="refrigerated">Refrigerated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Cargo Capacity (kg)
                  </label>
                  <input
                    type="number"
                    name="truckCapacity"
                    value={formData.truckCapacity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                    required
                  />
                </div>
              </>
            )}

            {/* Business-specific fields */}
            {userType === 'business' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="construction">Construction</option>
                  <option value="logistics">Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 pr-10 disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-3 text-secondary-400 hover:text-secondary-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                disabled={isSubmitting}
                className="text-accent-peach-400 hover:text-accent-peach-500 font-medium disabled:opacity-50"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;