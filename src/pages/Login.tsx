import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast, auth } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    // Check for verification message
    const message = searchParams.get('message');
    if (message === 'verify-email') {
      toast.showInfo(
        'Email Verification Required',
        'Please check your email and click the verification link to activate your account.'
      );
    }
  }, [searchParams, toast]);

  // Redirect if already logged in (but don't show loading state)
  useEffect(() => {
    // Only redirect if we have a user and auth is not loading
    if (auth.user && !auth.loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth.user, auth.loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.showError('Login Failed', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, error } = await auth.signIn(formData.email, formData.password);

      if (error) {
        if (error.includes('Invalid login credentials')) {
          toast.showError('Login Failed', 'Invalid email or password. Please try again.');
        } else if (error.includes('Email not confirmed')) {
          toast.showWarning('Email Not Verified', 'Please check your email and click the verification link.');
        } else {
          toast.showError('Login Failed', error);
        }
        return;
      }

      if (user) {
        toast.showSuccess('Welcome Back!', 'You have successfully signed in to your account.');
        // Navigation will be handled by the useEffect above when auth.user updates
      }
    } catch (error: any) {
      toast.showError('Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show redirect loading only if we have a user (already authenticated)
  if (auth.user) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-8 w-8 text-success-500 mx-auto mb-4" />
          <p className="text-secondary-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center py-12 px-4 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1" 
          alt="TruckConnect login background" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div className="relative max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-accent-beige-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">Welcome Back</h1>
            <p className="text-secondary-600">Sign in to your TruckConnect account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 transition-colors duration-200 disabled:opacity-50"
                  placeholder="Enter your password"
                  required
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-accent-peach-400 focus:ring-accent-peach-400 border-accent-beige-300 rounded disabled:opacity-50"
                />
                <label className="ml-2 block text-sm text-secondary-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-accent-peach-400 hover:text-accent-peach-500 font-medium"
                onClick={() => toast.showInfo('Password Reset', 'Password reset functionality will be available soon.')}
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-accent-beige-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => toast.showInfo('Coming Soon', 'Google sign-in will be available soon.')}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-2 px-4 border border-accent-beige-300 rounded-lg shadow-sm text-sm font-medium text-secondary-500 bg-white hover:bg-accent-beige-50 transition-colors duration-200 disabled:opacity-50"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                disabled={isSubmitting}
                className="text-accent-peach-400 hover:text-accent-peach-500 font-medium disabled:opacity-50"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;