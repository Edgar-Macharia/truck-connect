import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Truck, 
  MapPin, 
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
  Building,
  Eye,
  Navigation,
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Phone,
  Mail,
  User,
  Edit,
  Save,
  Filter,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, Invoice } from '../types';
import InvoiceViewer from './InvoiceViewer';

interface FleetRequest {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  rentalType: 'hourly' | 'daily';
  rentalDuration: number;
  numberOfVehicles: number;
  truckType: string;
  truckModel: string;
  cargoType: string;
  cargoWeight: number;
  cargoDescription: string;
  specialRequirements: string[];
  notes: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimatedCost: number;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

const BusinessDashboard: React.FC = () => {
  const { user, jobs, toast, auth } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'request-fleet' | 'active-requests' | 'invoices'>('request-fleet');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState<Job | null>(null);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);
  const [fleetRequests, setFleetRequests] = useState<FleetRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fleet request form state
  const [requestForm, setRequestForm] = useState({
    companyName: user?.name || '',
    contactPerson: '',
    email: user?.email || '',
    phone: user?.phone || '',
    pickupLocation: '',
    dropoffLocation: '',
    scheduledDate: '',
    scheduledTime: '',
    rentalType: 'hourly' as 'hourly' | 'daily',
    rentalDuration: 4,
    numberOfVehicles: 1,
    truckType: 'pickup',
    truckModel: '',
    cargoType: 'general',
    cargoWeight: 0,
    cargoDescription: '',
    specialRequirements: [] as string[],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available truck types and models
  const truckTypes = [
    { 
      value: 'pickup', 
      label: 'Pickup Truck',
      models: ['Toyota Hilux', 'Isuzu D-Max', 'Ford Ranger', 'Mitsubishi L200'],
      capacity: '1,500 kg',
      hourlyRate: 2500,
      dailyRate: 18000
    },
    { 
      value: 'double_cab', 
      label: 'Double Cab',
      models: ['Toyota Hilux Double Cab', 'Isuzu D-Max Double Cab', 'Ford Ranger Double Cab'],
      capacity: '1,200 kg',
      hourlyRate: 2800,
      dailyRate: 20000
    },
    { 
      value: 'box', 
      label: 'Box Truck',
      models: ['Isuzu NPR', 'Mitsubishi Canter', 'Hino 300 Series'],
      capacity: '5,000 kg',
      hourlyRate: 3800,
      dailyRate: 26000
    },
    { 
      value: 'flatbed', 
      label: 'Flatbed Truck',
      models: ['Mitsubishi Canter Flatbed', 'Isuzu NPR Flatbed', 'Hino 300 Flatbed'],
      capacity: '8,000 kg',
      hourlyRate: 4500,
      dailyRate: 32000
    },
    { 
      value: 'dry_van', 
      label: 'Dry Van',
      models: ['Isuzu FRR', 'Mitsubishi Fighter', 'Hino 500 Series'],
      capacity: '12,000 kg',
      hourlyRate: 4000,
      dailyRate: 28000
    },
    { 
      value: 'refrigerated', 
      label: 'Refrigerated Truck',
      models: ['Hino 300 Reefer', 'Isuzu NPR Reefer', 'Mitsubishi Canter Reefer'],
      capacity: '6,000 kg',
      hourlyRate: 5200,
      dailyRate: 38000
    },
    { 
      value: 'semi', 
      label: 'Semi-Trailer',
      models: ['Scania R-Series', 'Volvo FH', 'Mercedes Actros', 'MAN TGX'],
      capacity: '30,000 kg',
      hourlyRate: 8000,
      dailyRate: 60000
    }
  ];

  const cargoTypes = [
    { value: 'general', label: 'General Cargo' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'construction', label: 'Construction Materials' },
    { value: 'perishable', label: 'Perishable Goods' },
    { value: 'hazardous', label: 'Hazardous Materials' },
    { value: 'machinery', label: 'Machinery & Equipment' },
    { value: 'documents', label: 'Documents & Files' }
  ];

  const specialRequirementOptions = [
    'Loading assistance required',
    'Fragile items handling',
    'Time-sensitive delivery',
    'Special handling required',
    'Multiple stops',
    'Heavy lifting equipment needed',
    'Temperature controlled',
    'Secure transport required',
    'Weekend delivery',
    'After hours pickup'
  ];

  // Kenyan locations
  const kenyanLocations = [
    'Nairobi CBD',
    'Westlands, Nairobi',
    'Karen, Nairobi',
    'Kileleshwa, Nairobi',
    'Industrial Area, Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Machakos',
    'Nyeri',
    'Meru',
    'Kitale',
    'Malindi'
  ];

  useEffect(() => {
    if (!auth.loading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user && user.type !== 'business') {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (user && !dataLoaded) {
      initializeDashboardData();
    }
  }, [user, auth.loading, navigate, dataLoaded]);

  const initializeDashboardData = () => {
    setDataLoaded(true);

    // Mock fleet requests data
    const mockRequests: FleetRequest[] = [
      {
        id: 'req-001',
        companyName: user!.name,
        contactPerson: 'John Kamau',
        email: user!.email,
        phone: '+254-733-456-789',
        pickupLocation: 'Westlands, Nairobi',
        dropoffLocation: 'Industrial Area, Nairobi',
        scheduledDate: '2024-01-22',
        scheduledTime: '09:00',
        rentalType: 'daily',
        rentalDuration: 2,
        numberOfVehicles: 3,
        truckType: 'box',
        truckModel: 'Isuzu NPR',
        cargoType: 'electronics',
        cargoWeight: 2500,
        cargoDescription: 'Office equipment and computers',
        specialRequirements: ['Loading assistance required', 'Fragile items handling'],
        notes: 'Please handle with care - expensive equipment',
        status: 'in_progress',
        estimatedCost: 156000, // 3 vehicles × 2 days × 26000 per day
        createdAt: '2024-01-20T08:00:00Z',
        confirmedAt: '2024-01-20T09:30:00Z'
      },
      {
        id: 'req-002',
        companyName: user!.name,
        contactPerson: 'Mary Achieng',
        email: user!.email,
        phone: '+254-744-567-890',
        pickupLocation: 'Mombasa',
        dropoffLocation: 'Nairobi CBD',
        scheduledDate: '2024-01-25',
        scheduledTime: '06:00',
        rentalType: 'hourly',
        rentalDuration: 8,
        numberOfVehicles: 1,
        truckType: 'refrigerated',
        truckModel: 'Hino 300 Reefer',
        cargoType: 'perishable',
        cargoWeight: 4000,
        cargoDescription: 'Fresh produce for retail distribution',
        specialRequirements: ['Temperature controlled', 'Time-sensitive delivery'],
        notes: 'Maintain temperature at 2-4°C throughout transport',
        status: 'confirmed',
        estimatedCost: 41600, // 1 vehicle × 8 hours × 5200 per hour
        createdAt: '2024-01-19T14:00:00Z',
        confirmedAt: '2024-01-19T15:45:00Z'
      },
      {
        id: 'req-003',
        companyName: user!.name,
        contactPerson: 'Peter Kiprotich',
        email: user!.email,
        phone: '+254-755-678-901',
        pickupLocation: 'Nakuru',
        dropoffLocation: 'Eldoret',
        scheduledDate: '2024-01-18',
        scheduledTime: '10:00',
        rentalType: 'daily',
        rentalDuration: 1,
        numberOfVehicles: 2,
        truckType: 'flatbed',
        truckModel: 'Mitsubishi Canter Flatbed',
        cargoType: 'construction',
        cargoWeight: 12000,
        cargoDescription: 'Construction materials and steel beams',
        specialRequirements: ['Heavy lifting equipment needed', 'Secure transport required'],
        notes: 'Materials for construction site - ensure proper securing',
        status: 'completed',
        estimatedCost: 64000, // 2 vehicles × 1 day × 32000 per day
        createdAt: '2024-01-17T11:00:00Z',
        confirmedAt: '2024-01-17T12:30:00Z',
        completedAt: '2024-01-18T16:00:00Z'
      }
    ];

    setFleetRequests(mockRequests);

    // Mock invoices data
    const mockInvoices: Invoice[] = [
      {
        id: 'inv-bus-001',
        jobId: 'req-003',
        userId: user!.id,
        amount: 64000,
        pdfUrl: '/invoices/inv-bus-001.pdf',
        status: 'paid',
        breakdown: {
          baseRate: 64000,
          distanceFee: 0,
          platformFee: 6400,
          taxes: 11264,
          total: 81664
        },
        createdAt: '2024-01-18T16:00:00Z'
      },
      {
        id: 'inv-bus-002',
        jobId: 'req-001',
        userId: user!.id,
        amount: 156000,
        pdfUrl: '/invoices/inv-bus-002.pdf',
        status: 'pending',
        breakdown: {
          baseRate: 156000,
          distanceFee: 0,
          platformFee: 15600,
          taxes: 27456,
          total: 199056
        },
        createdAt: '2024-01-20T09:30:00Z'
      }
    ];

    setInvoices(mockInvoices);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSpecialRequirementChange = (requirement: string) => {
    setRequestForm(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const calculateEstimatedCost = () => {
    const selectedTruckType = truckTypes.find(t => t.value === requestForm.truckType);
    if (!selectedTruckType) return 0;

    const baseRate = requestForm.rentalType === 'hourly' 
      ? selectedTruckType.hourlyRate 
      : selectedTruckType.dailyRate;
    
    const baseCost = baseRate * requestForm.rentalDuration * requestForm.numberOfVehicles;
    const platformFee = baseCost * 0.1;
    const vat = (baseCost + platformFee) * 0.16;
    
    return baseCost + platformFee + vat;
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!requestForm.pickupLocation || !requestForm.dropoffLocation || !requestForm.scheduledDate) {
      toast.showError('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (requestForm.numberOfVehicles < 1 || requestForm.numberOfVehicles > 10) {
      toast.showError('Validation Error', 'Number of vehicles must be between 1 and 10.');
      return;
    }

    if (requestForm.rentalDuration < 1) {
      toast.showError('Validation Error', 'Rental duration must be at least 1.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newRequest: FleetRequest = {
        id: `req-${Date.now()}`,
        ...requestForm,
        status: 'pending',
        estimatedCost: calculateEstimatedCost(),
        createdAt: new Date().toISOString()
      };

      setFleetRequests(prev => [newRequest, ...prev]);

      // Generate invoice
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        jobId: newRequest.id,
        userId: user!.id,
        amount: newRequest.estimatedCost,
        pdfUrl: `/invoices/${newRequest.id}.pdf`,
        status: 'pending',
        breakdown: {
          baseRate: newRequest.estimatedCost * 0.8,
          distanceFee: 0,
          platformFee: newRequest.estimatedCost * 0.1,
          taxes: newRequest.estimatedCost * 0.16,
          total: newRequest.estimatedCost
        },
        createdAt: new Date().toISOString()
      };

      setInvoices(prev => [newInvoice, ...prev]);

      toast.showSuccess('Request Submitted!', 'Your fleet request has been submitted successfully. You will receive confirmation shortly.');
      
      // Reset form
      setRequestForm({
        companyName: user?.name || '',
        contactPerson: '',
        email: user?.email || '',
        phone: user?.phone || '',
        pickupLocation: '',
        dropoffLocation: '',
        scheduledDate: '',
        scheduledTime: '',
        rentalType: 'hourly',
        rentalDuration: 4,
        numberOfVehicles: 1,
        truckType: 'pickup',
        truckModel: '',
        cargoType: 'general',
        cargoWeight: 0,
        cargoDescription: '',
        specialRequirements: [],
        notes: ''
      });

      // Show invoice after a delay
      setTimeout(() => {
        setSelectedInvoice(newInvoice);
        setSelectedJobForInvoice({
          id: newRequest.id,
          userId: user!.id,
          status: 'posted',
          pickup: { address: newRequest.pickupLocation, lat: -1.2921, lng: 36.8219 },
          dropoff: { address: newRequest.dropoffLocation, lat: -1.3197, lng: 36.9275 },
          cargo: { 
            type: newRequest.cargoType, 
            weight: newRequest.cargoWeight, 
            description: newRequest.cargoDescription 
          },
          scheduledTime: `${newRequest.scheduledDate}T${newRequest.scheduledTime}:00Z`,
          estimatedDuration: newRequest.rentalDuration * (newRequest.rentalType === 'hourly' ? 60 : 1440),
          price: newRequest.estimatedCost,
          bookingType: newRequest.rentalType,
          durationHours: newRequest.rentalDuration,
          createdAt: newRequest.createdAt
        });
        setIsInvoiceViewerOpen(true);
      }, 1000);

    } catch (error) {
      toast.showError('Submission Failed', 'Failed to submit fleet request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    const relatedRequest = fleetRequests.find(req => req.id === invoice.jobId);
    
    if (relatedRequest) {
      setSelectedInvoice(invoice);
      setSelectedJobForInvoice({
        id: relatedRequest.id,
        userId: user!.id,
        status: 'posted',
        pickup: { address: relatedRequest.pickupLocation, lat: -1.2921, lng: 36.8219 },
        dropoff: { address: relatedRequest.dropoffLocation, lat: -1.3197, lng: 36.9275 },
        cargo: { 
          type: relatedRequest.cargoType, 
          weight: relatedRequest.cargoWeight, 
          description: relatedRequest.cargoDescription 
        },
        scheduledTime: `${relatedRequest.scheduledDate}T${relatedRequest.scheduledTime}:00Z`,
        estimatedDuration: relatedRequest.rentalDuration * (relatedRequest.rentalType === 'hourly' ? 60 : 1440),
        price: relatedRequest.estimatedCost,
        bookingType: relatedRequest.rentalType,
        durationHours: relatedRequest.rentalDuration,
        createdAt: relatedRequest.createdAt
      });
      setIsInvoiceViewerOpen(true);
    } else {
      toast.showError('Error', 'Unable to find request details for this invoice.');
    }
  };

  const handleTrackRequest = (requestId: string) => {
    navigate(`/track/${requestId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in_progress': return 'bg-accent-peach-100 text-accent-peach-700';
      case 'confirmed': return 'bg-secondary-100 text-secondary-700';
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'cancelled': return 'bg-error-100 text-error-700';
      default: return 'bg-accent-beige-200 text-secondary-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-accent-peach-400 mx-auto mb-4" />
          <p className="text-secondary-600">Loading business dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.type !== 'business') {
    return (
      <div className="min-h-screen bg-accent-beige-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary-800 mb-2">Business Account Required</h2>
          <p className="text-secondary-600 mb-6">This dashboard is only available for business accounts.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Active Requests',
      value: fleetRequests.filter(r => ['pending', 'confirmed', 'in_progress'].includes(r.status)).length,
      icon: Truck,
      color: 'bg-accent-peach-500',
      change: 'Currently active'
    },
    {
      title: 'Total Vehicles Requested',
      value: fleetRequests.reduce((sum, req) => sum + req.numberOfVehicles, 0),
      icon: Package,
      color: 'bg-secondary-500',
      change: 'All time'
    },
    {
      title: 'Total Spent',
      value: `KES ${fleetRequests.filter(r => r.status === 'completed').reduce((sum, req) => sum + req.estimatedCost, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-success-500',
      change: 'Completed requests'
    },
    {
      title: 'Pending Invoices',
      value: invoices.filter(inv => inv.status === 'pending').length,
      icon: FileText,
      color: 'bg-warning-500',
      change: 'Awaiting payment'
    }
  ];

  const selectedTruckType = truckTypes.find(t => t.value === requestForm.truckType);
  const estimatedCost = calculateEstimatedCost();

  return (
    <div className="min-h-screen bg-accent-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Business Dashboard
              {auth.profileLoading && (
                <RefreshCw className="inline h-5 w-5 ml-2 animate-spin text-accent-peach-400" />
              )}
            </h1>
            <p className="text-secondary-600">
              Manage your fleet requests, track deliveries, and handle invoicing for {user.name}.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('request-fleet')}
            className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Request Fleet</span>
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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-accent-beige-200">
          <div className="border-b border-accent-beige-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'request-fleet', label: 'Request Fleet', icon: Plus },
                { id: 'active-requests', label: 'Active Requests', icon: Truck },
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
            {/* Request Fleet Tab */}
            {activeTab === 'request-fleet' && (
              <div>
                <h2 className="text-2xl font-bold text-primary-800 mb-6">Request Fleet Service</h2>
                
                <form onSubmit={handleSubmitRequest} className="space-y-8">
                  {/* Company Information */}
                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Company Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={requestForm.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Contact Person *
                        </label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={requestForm.contactPerson}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={requestForm.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={requestForm.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Schedule */}
                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Location & Schedule</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Pickup Location *
                        </label>
                        <input
                          type="text"
                          name="pickupLocation"
                          value={requestForm.pickupLocation}
                          onChange={handleInputChange}
                          required
                          list="pickup-locations"
                          placeholder="Enter pickup location in Kenya"
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                        <datalist id="pickup-locations">
                          {kenyanLocations.map((location, index) => (
                            <option key={index} value={location} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Dropoff Location *
                        </label>
                        <input
                          type="text"
                          name="dropoffLocation"
                          value={requestForm.dropoffLocation}
                          onChange={handleInputChange}
                          required
                          list="dropoff-locations"
                          placeholder="Enter dropoff location in Kenya"
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                        <datalist id="dropoff-locations">
                          {kenyanLocations.map((location, index) => (
                            <option key={index} value={location} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Scheduled Date *
                        </label>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={requestForm.scheduledDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Scheduled Time *
                        </label>
                        <input
                          type="time"
                          name="scheduledTime"
                          value={requestForm.scheduledTime}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fleet Requirements */}
                  <div className="bg-accent-peach-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Fleet Requirements</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Rental Type *
                        </label>
                        <select
                          name="rentalType"
                          value={requestForm.rentalType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        >
                          <option value="hourly">Hourly Rental</option>
                          <option value="daily">Daily Rental</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Duration ({requestForm.rentalType === 'hourly' ? 'Hours' : 'Days'}) *
                        </label>
                        <input
                          type="number"
                          name="rentalDuration"
                          value={requestForm.rentalDuration}
                          onChange={handleInputChange}
                          required
                          min="1"
                          max={requestForm.rentalType === 'hourly' ? 24 : 30}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Number of Vehicles *
                        </label>
                        <input
                          type="number"
                          name="numberOfVehicles"
                          value={requestForm.numberOfVehicles}
                          onChange={handleInputChange}
                          required
                          min="1"
                          max="10"
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Truck Type *
                        </label>
                        <select
                          name="truckType"
                          value={requestForm.truckType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        >
                          {truckTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Truck Model Selection */}
                    {selectedTruckType && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Preferred Truck Model
                        </label>
                        <select
                          name="truckModel"
                          value={requestForm.truckModel}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        >
                          <option value="">Any Model</option>
                          {selectedTruckType.models.map(model => (
                            <option key={model} value={model}>
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Fleet Summary */}
                    {selectedTruckType && (
                      <div className="mt-6 bg-white rounded-lg p-4 border border-accent-peach-200">
                        <h4 className="font-medium text-primary-800 mb-3">Fleet Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-secondary-600">Vehicle Type:</span>
                            <span className="font-medium ml-2">{selectedTruckType.label}</span>
                          </div>
                          <div>
                            <span className="text-secondary-600">Capacity per Vehicle:</span>
                            <span className="font-medium ml-2">{selectedTruckType.capacity}</span>
                          </div>
                          <div>
                            <span className="text-secondary-600">Total Vehicles:</span>
                            <span className="font-medium ml-2">{requestForm.numberOfVehicles}</span>
                          </div>
                          <div>
                            <span className="text-secondary-600">Total Capacity:</span>
                            <span className="font-medium ml-2">
                              {(parseInt(selectedTruckType.capacity.replace(/[^\d]/g, '')) * requestForm.numberOfVehicles).toLocaleString()} kg
                            </span>
                          </div>
                          <div>
                            <span className="text-secondary-600">Rate per Vehicle:</span>
                            <span className="font-medium ml-2">
                              KES {(requestForm.rentalType === 'hourly' ? selectedTruckType.hourlyRate : selectedTruckType.dailyRate).toLocaleString()}/{requestForm.rentalType === 'hourly' ? 'hour' : 'day'}
                            </span>
                          </div>
                          <div>
                            <span className="text-secondary-600">Estimated Total:</span>
                            <span className="font-bold ml-2 text-accent-peach-600">
                              KES {estimatedCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cargo Details */}
                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Cargo Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Cargo Type *
                        </label>
                        <select
                          name="cargoType"
                          value={requestForm.cargoType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        >
                          {cargoTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Total Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="cargoWeight"
                          value={requestForm.cargoWeight}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Cargo Description
                        </label>
                        <textarea
                          name="cargoDescription"
                          value={requestForm.cargoDescription}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Describe the cargo to be transported..."
                          className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Special Requirements</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {specialRequirementOptions.map(requirement => (
                        <label key={requirement} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={requestForm.specialRequirements.includes(requirement)}
                            onChange={() => handleSpecialRequirementChange(requirement)}
                            className="h-4 w-4 text-accent-peach-400 focus:ring-accent-peach-400 border-accent-beige-300 rounded"
                          />
                          <span className="ml-2 text-sm text-secondary-700">{requirement}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-accent-beige-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-4">Additional Notes</h3>
                    <textarea
                      name="notes"
                      value={requestForm.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Any additional instructions, special requirements, or notes for the fleet service..."
                      className="w-full px-4 py-3 rounded-lg border border-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setRequestForm({
                          companyName: user?.name || '',
                          contactPerson: '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          pickupLocation: '',
                          dropoffLocation: '',
                          scheduledDate: '',
                          scheduledTime: '',
                          rentalType: 'hourly',
                          rentalDuration: 4,
                          numberOfVehicles: 1,
                          truckType: 'pickup',
                          truckModel: '',
                          cargoType: 'general',
                          cargoWeight: 0,
                          cargoDescription: '',
                          specialRequirements: [],
                          notes: ''
                        });
                      }}
                      className="px-6 py-3 border border-accent-beige-300 rounded-lg font-semibold text-secondary-700 hover:bg-accent-beige-100 transition-colors duration-200"
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-accent-peach-400 hover:bg-accent-peach-500 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Submit Fleet Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Active Requests Tab */}
            {activeTab === 'active-requests' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-primary-800">Active Fleet Requests</h2>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {fleetRequests.map((request) => (
                    <div key={request.id} className="bg-white border border-accent-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-accent-peach-100 p-3 rounded-lg">
                            <Truck className="h-6 w-6 text-accent-peach-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-primary-800">Request #{request.id}</h3>
                            <p className="text-sm text-secondary-600">
                              {request.numberOfVehicles} × {request.truckType} • {request.rentalDuration} {request.rentalType === 'hourly' ? 'hours' : 'days'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                          {(request.status === 'confirmed' || request.status === 'in_progress') && (
                            <button
                              onClick={() => handleTrackRequest(request.id)}
                              className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Navigation className="h-4 w-4" />
                              <span>Track</span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Pickup</p>
                          <p className="text-primary-800">{request.pickupLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Dropoff</p>
                          <p className="text-primary-800">{request.dropoffLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Scheduled</p>
                          <p className="text-primary-800">
                            {new Date(`${request.scheduledDate}T${request.scheduledTime}`).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-700">Total Cost</p>
                          <p className="text-primary-800 font-semibold">KES {request.estimatedCost.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-secondary-600">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{request.contactPerson}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{request.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {new Date(request.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                        <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium text-sm flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-primary-800">Invoices</h2>
                  <button className="text-accent-peach-400 hover:text-accent-peach-500 font-medium">
                    Download All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {invoices.map((invoice) => {
                    const relatedRequest = fleetRequests.find(req => req.id === invoice.jobId);
                    return (
                      <div key={invoice.id} className="bg-white border border-accent-beige-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary-100 p-3 rounded-lg">
                              <FileText className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-primary-800">Invoice #{invoice.id.slice(-6)}</h3>
                              <p className="text-sm text-secondary-600">
                                Request #{invoice.jobId} • {new Date(invoice.createdAt).toLocaleDateString()}
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
                            <p className="text-2xl font-bold text-primary-800 mt-2">KES {invoice.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {relatedRequest && (
                          <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-secondary-600">
                            <div>From: {relatedRequest.pickupLocation}</div>
                            <div>To: {relatedRequest.dropoffLocation}</div>
                            <div>Vehicles: {relatedRequest.numberOfVehicles} × {relatedRequest.truckType}</div>
                            <div>Duration: {relatedRequest.rentalDuration} {relatedRequest.rentalType === 'hourly' ? 'hours' : 'days'}</div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-secondary-600">
                            <span>Base: KES {invoice.breakdown.baseRate.toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>Platform Fee: KES {invoice.breakdown.platformFee.toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>VAT: KES {invoice.breakdown.taxes.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-accent-peach-400 hover:text-accent-peach-500 font-medium text-sm flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Invoice</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary-800">Business Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-accent-peach-400 to-accent-peach-500 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('request-fleet')}
                        className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left"
                      >
                        🚚 Request New Fleet Service
                      </button>
                      <button
                        onClick={() => setActiveTab('active-requests')}
                        className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-left"
                      >
                        📍 Track Active Requests
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
                        <span className="text-sm text-secondary-600">Request #req-003 completed successfully</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent-peach-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Request #req-001 is in progress</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Request #req-002 confirmed</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                        <span className="text-sm text-secondary-600">Invoice generated for request #req-003</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Viewer */}
      {selectedInvoice && selectedJobForInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice}
          job={selectedJobForInvoice}
          isOpen={isInvoiceViewerOpen}
          onClose={() => {
            setIsInvoiceViewerOpen(false);
            setSelectedInvoice(null);
            setSelectedJobForInvoice(null);
            setActiveTab('active-requests');
          }}
        />
      )}
    </div>
  );
};

export default BusinessDashboard;