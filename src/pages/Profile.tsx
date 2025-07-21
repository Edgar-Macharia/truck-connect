import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Package, 
  CreditCard, 
  Bell, 
  Shield, 
  Settings, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Truck, 
  Building, 
  FileText, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  Loader
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { user, jobs, auth, toast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'preferences' | 'security' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    jobAlerts: true,
    priceAlerts: true,
    language: 'en',
    currency: 'KES',
    timezone: 'Africa/Nairobi'
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  // Calculate user statistics
  const completedJobs = jobs.filter(job => job.status === 'completed').length;
  const totalSpent = jobs.reduce((sum, job) => sum + job.price, 0);
  const averageJobValue = completedJobs > 0 ? totalSpent / completedJobs : 0;
  const activeJobs = jobs.filter(job => ['posted', 'matched', 'in-progress'].includes(job.status)).length;

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.showSuccess('Profile Updated', 'Your profile has been successfully updated.');
      setIsEditing(false);
    } catch (error) {
      toast.showError('Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.showError('Password Mismatch', 'New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.showError('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.showSuccess('Password Changed', 'Your password has been successfully updated.');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.showError('Password Change Failed', 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
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

  const stats = [
    {
      title: 'Total Spent',
      value: `KES ${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-accent-peach-500',
      change: 'All time'
    },
    {
      title: 'Jobs Completed',
      value: completedJobs,
      icon: CheckCircle,
      color: 'bg-success-500',
      change: 'Successfully delivered'
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: Clock,
      color: 'bg-warning-500',
      change: 'In progress'
    },
    {
      title: 'Average Job Value',
      value: `KES ${averageJobValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-secondary-500',
      change: 'Per job'
    }
  ];

  const recentActivity = [
    { type: 'job_completed', description: 'Job #2 completed successfully', time: '2 hours ago', icon: CheckCircle, color: 'text-success-500' },
    { type: 'payment', description: 'Payment processed for KES 25,600', time: '3 hours ago', icon: DollarSign, color: 'text-accent-peach-500' },
    { type: 'job_started', description: 'Job #1 started - En route to pickup', time: '5 hours ago', icon: Truck, color: 'text-secondary-500' },
    { type: 'profile_updated', description: 'Profile information updated', time: '1 day ago', icon: User, color: 'text-primary-600' },
    { type: 'job_booked', description: 'New job booked for tomorrow', time: '2 days ago', icon: Calendar, color: 'text-accent-sage-500' }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Profile Settings
              {auth.profileLoading && (
                <Loader className="inline h-5 w-5 ml-2 animate-spin text-accent-peach-400" />
              )}
            </h1>
            <p className="text-secondary-600">
              Manage your account settings, preferences, and view your activity across Kenya.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-accent-beige-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary-800">{stat.value}</p>
                  <p className="text-sm text-secondary-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-primary-800 rounded-full flex items-center justify-center mb-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-accent-peach-400 hover:bg-accent-peach-500 text-white p-2 rounded-full transition-colors duration-200">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-primary-800">{user.name}</h3>
                <p className="text-secondary-600 text-sm">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getUserTypeColor(user.type)}`}>
                  {getUserTypeLabel(user.type)}
                </span>
                {user.verified && (
                  <div className="flex items-center justify-center mt-2 text-success-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Verified Account</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile Info', icon: User },
                  { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
                  { id: 'preferences', label: 'Preferences', icon: Settings },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'activity', label: 'Activity Log', icon: Clock }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-accent-peach-100 text-accent-peach-700'
                        : 'text-secondary-600 hover:bg-accent-beige-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              {/* Profile Info Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary-800">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center space-x-2 border border-accent-beige-300 text-secondary-700 px-4 py-2 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleProfileSave}
                          disabled={isSaving}
                          className="flex items-center space-x-2 bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Street address"
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">County/State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Emergency Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={profileData.emergencyContactName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={profileData.emergencyContactPhone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 disabled:bg-accent-beige-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 mb-6">Billing & Payments</h2>
                  
                  <div className="space-y-6">
                    {/* Spending Summary */}
                    <div className="bg-accent-peach-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Spending Summary</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-peach-600">KES {totalSpent.toLocaleString()}</div>
                          <div className="text-sm text-secondary-600">Total Spent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-peach-600">KES {(totalSpent * 0.12).toLocaleString()}</div>
                          <div className="text-sm text-secondary-600">This Month</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-peach-600">KES {averageJobValue.toLocaleString()}</div>
                          <div className="text-sm text-secondary-600">Average per Job</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Payment Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-accent-beige-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-success-100 p-2 rounded">
                              <Phone className="h-5 w-5 text-success-600" />
                            </div>
                            <div>
                              <div className="font-medium">M-Pesa ****1234</div>
                              <div className="text-sm text-secondary-600">Primary payment method</div>
                            </div>
                          </div>
                          <span className="bg-success-100 text-success-700 px-2 py-1 rounded text-xs">Active</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-accent-beige-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-accent-beige-200 p-2 rounded">
                              <CreditCard className="h-5 w-5 text-secondary-600" />
                            </div>
                            <div>
                              <div className="font-medium">Visa ****5678</div>
                              <div className="text-sm text-secondary-600">Backup payment method</div>
                            </div>
                          </div>
                          <span className="bg-accent-beige-200 text-secondary-700 px-2 py-1 rounded text-xs">Backup</span>
                        </div>
                      </div>
                      
                      <button className="mt-4 text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                        + Add Payment Method
                      </button>
                    </div>

                    {/* Recent Transactions */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Recent Transactions</h3>
                      <div className="space-y-3">
                        {jobs.slice(0, 5).map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-4 border border-accent-beige-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="bg-accent-peach-100 p-2 rounded">
                                <Package className="h-5 w-5 text-accent-peach-600" />
                              </div>
                              <div>
                                <div className="font-medium">Job #{job.id}</div>
                                <div className="text-sm text-secondary-600">{new Date(job.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">KES {job.price.toLocaleString()}</div>
                              <div className={`text-sm ${job.status === 'completed' ? 'text-success-600' : 'text-warning-600'}`}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    {/* Notifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS' },
                          { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
                          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content' },
                          { key: 'jobAlerts', label: 'Job Alerts', description: 'Get notified about job updates' },
                          { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified about price changes' }
                        ].map((pref) => (
                          <div key={pref.key} className="flex items-center justify-between p-4 border border-accent-beige-200 rounded-lg">
                            <div>
                              <div className="font-medium text-primary-800">{pref.label}</div>
                              <div className="text-sm text-secondary-600">{pref.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[pref.key as keyof typeof preferences] as boolean}
                                onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-accent-beige-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-peach-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-accent-beige-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-peach-400"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regional Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Regional Settings</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Language</label>
                          <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                          >
                            <option value="en">English</option>
                            <option value="sw">Swahili</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Currency</label>
                          <select
                            value={preferences.currency}
                            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                          >
                            <option value="KES">Kenyan Shilling (KES)</option>
                            <option value="USD">US Dollar (USD)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Timezone</label>
                          <select
                            value={preferences.timezone}
                            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                          >
                            <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="border border-accent-beige-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-800">Password</h3>
                          <p className="text-sm text-secondary-600">Last changed 30 days ago</p>
                        </div>
                        {!isChangingPassword ? (
                          <button
                            onClick={() => setIsChangingPassword(true)}
                            className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                          >
                            Change Password
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsChangingPassword(false)}
                            className="border border-accent-beige-300 text-secondary-700 px-4 py-2 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {isChangingPassword && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Current Password</label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-3 text-secondary-400 hover:text-secondary-600"
                              >
                                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">New Password</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-secondary-400 hover:text-secondary-600"
                              >
                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                            />
                          </div>

                          <button
                            onClick={handlePasswordChange}
                            disabled={isSaving}
                            className="bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                          >
                            {isSaving ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                            <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Account Security */}
                    <div className="border border-accent-beige-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-primary-800 mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-success-500" />
                            <div>
                              <div className="font-medium">Email Verified</div>
                              <div className="text-sm text-secondary-600">Your email address is verified</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="h-5 w-5 text-warning-500" />
                            <div>
                              <div className="font-medium">Two-Factor Authentication</div>
                              <div className="text-sm text-secondary-600">Add an extra layer of security</div>
                            </div>
                          </div>
                          <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="text-2xl font-bold text-primary-800 mb-6">Activity Log</h2>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border border-accent-beige-200 rounded-lg">
                        <div className={`p-2 rounded-full bg-accent-beige-100`}>
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-primary-800">{activity.description}</div>
                          <div className="text-sm text-secondary-600">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                      View All Activity
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;