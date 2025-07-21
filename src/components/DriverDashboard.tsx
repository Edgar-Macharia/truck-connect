import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  Package,
  Users,
  Calendar,
  Map,
  List,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  Route,
  Fuel,
  Settings,
  Eye,
  EyeOff,
  X,
  Timer,
  Play,
  Pause,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import GoogleMap from './GoogleMap';

interface JobRequest {
  id: string;
  customerId: string;
  customer: {
    name: string;
    phone: string;
    rating: number;
    totalJobs: number;
    avatar?: string;
  };
  pickup: {
    address: string;
    lat: number;
    lng: number;
    instructions?: string;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
    instructions?: string;
  };
  cargo: {
    type: string;
    weight: number;
    description: string;
    specialRequirements?: string[];
  };
  scheduledTime: string;
  estimatedDuration: number;
  distance: number;
  totalPayment: number;
  driverEarnings: number;
  urgencyLevel: 1 | 2 | 3 | 4 | 5;
  expiresAt: string;
  notes?: string;
  createdAt: string;
}

const DriverDashboard: React.FC = () => {
  const { user, jobs } = useApp();
  const [activeTab, setActiveTab] = useState<'job-requests' | 'current-job' | 'job-history' | 'earnings' | 'overview'>('job-requests');
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<JobRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // Online time tracking
  const [onlineStartTime, setOnlineStartTime] = useState<Date | null>(null);
  const [totalOnlineTime, setTotalOnlineTime] = useState(0); // in minutes
  const [currentSessionTime, setCurrentSessionTime] = useState(0); // in minutes

  useEffect(() => {
    // Initialize online time tracking
    const savedOnlineTime = localStorage.getItem('driver-online-time-today');
    const savedDate = localStorage.getItem('driver-online-date');
    const today = new Date().toDateString();

    if (savedDate === today && savedOnlineTime) {
      setTotalOnlineTime(parseInt(savedOnlineTime));
    } else {
      // New day, reset time
      setTotalOnlineTime(0);
      localStorage.setItem('driver-online-date', today);
      localStorage.setItem('driver-online-time-today', '0');
    }

    // If driver is online, start tracking
    if (isOnline) {
      setOnlineStartTime(new Date());
    }
  }, []);

  // Update online time every minute
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOnline && onlineStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const sessionMinutes = Math.floor((now.getTime() - onlineStartTime.getTime()) / (1000 * 60));
        setCurrentSessionTime(sessionMinutes);

        // Update total time and save to localStorage
        const newTotalTime = totalOnlineTime + sessionMinutes;
        localStorage.setItem('driver-online-time-today', newTotalTime.toString());
      }, 60000); // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, onlineStartTime, totalOnlineTime]);

  const formatOnlineTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalOnlineTimeToday = () => {
    return totalOnlineTime + currentSessionTime;
  };

  const handleOnlineToggle = () => {
    if (isOnline) {
      // Going offline - save the session time
      if (onlineStartTime) {
        const sessionMinutes = Math.floor((new Date().getTime() - onlineStartTime.getTime()) / (1000 * 60));
        const newTotalTime = totalOnlineTime + sessionMinutes;
        setTotalOnlineTime(newTotalTime);
        localStorage.setItem('driver-online-time-today', newTotalTime.toString());
      }
      setOnlineStartTime(null);
      setCurrentSessionTime(0);
    } else {
      // Going online - start new session
      setOnlineStartTime(new Date());
    }
    setIsOnline(!isOnline);
  };

  useEffect(() => {
    // Get driver's current location (default to Nairobi, Kenya)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Nairobi, Kenya
          setDriverLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    } else {
      // Default to Nairobi, Kenya
      setDriverLocation({ lat: -1.2921, lng: 36.8219 });
    }

    // Mock current job for driver with Kenyan locations
    const mockCurrentJob: Job = {
      id: 'job-current-1',
      userId: 'user-123',
      driverId: user?.id || '',
      status: 'in-progress',
      pickup: {
        address: 'Westlands Square, Nairobi',
        lat: -1.2921,
        lng: 36.8219
      },
      dropoff: {
        address: 'Industrial Area, Nairobi',
        lat: -1.3197,
        lng: 36.9275
      },
      cargo: {
        type: 'Electronics',
        weight: 500,
        description: 'Computer equipment for office setup'
      },
      scheduledTime: '2024-01-20T14:00:00Z',
      estimatedDuration: 180,
      price: 18500, // KES
      bookingType: 'hourly',
      durationHours: 4,
      createdAt: '2024-01-20T10:00:00Z'
    };

    setCurrentJob(mockCurrentJob);

    // Mock job requests with Kenyan locations and realistic scenarios
    const mockJobRequests: JobRequest[] = [
      {
        id: 'req-001',
        customerId: 'customer-001',
        customer: {
          name: 'Sarah Wanjiku',
          phone: '+254-722-123-456',
          rating: 4.8,
          totalJobs: 23,
          avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
        },
        pickup: {
          address: 'Sarit Centre, Westlands, Nairobi',
          lat: -1.2634,
          lng: 36.8155,
          instructions: 'Meet at the main entrance near Nakumatt'
        },
        dropoff: {
          address: 'Karen Shopping Centre, Karen, Nairobi',
          lat: -1.3197,
          lng: 36.7073,
          instructions: 'Deliver to the loading bay behind the mall'
        },
        cargo: {
          type: 'Furniture',
          weight: 850,
          description: 'Office furniture - 2 desks, 4 chairs, filing cabinet',
          specialRequirements: ['Fragile items', 'Loading assistance required']
        },
        scheduledTime: '2024-01-20T16:00:00Z',
        estimatedDuration: 120,
        distance: 15.2,
        totalPayment: 12500,
        driverEarnings: 10000,
        urgencyLevel: 3,
        expiresAt: '2024-01-20T15:30:00Z',
        notes: 'Please handle with care - new office furniture',
        createdAt: '2024-01-20T14:15:00Z'
      },
      {
        id: 'req-002',
        customerId: 'customer-002',
        customer: {
          name: 'David Kimani',
          phone: '+254-733-987-654',
          rating: 4.9,
          totalJobs: 45,
        },
        pickup: {
          address: 'JKIA Cargo Terminal, Nairobi',
          lat: -1.3192,
          lng: 36.9275,
          instructions: 'Cargo terminal gate 3, ask for David'
        },
        dropoff: {
          address: 'Mombasa Road Industrial Area, Nairobi',
          lat: -1.3197,
          lng: 36.9275,
          instructions: 'Warehouse 15B, security will guide you'
        },
        cargo: {
          type: 'Electronics',
          weight: 1200,
          description: 'Imported electronics - laptops and accessories',
          specialRequirements: ['Time-sensitive delivery', 'Special handling required']
        },
        scheduledTime: '2024-01-20T18:00:00Z',
        estimatedDuration: 90,
        distance: 8.5,
        totalPayment: 15000,
        driverEarnings: 12000,
        urgencyLevel: 4,
        expiresAt: '2024-01-20T17:00:00Z',
        notes: 'High-value cargo, please ensure secure transport',
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'req-003',
        customerId: 'customer-003',
        customer: {
          name: 'Grace Achieng',
          phone: '+254-712-456-789',
          rating: 4.6,
          totalJobs: 12,
        },
        pickup: {
          address: 'Tuskys Supermarket, Thika Road, Nairobi',
          lat: -1.2297,
          lng: 36.8890,
          instructions: 'Loading dock at the back of the store'
        },
        dropoff: {
          address: 'Kiambu Town, Kiambu County',
          lat: -1.1748,
          lng: 36.8356,
          instructions: 'Residential area - call on arrival'
        },
        cargo: {
          type: 'General',
          weight: 300,
          description: 'Household supplies and groceries',
          specialRequirements: ['Multiple stops']
        },
        scheduledTime: '2024-01-20T19:30:00Z',
        estimatedDuration: 150,
        distance: 22.1,
        totalPayment: 8500,
        driverEarnings: 6800,
        urgencyLevel: 2,
        expiresAt: '2024-01-20T18:30:00Z',
        notes: 'Family moving supplies, please be patient with loading',
        createdAt: '2024-01-20T14:45:00Z'
      },
      {
        id: 'req-004',
        customerId: 'customer-004',
        customer: {
          name: 'Peter Mwangi',
          phone: '+254-744-321-987',
          rating: 4.7,
          totalJobs: 8,
        },
        pickup: {
          address: 'Nyayo Stadium, Nairobi',
          lat: -1.3031,
          lng: 36.8344,
          instructions: 'Event equipment at the main gate'
        },
        dropoff: {
          address: 'KICC, Nairobi CBD',
          lat: -1.2921,
          lng: 36.8219,
          instructions: 'Conference hall setup - basement loading'
        },
        cargo: {
          type: 'Construction',
          weight: 2000,
          description: 'Event staging equipment and sound systems',
          specialRequirements: ['Heavy lifting equipment needed', 'Time-sensitive delivery']
        },
        scheduledTime: '2024-01-21T07:00:00Z',
        estimatedDuration: 180,
        distance: 12.8,
        totalPayment: 20000,
        driverEarnings: 16000,
        urgencyLevel: 5,
        expiresAt: '2024-01-20T20:00:00Z',
        notes: 'URGENT: Event setup for tomorrow morning conference',
        createdAt: '2024-01-20T15:00:00Z'
      }
    ];

    setJobRequests(mockJobRequests);
  }, [user]);

  const handleAcceptJob = (request: JobRequest) => {
    // Convert job request to current job
    const newJob: Job = {
      id: request.id,
      userId: request.customerId,
      driverId: user?.id || '',
      status: 'accepted',
      pickup: request.pickup,
      dropoff: request.dropoff,
      cargo: request.cargo,
      scheduledTime: request.scheduledTime,
      estimatedDuration: request.estimatedDuration,
      price: request.totalPayment,
      bookingType: 'hourly',
      durationHours: Math.ceil(request.estimatedDuration / 60),
      createdAt: request.createdAt
    };

    setCurrentJob(newJob);
    setJobRequests(prev => prev.filter(req => req.id !== request.id));
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
    setActiveTab('current-job');
  };

  const handleDeclineJob = (requestId: string) => {
    setJobRequests(prev => prev.filter(req => req.id !== requestId));
    setIsRequestModalOpen(false);
    setSelectedRequest(null);
  };

  const getUrgencyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-accent-beige-100 text-secondary-700';
      case 2: return 'bg-accent-sage-100 text-accent-sage-700';
      case 3: return 'bg-warning-100 text-warning-700';
      case 4: return 'bg-accent-peach-100 text-accent-peach-700';
      case 5: return 'bg-error-100 text-error-700';
      default: return 'bg-accent-beige-100 text-secondary-700';
    }
  };

  const getUrgencyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Low';
      case 2: return 'Normal';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Urgent';
      default: return 'Normal';
    }
  };

  const isRequestExpiringSoon = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const timeLeft = expiryTime - now;
    return timeLeft <= 30 * 60 * 1000; // 30 minutes
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const timeLeft = expiryTime - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m left`;
    }
    return `${minutes}m left`;
  };

  const stats = [
    {
      title: 'Online Today',
      value: formatOnlineTime(getTotalOnlineTimeToday()),
      icon: Timer,
      color: 'bg-accent-peach-500',
      change: isOnline ? 'Currently online' : 'Offline'
    },
    {
      title: 'Today\'s Earnings',
      value: 'KES 12,450',
      icon: DollarSign,
      color: 'bg-success-500',
      change: '+12% from yesterday'
    },
    {
      title: 'Jobs Completed',
      value: '8',
      icon: CheckCircle,
      color: 'bg-accent-peach-500',
      change: 'This week'
    },
    {
      title: 'Average Rating',
      value: '4.9',
      icon: Star,
      color: 'bg-warning-500',
      change: 'Based on 156 reviews'
    }
  ];

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in-progress': return 'bg-accent-peach-100 text-accent-peach-700';
      case 'posted': return 'bg-warning-100 text-warning-700';
      case 'cancelled': return 'bg-error-100 text-error-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  const mapMarkers = [];
  
  if (driverLocation) {
    mapMarkers.push({
      position: driverLocation,
      title: 'Your Current Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
  }

  if (currentJob) {
    mapMarkers.push(
      {
        position: currentJob.pickup,
        title: 'Pickup Location',
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      {
        position: currentJob.dropoff,
        title: 'Dropoff Location',
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    );
  }

  return (
    <div className="min-h-screen bg-accent-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Driver Dashboard
            </h1>
            <p className="text-secondary-600">
              Welcome back, {user?.name}! Manage your trips and track your earnings across Kenya.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success-500' : 'bg-error-500'}`}></div>
              <span className="text-sm font-medium text-secondary-700">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {isOnline && (
                <span className="text-xs text-secondary-500">
                  ({formatOnlineTime(getTotalOnlineTimeToday())} today)
                </span>
              )}
            </div>
            <button
              onClick={handleOnlineToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isOnline 
                  ? 'bg-error-600 hover:bg-error-700 text-white' 
                  : 'bg-success-600 hover:bg-success-700 text-white'
              }`}
            >
              {isOnline ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200">
          <div className="border-b border-accent-beige-200">
            <nav className="flex space-x-8 px-6">
              {[
                { 
                  id: 'job-requests', 
                  label: 'Job Requests', 
                  icon: Search,
                  badge: jobRequests.length > 0 ? jobRequests.length : undefined
                },
                { id: 'current-job', label: 'Current Job', icon: Navigation },
                { id: 'job-history', label: 'Job History', icon: Package },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
                { id: 'overview', label: 'Overview', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm relative ${
                    activeTab === tab.id
                      ? 'border-accent-peach-400 text-accent-peach-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-accent-beige-300'
                  } transition-colors duration-200`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'job-requests' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-800">
                    Incoming Job Requests ({jobRequests.length})
                  </h3>
                  {!isOnline && (
                    <div className="bg-warning-50 border border-warning-200 rounded-lg px-4 py-2">
                      <span className="text-warning-700 text-sm font-medium">
                        Go online to receive job requests
                      </span>
                    </div>
                  )}
                </div>

                {jobRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">No Job Requests</h3>
                    <p className="text-secondary-600 mb-6">
                      {isOnline 
                        ? "You're online and ready to receive job requests. New requests will appear here."
                        : "Go online to start receiving job requests from customers in your area."
                      }
                    </p>
                    {!isOnline && (
                      <button 
                        onClick={handleOnlineToggle}
                        className="bg-success-600 hover:bg-success-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        Go Online
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobRequests.map((request) => (
                      <div 
                        key={request.id} 
                        className={`border rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
                          isRequestExpiringSoon(request.expiresAt) 
                            ? 'border-warning-300 bg-warning-50' 
                            : 'border-accent-beige-200 bg-white'
                        }`}
                      >
                        {/* Request Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center">
                              {request.customer.avatar ? (
                                <img 
                                  src={request.customer.avatar} 
                                  alt={request.customer.name} 
                                  className="w-12 h-12 rounded-full object-cover" 
                                />
                              ) : (
                                <User className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary-800">{request.customer.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                                <Star className="h-4 w-4 text-warning-500" />
                                <span>{request.customer.rating.toFixed(1)}</span>
                                <span>•</span>
                                <span>{request.customer.totalJobs} jobs</span>
                                <span>•</span>
                                <span>{request.customer.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                              {getUrgencyLabel(request.urgencyLevel)}
                            </span>
                            <span className={`text-xs font-medium ${
                              isRequestExpiringSoon(request.expiresAt) ? 'text-warning-600' : 'text-secondary-500'
                            }`}>
                              {getTimeUntilExpiry(request.expiresAt)}
                            </span>
                          </div>
                        </div>

                        {/* Trip Details */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <div className="w-3 h-3 bg-success-500 rounded-full mt-2"></div>
                              <div>
                                <p className="text-sm font-medium text-secondary-700">Pickup</p>
                                <p className="text-secondary-600">{request.pickup.address}</p>
                                {request.pickup.instructions && (
                                  <p className="text-xs text-secondary-500 italic">{request.pickup.instructions}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-3 h-3 bg-error-500 rounded-full mt-2"></div>
                              <div>
                                <p className="text-sm font-medium text-secondary-700">Dropoff</p>
                                <p className="text-secondary-600">{request.dropoff.address}</p>
                                {request.dropoff.instructions && (
                                  <p className="text-xs text-secondary-500 italic">{request.dropoff.instructions}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-secondary-700">Cargo</p>
                              <p className="text-secondary-600">{request.cargo.type} • {request.cargo.weight} kg</p>
                              <p className="text-xs text-secondary-500">{request.cargo.description}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-secondary-700">Schedule</p>
                              <p className="text-secondary-600">
                                {new Date(request.scheduledTime).toLocaleString()} 
                                <span className="text-secondary-500"> • {request.estimatedDuration} min</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Special Requirements */}
                        {request.cargo.specialRequirements && request.cargo.specialRequirements.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-secondary-700 mb-2">Special Requirements</p>
                            <div className="flex flex-wrap gap-2">
                              {request.cargo.specialRequirements.map((req, index) => (
                                <span 
                                  key={index}
                                  className="bg-accent-peach-100 text-accent-peach-700 px-2 py-1 rounded text-xs"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {request.notes && (
                          <div className="mb-4 p-3 bg-accent-beige-50 rounded-lg">
                            <p className="text-sm font-medium text-secondary-700 mb-1">Customer Notes</p>
                            <p className="text-secondary-600 text-sm">{request.notes}</p>
                          </div>
                        )}

                        {/* Payment & Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-secondary-600">Total Payment</p>
                              <p className="text-lg font-bold text-primary-800">KES {request.totalPayment.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-600">Your Earnings (80%)</p>
                              <p className="text-lg font-bold text-success-600">KES {request.driverEarnings.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-600">Distance</p>
                              <p className="text-sm font-medium text-secondary-700">{request.distance} km</p>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsRequestModalOpen(true);
                              }}
                              className="bg-accent-beige-200 hover:bg-accent-beige-300 text-secondary-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeclineJob(request.id)}
                              className="bg-error-100 hover:bg-error-200 text-error-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptJob(request)}
                              className="bg-success-600 hover:bg-success-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                              Accept Job
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'current-job' && (
              <div className="space-y-6">
                {currentJob ? (
                  <>
                    {/* Current Job Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-primary-800">Current Job</h3>
                        <p className="text-secondary-600">Job #{currentJob.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(currentJob.status)}`}>
                        {currentJob.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Job Details */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Left Column - Job Info */}
                      <div className="space-y-4">
                        <div className="bg-accent-beige-50 rounded-lg p-4">
                          <h4 className="font-medium text-primary-800 mb-3">Trip Details</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-success-500 rounded-full mt-2"></div>
                              <div>
                                <p className="text-sm font-medium text-secondary-700">Pickup</p>
                                <p className="text-secondary-600">{currentJob.pickup.address}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-3 h-3 bg-error-500 rounded-full mt-2"></div>
                              <div>
                                <p className="text-sm font-medium text-secondary-700">Dropoff</p>
                                <p className="text-secondary-600">{currentJob.dropoff.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent-beige-50 rounded-lg p-4">
                          <h4 className="font-medium text-primary-800 mb-3">Cargo Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-secondary-600">Type:</span>
                              <span className="font-medium">{currentJob.cargo.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary-600">Weight:</span>
                              <span className="font-medium">{currentJob.cargo.weight} kg</span>
                            </div>
                            <div className="mt-2">
                              <span className="text-secondary-600">Description:</span>
                              <p className="text-primary-800 mt-1">{currentJob.cargo.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent-peach-50 rounded-lg p-4">
                          <h4 className="font-medium text-accent-peach-800 mb-3">Job Value</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-accent-peach-700">Total Payment:</span>
                              <span className="font-bold text-accent-peach-800">KES {currentJob.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-accent-peach-700">Your Earnings (80%):</span>
                              <span className="font-bold text-accent-peach-800">KES {(currentJob.price * 0.8).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                          <button className="flex items-center justify-center space-x-2 bg-success-600 hover:bg-success-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                            <Phone className="h-4 w-4" />
                            <span>Call Customer</span>
                          </button>
                          <button className="flex items-center justify-center space-x-2 bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                            <MessageCircle className="h-4 w-4" />
                            <span>Message</span>
                          </button>
                        </div>

                        <button className="w-full bg-warning-600 hover:bg-warning-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                          Mark as Completed
                        </button>
                      </div>

                      {/* Right Column - Map */}
                      <div className="space-y-4">
                        <div className="bg-accent-beige-50 rounded-lg p-4">
                          <h4 className="font-medium text-primary-800 mb-3">Route Map</h4>
                          <GoogleMap
                            center={driverLocation || { lat: -1.2921, lng: 36.8219 }}
                            zoom={12}
                            markers={mapMarkers}
                            className="w-full h-64 rounded-lg"
                          />
                        </div>

                        <div className="bg-accent-beige-50 rounded-lg p-4">
                          <h4 className="font-medium text-primary-800 mb-3">Navigation</h4>
                          <div className="space-y-3">
                            <button className="w-full flex items-center justify-center space-x-2 bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                              <Navigation className="h-4 w-4" />
                              <span>Navigate to Pickup</span>
                            </button>
                            <button className="w-full flex items-center justify-center space-x-2 bg-secondary-600 hover:bg-secondary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200">
                              <Route className="h-4 w-4" />
                              <span>View Full Route</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-warning-600 mr-2" />
                            <span className="font-medium text-warning-800">Trip Progress</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-warning-700 mb-1">
                              <span>En route to pickup</span>
                              <span>ETA: 12 min</span>
                            </div>
                            <div className="w-full bg-warning-200 rounded-full h-2">
                              <div className="bg-warning-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">No Active Jobs</h3>
                    <p className="text-secondary-600 mb-6">You don't have any active jobs at the moment.</p>
                    <button 
                      onClick={() => setActiveTab('job-requests')}
                      className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      View Job Requests
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'job-history' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-800">Job History</h3>
                  <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="border border-accent-beige-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-accent-peach-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-accent-peach-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary-800">Job #{job.id}</h4>
                            <p className="text-sm text-secondary-600">
                              {job.cargo.type} • {job.bookingType === 'hourly' ? `${job.durationHours} hours` : `${job.durationHours} days`}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(job.status)}`}>
                          {job.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-secondary-600">
                          <MapPin className="h-4 w-4" />
                          <span>From: {job.pickup.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-secondary-600">
                          <MapPin className="h-4 w-4" />
                          <span>To: {job.dropoff.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-secondary-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(job.scheduledTime).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>KES {(job.price * 0.8).toLocaleString()} earned</span>
                          </span>
                        </div>
                        <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-success-50 rounded-lg p-6">
                    <h4 className="font-medium text-success-800 mb-2">Today's Earnings</h4>
                    <p className="text-2xl font-bold text-success-600">KES 12,450</p>
                    <p className="text-sm text-success-700 mt-1">8 jobs completed</p>
                  </div>
                  <div className="bg-accent-peach-50 rounded-lg p-6">
                    <h4 className="font-medium text-accent-peach-800 mb-2">This Week</h4>
                    <p className="text-2xl font-bold text-accent-peach-600">KES 62,340</p>
                    <p className="text-sm text-accent-peach-700 mt-1">32 jobs completed</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-6">
                    <h4 className="font-medium text-secondary-800 mb-2">This Month</h4>
                    <p className="text-2xl font-bold text-secondary-600">KES 234,750</p>
                    <p className="text-sm text-secondary-700 mt-1">128 jobs completed</p>
                  </div>
                </div>

                <div className="bg-white border border-accent-beige-200 rounded-lg p-6">
                  <h4 className="font-medium text-primary-800 mb-4">Recent Payments</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-accent-beige-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-primary-800">Job #job-{index + 1}</p>
                          <p className="text-sm text-secondary-600">Jan {20 - index}, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-success-600">+KES {(Math.random() * 5000 + 2500).toFixed(0)}</p>
                          <p className="text-sm text-secondary-600">Paid</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-accent-peach-400 to-accent-peach-500 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Driver Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Acceptance Rate:</span>
                        <span className="font-bold">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>On-time Rate:</span>
                        <span className="font-bold">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Rating:</span>
                        <span className="font-bold">4.9/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Online Time Today:</span>
                        <span className="font-bold">{formatOnlineTime(getTotalOnlineTimeToday())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-white hover:bg-accent-beige-100 text-secondary-700 px-4 py-2 rounded-lg transition-colors duration-200 text-left border border-accent-beige-200">
                        🚚 Update Vehicle Information
                      </button>
                      <button className="w-full bg-white hover:bg-accent-beige-100 text-secondary-700 px-4 py-2 rounded-lg transition-colors duration-200 text-left border border-accent-beige-200">
                        📍 Update Availability Zone
                      </button>
                      <button className="w-full bg-white hover:bg-accent-beige-100 text-secondary-700 px-4 py-2 rounded-lg transition-colors duration-200 text-left border border-accent-beige-200">
                        💰 View Payment Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Request Details Modal */}
      {selectedRequest && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${isRequestModalOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-accent-beige-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-accent-beige-200">
              <div>
                <h2 className="text-2xl font-bold text-primary-800">Job Request Details</h2>
                <p className="text-secondary-600">Request from {selectedRequest.customer.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsRequestModalOpen(false);
                  setSelectedRequest(null);
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-accent-beige-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-800 mb-3">Customer Information</h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-primary-800 rounded-full flex items-center justify-center">
                        {selectedRequest.customer.avatar ? (
                          <img 
                            src={selectedRequest.customer.avatar} 
                            alt={selectedRequest.customer.name} 
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary-800">{selectedRequest.customer.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-secondary-600">
                          <Star className="h-4 w-4 text-warning-500" />
                          <span>{selectedRequest.customer.rating.toFixed(1)} rating</span>
                          <span>•</span>
                          <span>{selectedRequest.customer.totalJobs} completed jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Phone className="h-4 w-4" />
                      <span>{selectedRequest.customer.phone}</span>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="bg-accent-beige-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-800 mb-3">Trip Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-success-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Pickup Location</p>
                          <p className="text-secondary-600">{selectedRequest.pickup.address}</p>
                          {selectedRequest.pickup.instructions && (
                            <p className="text-xs text-secondary-500 italic mt-1">{selectedRequest.pickup.instructions}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-error-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Dropoff Location</p>
                          <p className="text-secondary-600">{selectedRequest.dropoff.address}</p>
                          {selectedRequest.dropoff.instructions && (
                            <p className="text-xs text-secondary-500 italic mt-1">{selectedRequest.dropoff.instructions}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Scheduled Time</p>
                          <p className="text-secondary-600">{new Date(selectedRequest.scheduledTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Duration</p>
                          <p className="text-secondary-600">{selectedRequest.estimatedDuration} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cargo Details */}
                  <div className="bg-accent-beige-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-800 mb-3">Cargo Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Type</p>
                          <p className="text-secondary-600">{selectedRequest.cargo.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Weight</p>
                          <p className="text-secondary-600">{selectedRequest.cargo.weight} kg</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-700">Description</p>
                        <p className="text-secondary-600">{selectedRequest.cargo.description}</p>
                      </div>
                      {selectedRequest.cargo.specialRequirements && selectedRequest.cargo.specialRequirements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-secondary-700 mb-2">Special Requirements</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.cargo.specialRequirements.map((req, index) => (
                              <span 
                                key={index}
                                className="bg-accent-peach-100 text-accent-peach-700 px-2 py-1 rounded text-xs"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-accent-peach-50 rounded-lg p-4">
                    <h3 className="font-semibold text-accent-peach-800 mb-3">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-accent-peach-700">Total Payment:</span>
                        <span className="font-bold text-accent-peach-800">KES {selectedRequest.totalPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-accent-peach-700">Your Earnings (80%):</span>
                        <span className="font-bold text-accent-peach-800">KES {selectedRequest.driverEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-accent-peach-700">Distance:</span>
                        <span className="font-medium text-accent-peach-800">{selectedRequest.distance} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Map & Actions */}
                <div className="space-y-6">
                  {/* Map */}
                  <div className="bg-accent-beige-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-800 mb-3">Route Map</h3>
                    <GoogleMap
                      center={selectedRequest.pickup}
                      zoom={12}
                      markers={[
                        {
                          position: selectedRequest.pickup,
                          title: 'Pickup Location',
                          icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        },
                        {
                          position: selectedRequest.dropoff,
                          title: 'Dropoff Location',
                          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }
                      ]}
                      className="w-full h-64 rounded-lg"
                    />
                  </div>

                  {/* Request Status */}
                  <div className={`rounded-lg p-4 ${
                    isRequestExpiringSoon(selectedRequest.expiresAt) 
                      ? 'bg-warning-50 border border-warning-200' 
                      : 'bg-accent-beige-50 border border-accent-beige-200'
                  }`}>
                    <div className="flex items-center">
                      <AlertCircle className={`h-5 w-5 mr-2 ${
                        isRequestExpiringSoon(selectedRequest.expiresAt) ? 'text-warning-600' : 'text-secondary-600'
                      }`} />
                      <span className="font-medium text-primary-800">Request Status</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`${
                          isRequestExpiringSoon(selectedRequest.expiresAt) ? 'text-warning-700' : 'text-secondary-700'
                        }`}>
                          {getTimeUntilExpiry(selectedRequest.expiresAt)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(selectedRequest.urgencyLevel)}`}>
                          {getUrgencyLabel(selectedRequest.urgencyLevel)} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {selectedRequest.notes && (
                    <div className="bg-accent-beige-50 rounded-lg p-4">
                      <h3 className="font-semibold text-primary-800 mb-3">Customer Notes</h3>
                      <p className="text-secondary-600">{selectedRequest.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAcceptJob(selectedRequest)}
                      className="w-full bg-success-600 hover:bg-success-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Accept Job - KES {selectedRequest.driverEarnings.toLocaleString()}</span>
                    </button>
                    <button
                      onClick={() => handleDeclineJob(selectedRequest.id)}
                      className="w-full bg-error-100 hover:bg-error-200 text-error-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Decline Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;