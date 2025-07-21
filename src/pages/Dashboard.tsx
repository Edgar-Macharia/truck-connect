import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search,
  FileText,
  Receipt,
  Loader,
  RefreshCw,
  Plus,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, AvailableTruck, BookingRequest, SearchCriteria, Invoice } from '../types';
import GoogleMap from '../components/GoogleMap';
import TruckSearchForm from '../components/TruckSearchForm';
import EnhancedTruckCard from '../components/EnhancedTruckCard';
import EnhancedBookingModal from '../components/EnhancedBookingModal';
import InvoiceViewer from '../components/InvoiceViewer';
import DriverDashboard from '../components/DriverDashboard';
import BusinessDashboard from '../components/BusinessDashboard';

const Dashboard: React.FC = () => {
  const { user, jobs, setJobs, addJob, toast, auth } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'find-trucks' | 'jobs' | 'invoices'>('find-trucks');
  const [selectedTruck, setSelectedTruck] = useState<AvailableTruck | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState<Job | null>(null);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [availableTrucks, setAvailableTrucks] = useState<AvailableTruck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<AvailableTruck[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    pickupLocation: '',
    truckType: 'all',
    bookingType: 'hourly',
    durationHours: 2,
    minCapacity: 0,
    minRating: 0,
    searchRadius: 10
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Critical: Redirect to login if not authenticated and not loading
    if (!auth.loading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    // If still loading auth, don't proceed with data initialization
    if (auth.loading) {
      return;
    }

    // If user is a driver, show driver dashboard
    if (user?.type === 'driver') {
      return;
    }

    // If user is a business, show business dashboard
    if (user?.type === 'business') {
      return;
    }

    // Don't initialize data if we don't have a user yet
    if (!user) {
      return;
    }

    // Only initialize data once when user is available
    if (user && !dataLoaded) {
      initializeDashboardData();
    }
  }, [user, auth.loading, navigate, dataLoaded]);

  const initializeDashboardData = () => {
    setDataLoaded(true);

    // Get user's location (default to Nairobi, Kenya)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Use console.info for permission denied as it's a user action, not an error
          if (error.code === error.PERMISSION_DENIED) {
            // User denied geolocation permission, using default location (Nairobi)
          }
          // Default to Nairobi, Kenya
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
        }
      );
    } else {
      // Default to Nairobi, Kenya
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
    }

    // Mock available trucks data with Kenyan locations and KES pricing
    const mockTrucks: AvailableTruck[] = [
      {
        id: '1',
        driverId: 'driver1',
        driver: {
          name: 'John Mwangi',
          rating: 4.8,
          totalJobs: 156,
          phone: '+254-712-345-678',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
        },
        truck: {
          type: 'pickup',
          make: 'Toyota',
          model: 'Hilux',
          year: 2022,
          licensePlate: 'KCA 123A',
          capacity: 1500,
          dimensions: { length: 8, width: 5, height: 6 }
        },
        location: {
          lat: -1.2921,
          lng: 36.8219,
          address: 'Westlands, Nairobi'
        },
        estimatedArrival: 12,
        hourlyRate: 2500, // KES
        dailyRate: 18000, // KES
        perMileRate: 150, // KES per km
        availability: 'available'
      },
      {
        id: '2',
        driverId: 'driver2',
        driver: {
          name: 'Grace Wanjiku',
          rating: 4.9,
          totalJobs: 203,
          phone: '+254-722-456-789'
        },
        truck: {
          type: 'double_cab',
          make: 'Isuzu',
          model: 'D-Max',
          year: 2023,
          licensePlate: 'KBZ 456B',
          capacity: 1200,
          dimensions: { length: 7, width: 5, height: 6 }
        },
        location: {
          lat: -1.3032,
          lng: 36.7073,
          address: 'Karen, Nairobi'
        },
        estimatedArrival: 8,
        hourlyRate: 2800, // KES
        dailyRate: 20000, // KES
        perMileRate: 170, // KES per km
        availability: 'available'
      },
      {
        id: '3',
        driverId: 'driver3',
        driver: {
          name: 'Peter Kiprotich',
          rating: 4.7,
          totalJobs: 89,
          phone: '+254-733-567-890'
        },
        truck: {
          type: 'flatbed',
          make: 'Mitsubishi',
          model: 'Canter',
          year: 2020,
          licensePlate: 'KAY 789C',
          capacity: 8000,
          dimensions: { length: 20, width: 8, height: 4 }
        },
        location: {
          lat: -1.3197,
          lng: 36.9275,
          address: 'Industrial Area, Nairobi'
        },
        estimatedArrival: 15,
        hourlyRate: 4500, // KES
        dailyRate: 32000, // KES
        perMileRate: 250, // KES per km
        availability: 'available'
      },
      {
        id: '4',
        driverId: 'driver4',
        driver: {
          name: 'Mary Achieng',
          rating: 4.6,
          totalJobs: 134,
          phone: '+254-744-678-901'
        },
        truck: {
          type: 'box',
          make: 'Isuzu',
          model: 'NPR',
          year: 2021,
          licensePlate: 'KBX 012D',
          capacity: 5000,
          dimensions: { length: 16, width: 7, height: 8 }
        },
        location: {
          lat: -1.2634,
          lng: 36.8155,
          address: 'Kileleshwa, Nairobi'
        },
        estimatedArrival: 20,
        hourlyRate: 3800, // KES
        dailyRate: 26000, // KES
        perMileRate: 200, // KES per km
        availability: 'available'
      },
      {
        id: '5',
        driverId: 'driver5',
        driver: {
          name: 'Samuel Mutua',
          rating: 4.8,
          totalJobs: 178,
          phone: '+254-755-789-012'
        },
        truck: {
          type: 'refrigerated',
          make: 'Hino',
          model: '300 Series',
          year: 2022,
          licensePlate: 'KCB 345E',
          capacity: 6000,
          dimensions: { length: 18, width: 7, height: 8 }
        },
        location: {
          lat: -4.0435,
          lng: 39.6682,
          address: 'Mombasa'
        },
        estimatedArrival: 45,
        hourlyRate: 5200, // KES
        dailyRate: 38000, // KES
        perMileRate: 300, // KES per km
        availability: 'available'
      }
    ];

    setAvailableTrucks(mockTrucks);
    setFilteredTrucks(mockTrucks);

    // Mock jobs data initialization with Kenyan locations
    const mockJobs: Job[] = [
      {
        id: '1',
        userId: user!.id,
        status: 'in-progress',
        pickup: {
          address: 'Westlands, Nairobi',
          lat: -1.2921,
          lng: 36.8219
        },
        dropoff: {
          address: 'Mombasa Road, Nairobi',
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
      },
      {
        id: '2',
        userId: user!.id,
        status: 'completed',
        pickup: {
          address: 'CBD, Nairobi',
          lat: -1.2864,
          lng: 36.8172
        },
        dropoff: {
          address: 'Thika Road, Nairobi',
          lat: -1.2297,
          lng: 36.8890
        },
        cargo: {
          type: 'Furniture',
          weight: 1200,
          description: 'Office furniture delivery'
        },
        scheduledTime: '2024-01-18T09:00:00Z',
        estimatedDuration: 240,
        price: 25600, // KES
        bookingType: 'daily',
        durationHours: 1,
        createdAt: '2024-01-18T08:00:00Z',
        completedAt: '2024-01-18T13:00:00Z'
      }
    ];

    if (jobs.length === 0) {
      setJobs(mockJobs);
    }

    // Mock invoices data with KES pricing
    const mockInvoices: Invoice[] = [
      {
        id: 'inv-001',
        jobId: '2',
        userId: user!.id,
        amount: 25600, // KES
        pdfUrl: '/invoices/inv-001.pdf',
        status: 'paid',
        breakdown: {
          baseRate: 18000, // KES
          distanceFee: 4000, // KES
          platformFee: 2200, // KES
          taxes: 1400, // KES (VAT)
          total: 25600 // KES
        },
        createdAt: '2024-01-18T13:00:00Z'
      },
      {
        id: 'inv-002',
        jobId: '1',
        userId: user!.id,
        amount: 18500, // KES
        pdfUrl: '/invoices/inv-002.pdf',
        status: 'pending',
        breakdown: {
          baseRate: 14000, // KES
          distanceFee: 2500, // KES
          platformFee: 1650, // KES
          taxes: 350, // KES (VAT)
          total: 18500 // KES
        },
        createdAt: '2024-01-20T14:00:00Z'
      }
    ];

    setInvoices(mockInvoices);
  };

  // If user is a driver, show driver dashboard
  if (user?.type === 'driver') {
    return <DriverDashboard />;
  }

  // If user is a business, show business dashboard
  if (user?.type === 'business') {
    return <BusinessDashboard />;
  }

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-accent-peach-400 mx-auto mb-4" />
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user and not loading, this will be handled by the useEffect redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-accent-peach-400 mx-auto mb-4" />
          <p className="text-secondary-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    // In a real app, this would make an API call to search for trucks
  };

  const handleFilterChange = (trucks: AvailableTruck[]) => {
    setFilteredTrucks(trucks);
  };

  const handleRequestService = (truck: AvailableTruck) => {
    setSelectedTruck(truck);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (booking: BookingRequest) => {
    if (!selectedTruck) return;

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      driverId: selectedTruck.driverId,
      status: 'posted',
      pickup: booking.pickupLocation,
      dropoff: booking.dropoffLocation,
      cargo: booking.cargo,
      scheduledTime: booking.scheduledTime,
      estimatedDuration: booking.durationHours * 60,
      price: 18500, // KES - Calculate based on booking details
      bookingType: booking.bookingType,
      durationHours: booking.durationHours,
      createdAt: new Date().toISOString()
    };

    addJob(newJob);
    setIsBookingModalOpen(false);
    setSelectedTruck(null);
    
    // Generate invoice with KES pricing
    const newInvoice: Invoice = {
      id: `inv-${Math.random().toString(36).substr(2, 6)}`,
      jobId: newJob.id,
      userId: user.id,
      amount: newJob.price,
      pdfUrl: `/invoices/${newJob.id}.pdf`,
      status: 'pending',
      breakdown: {
        baseRate: 14000, // KES
        distanceFee: 2500, // KES
        platformFee: 1650, // KES
        taxes: 350, // KES (VAT)
        total: newJob.price
      },
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Show success toast and navigate to invoice
    toast.showSuccess('Booking Confirmed!', 'Your truck has been booked successfully. Redirecting to invoice...');
    
    // Navigate to invoice after a short delay
    setTimeout(() => {
      setSelectedInvoice(newInvoice);
      setSelectedJobForInvoice(newJob); // Set the job for the invoice
      setIsInvoiceViewerOpen(true);
    }, 2000);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Find the corresponding job for this invoice
    const relatedJob = jobs.find(job => job.id === invoice.jobId);
    
    // Only open the invoice viewer if we have both the invoice and the job
    if (relatedJob) {
      setSelectedInvoice(invoice);
      setSelectedJobForInvoice(relatedJob);
      setIsInvoiceViewerOpen(true);
    } else {
      // Show error if job is not found
      toast.showError('Error', 'Unable to find job details for this invoice.');
    }
  };

  const mapMarkers = filteredTrucks.map(truck => ({
    position: truck.location,
    title: `${truck.driver.name} - ${truck.truck.make} ${truck.truck.model}`,
    icon: truck.availability === 'available' ? 
      'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 
      'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    onClick: () => handleRequestService(truck)
  }));

  // Add user location marker if available
  if (userLocation) {
    mapMarkers.push({
      position: userLocation,
      title: 'Your Location',
      icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in-progress': return 'bg-accent-peach-100 text-accent-peach-700';
      case 'posted': return 'bg-warning-100 text-warning-700';
      case 'cancelled': return 'bg-error-100 text-error-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  const stats = [
    {
      title: 'Available Trucks',
      value: filteredTrucks.filter(t => t.availability === 'available').length,
      icon: Truck,
      color: 'bg-accent-sage-500',
      change: `Within ${searchCriteria.searchRadius} km`
    },
    {
      title: 'Active Jobs',
      value: jobs.filter(j => j.status === 'in-progress').length,
      icon: Package,
      color: 'bg-accent-peach-500',
      change: 'In progress'
    },
    {
      title: 'Total Spent',
      value: `KES ${jobs.reduce((sum, job) => sum + job.price, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-secondary-500',
      change: 'This month'
    },
    {
      title: 'Invoices',
      value: invoices.length,
      icon: FileText,
      color: 'bg-primary-600',
      change: 'Generated'
    }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Welcome back, {user.name}!
              {auth.profileLoading && (
                <RefreshCw className="inline h-5 w-5 ml-2 animate-spin text-accent-peach-400" />
              )}
            </h1>
            <p className="text-secondary-600">
              Find and book trucks across Kenya with advanced search, flexible booking options, and automated invoicing.
              {auth.profileLoading && (
                <span className="text-accent-peach-500 ml-2 text-sm">
                  (Loading profile details...)
                </span>
              )}
            </p>
          </div>
          {user.type !== 'driver' && (
            <button
              onClick={() => setActiveTab('find-trucks')}
              className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Find Trucks</span>
            </button>
          )}
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
                { id: 'find-trucks', label: 'Find Trucks', icon: Search },
                { id: 'jobs', label: 'My Jobs', icon: Package },
                { id: 'invoices', label: 'Invoices', icon: Receipt },
                { id: 'overview', label: 'Overview', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-accent-peach-400 text-accent-peach-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-accent-beige-300'
                  } transition-colors duration-200`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'find-trucks' && (
              <div className="space-y-6">
                {/* Search Form */}
                <TruckSearchForm
                  onSearch={handleSearch}
                  onFilterChange={handleFilterChange}
                  availableTrucks={availableTrucks}
                />

                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary-800">
                    Available Trucks in Kenya ({filteredTrucks.length})
                  </h3>
                </div>

                {/* Map View */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-primary-800 mb-4">Truck Locations</h4>
                    <GoogleMap
                      center={userLocation || { lat: -1.2921, lng: 36.8219 }}
                      zoom={12}
                      markers={mapMarkers}
                      className="w-full h-96 rounded-lg"
                    />
                  </div>

                  {/* Truck Cards */}
                  <div>
                    <h4 className="text-md font-medium text-primary-800 mb-4">Available Trucks</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTrucks.map((truck) => (
                        <EnhancedTruckCard
                          key={truck.id}
                          truck={truck}
                          searchCriteria={searchCriteria}
                          onRequestService={handleRequestService}
                          userLocation={userLocation || undefined}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-800">My Jobs</h3>
                  <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {jobs.map((job) => (
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
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
                            <span>KES {job.price.toLocaleString()}</span>
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

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary-800">Invoices</h3>
                  <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                    Download All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {invoices.map((invoice) => {
                    const relatedJob = jobs.find(job => job.id === invoice.jobId);
                    return (
                      <div key={invoice.id} className="border border-accent-beige-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-primary-800">Invoice #{invoice.id.slice(-6)}</h4>
                              <p className="text-sm text-secondary-600">
                                Job #{invoice.jobId} • {new Date(invoice.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              invoice.status === 'paid' ? 'bg-success-100 text-success-700' :
                              invoice.status === 'disputed' ? 'bg-error-100 text-error-700' :
                              'bg-warning-100 text-warning-700'
                            }`}>
                              {invoice.status.toUpperCase()}
                            </span>
                            <p className="text-lg font-bold text-primary-800 mt-1">KES {invoice.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {relatedJob && (
                          <div className="grid md:grid-cols-2 gap-4 mb-3 text-sm text-secondary-600">
                            <div>From: {relatedJob.pickup.address}</div>
                            <div>To: {relatedJob.dropoff.address}</div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-secondary-600">
                            <span>Base: KES {invoice.breakdown.baseRate.toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>Distance: KES {invoice.breakdown.distanceFee.toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>Fees: KES {(invoice.breakdown.platformFee + invoice.breakdown.taxes).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-accent-peach-400 hover:text-accent-peach-500 font-medium text-sm"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-accent-peach-400 to-accent-peach-500 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('find-trucks')}
                        className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left"
                      >
                        🚚 Find Available Trucks in Kenya
                      </button>
                      <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left">
                        📍 Track Active Shipments
                      </button>
                      <button
                        onClick={() => setActiveTab('invoices')}
                        className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left"
                      >
                        📄 View Invoices
                      </button>
                    </div>
                  </div>

                  <div className="bg-accent-beige-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Invoice generated for Job #2</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent-peach-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Job #1 is in progress</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Payment processed for Job #2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Booking Modal */}
      {selectedTruck && (
        <EnhancedBookingModal
          truck={selectedTruck}
          searchCriteria={searchCriteria}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedTruck(null);
          }}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Invoice Viewer - Only render if both selectedInvoice and selectedJobForInvoice are present */}
      {selectedInvoice && selectedJobForInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice}
          job={selectedJobForInvoice}
          isOpen={isInvoiceViewerOpen}
          onClose={() => {
            setIsInvoiceViewerOpen(false);
            setSelectedInvoice(null);
            setSelectedJobForInvoice(null); // Reset the job for invoice
            // Navigate back to dashboard after closing invoice
            setActiveTab('overview');
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;