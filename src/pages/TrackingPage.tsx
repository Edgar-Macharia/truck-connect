import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin, 
  Navigation, 
  Clock, 
  Phone,
  User,
  Star,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Route,
  Play,
  Pause,
  Send,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GoogleMap from '../components/GoogleMap';

interface TrackingData {
  requestId: string;
  status: 'en_route_pickup' | 'at_pickup' | 'en_route_delivery' | 'at_delivery' | 'completed';
  currentLocation: {
    lat: number;
    lng: number;
  };
  estimatedArrival: string;
  progress: number; // 0-100
  lastUpdated: string;
  driver: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    avatar?: string;
  };
  pickup: {
    address: string;
    lat: number;
    lng: number;
    contactName?: string;
    contactPhone?: string;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
    contactName?: string;
    contactPhone?: string;
  };
  cargo: {
    type: string;
    weight: number;
    description: string;
  };
  scheduledTime: string;
  price: number;
  projectCode?: string;
  department?: string;
}

const TrackingPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user, toast } = useApp();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!requestId) {
      navigate('/dashboard');
      return;
    }

    loadTrackingData();
  }, [requestId, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && trackingData && trackingData.status !== 'completed') {
      interval = setInterval(() => {
        refreshTrackingData();
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, trackingData]);

  const loadTrackingData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock tracking data for demonstration
      const mockData: TrackingData = {
        requestId: requestId!,
        status: 'en_route_delivery',
        currentLocation: {
          lat: -1.3050,
          lng: 36.8500
        },
        estimatedArrival: '2024-01-20T12:15:00Z',
        progress: 65,
        lastUpdated: new Date().toISOString(),
        driver: {
          id: 'driver-001',
          name: 'Peter Kiprotich',
          phone: '+254-755-123-456',
          rating: 4.8,
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
        },
        pickup: {
          address: 'Westlands Square, Nairobi',
          lat: -1.2921,
          lng: 36.8219,
          contactName: 'John Kamau',
          contactPhone: '+254-733-456-789'
        },
        dropoff: {
          address: 'Industrial Area, Nairobi',
          lat: -1.3197,
          lng: 36.9275,
          contactName: 'Mary Achieng',
          contactPhone: '+254-744-567-890'
        },
        cargo: {
          type: 'Electronics',
          weight: 800,
          description: 'Computer equipment and office supplies'
        },
        scheduledTime: '2024-01-20T09:00:00Z',
        price: 28500,
        projectCode: 'PROJ-2024-001',
        department: 'Operations'
      };

      setTrackingData(mockData);
    } catch (error) {
      toast.showError('Loading Failed', 'Failed to load tracking data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTrackingData = async () => {
    if (!trackingData) return;
    
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update progress and location slightly for demo
      const updatedData = {
        ...trackingData,
        progress: Math.min(trackingData.progress + Math.random() * 5, 100),
        currentLocation: {
          lat: trackingData.currentLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: trackingData.currentLocation.lng + (Math.random() - 0.5) * 0.001
        },
        lastUpdated: new Date().toISOString()
      };

      setTrackingData(updatedData);
    } catch (error) {
      // Silently handle refresh errors
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_route_pickup': return 'En route to pickup';
      case 'at_pickup': return 'At pickup location';
      case 'en_route_delivery': return 'En route to delivery';
      case 'at_delivery': return 'At delivery location';
      case 'completed': return 'Delivery completed';
      default: return 'Unknown status';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'en_route_delivery': return 'bg-accent-peach-100 text-accent-peach-700';
      case 'at_pickup': return 'bg-warning-100 text-warning-700';
      case 'en_route_pickup': return 'bg-secondary-100 text-secondary-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-16 w-16 text-accent-peach-400 mx-auto mb-4 animate-pulse" />
          <p className="text-secondary-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-800 mb-2">Tracking Data Not Found</h2>
          <p className="text-secondary-600 mb-6">Unable to load tracking information for this request.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const mapMarkers = [
    {
      position: trackingData.pickup,
      title: 'Pickup Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    },
    {
      position: trackingData.dropoff,
      title: 'Delivery Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    },
    {
      position: trackingData.currentLocation,
      title: 'Current Vehicle Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-secondary-600 hover:text-accent-peach-400 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-accent-beige-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-primary-800">
                Track Request #{trackingData.requestId}
              </h1>
              {trackingData.projectCode && (
                <p className="text-secondary-600">
                  {trackingData.projectCode} • {trackingData.department}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-success-500 animate-pulse' : 'bg-accent-beige-300'}`}></div>
              <span className="text-sm text-secondary-600">
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                autoRefresh ? 'bg-success-100 text-success-600' : 'bg-accent-beige-200 text-secondary-600'
              }`}
            >
              {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={refreshTrackingData}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-800">Delivery Status</h2>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
              {getStatusLabel(trackingData.status)}
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-peach-600">{trackingData.progress}%</div>
              <div className="text-sm text-secondary-600">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-peach-600">
                {new Date(trackingData.estimatedArrival).toLocaleTimeString()}
              </div>
              <div className="text-sm text-secondary-600">Estimated Arrival</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-peach-600">
                {new Date(trackingData.lastUpdated).toLocaleTimeString()}
              </div>
              <div className="text-sm text-secondary-600">Last Updated</div>
            </div>
          </div>

          <div className="w-full bg-accent-beige-200 rounded-full h-4">
            <div 
              className="bg-accent-peach-600 h-4 rounded-full transition-all duration-300" 
              style={{ width: `${trackingData.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-800">Live Location</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-success-600">Live</span>
                </div>
              </div>
              
              <GoogleMap
                center={trackingData.currentLocation}
                zoom={13}
                markers={mapMarkers}
                className="w-full h-96 rounded-lg"
              />
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-secondary-600">Pickup Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent-peach-500 rounded-full"></div>
                  <span className="text-secondary-600">Current Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                  <span className="text-secondary-600">Delivery Location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Driver Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center">
                  {trackingData.driver.avatar ? (
                    <img src={trackingData.driver.avatar} alt={trackingData.driver.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary-800">{trackingData.driver.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <Star className="h-4 w-4 text-warning-500" />
                    <span>{trackingData.driver.rating.toFixed(1)} rating</span>
                  </div>
                  <p className="text-sm text-secondary-600">{trackingData.driver.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${trackingData.driver.phone}`}
                  className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </a>
                <button className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-success-500" />
                    <span className="font-medium text-secondary-700">Pickup</span>
                  </div>
                  <p className="text-primary-800 ml-6">{trackingData.pickup.address}</p>
                  {trackingData.pickup.contactName && (
                    <p className="text-sm text-secondary-600 ml-6">
                      Contact: {trackingData.pickup.contactName}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-error-500" />
                    <span className="font-medium text-secondary-700">Delivery</span>
                  </div>
                  <p className="text-primary-800 ml-6">{trackingData.dropoff.address}</p>
                  {trackingData.dropoff.contactName && (
                    <p className="text-sm text-secondary-600 ml-6">
                      Contact: {trackingData.dropoff.contactName}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-accent-peach-500" />
                    <span className="font-medium text-secondary-700">Cargo</span>
                  </div>
                  <p className="text-primary-800 ml-6">{trackingData.cargo.type}</p>
                  <p className="text-sm text-secondary-600 ml-6">
                    {trackingData.cargo.weight} kg • {trackingData.cargo.description}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-secondary-500" />
                    <span className="font-medium text-secondary-700">Scheduled</span>
                  </div>
                  <p className="text-primary-800 ml-6">
                    {new Date(trackingData.scheduledTime).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-accent-peach-500" />
                    <span className="font-medium text-secondary-700">Cost</span>
                  </div>
                  <p className="text-primary-800 ml-6 font-semibold">
                    KES {trackingData.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200 p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Route className="h-4 w-4" />
                  <span>View Full Route</span>
                </button>
                <button className="w-full border border-accent-beige-300 text-secondary-700 px-4 py-3 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Request Details</span>
                </button>
                <button className="w-full border border-accent-beige-300 text-secondary-700 px-4 py-3 rounded-lg hover:bg-accent-beige-100 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Share Tracking Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;