import React from 'react';
import { 
  X, 
  Download, 
  Mail, 
  FileText, 
  Calendar, 
  MapPin, 
  Truck, 
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Invoice, Job } from '../types';

interface InvoiceViewerProps {
  invoice: Invoice;
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoice,
  job,
  isOpen,
  onClose
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'disputed': return <AlertCircle className="h-5 w-5 text-error-500" />;
      default: return <Clock className="h-5 w-5 text-warning-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success-100 text-success-700';
      case 'disputed': return 'bg-error-100 text-error-700';
      default: return 'bg-warning-100 text-warning-700';
    }
  };

  const handleDownload = () => {
    // In a real app, this would download the PDF from the server
    window.open(invoice.pdfUrl, '_blank');
  };

  const handleEmailInvoice = () => {
    // In a real app, this would trigger an email send
    alert('Invoice has been sent to your email address.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-accent-beige-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-accent-beige-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-accent-peach-600" />
            <div>
              <h2 className="text-2xl font-bold text-primary-800">Invoice #{invoice.id.slice(-8)}</h2>
              <p className="text-secondary-600">Generated on {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEmailInvoice}
              className="flex items-center space-x-2 px-4 py-2 text-accent-peach-400 hover:bg-accent-peach-50 rounded-lg transition-colors duration-200"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-peach-400 text-white hover:bg-accent-peach-500 rounded-lg transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Status */}
          <div className="flex items-center justify-between mb-6 p-4 bg-accent-beige-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(invoice.status)}
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
                <p className="text-sm text-secondary-600 mt-1">
                  {invoice.status === 'paid' && 'Payment completed successfully'}
                  {invoice.status === 'pending' && 'Payment pending'}
                  {invoice.status === 'disputed' && 'Payment disputed - under review'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-800">KES {invoice.amount.toLocaleString()}</p>
              <p className="text-sm text-secondary-600">Total Amount</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Job Details */}
            <div className="space-y-6">
              {/* Trip Information */}
              <div className="bg-white border border-accent-beige-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Trip Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Pickup Location</p>
                    <p className="text-secondary-600">{job.pickup.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-700">Dropoff Location</p>
                    <p className="text-secondary-600">{job.dropoff.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Scheduled Time</p>
                      <p className="text-secondary-600">{new Date(job.scheduledTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Duration</p>
                      <p className="text-secondary-600">
                        {job.durationHours} {job.bookingType === 'hourly' ? 'hours' : 'days'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="bg-white border border-accent-beige-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Cargo Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Cargo Type</p>
                      <p className="text-secondary-600">{job.cargo.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Weight</p>
                      <p className="text-secondary-600">{job.cargo.weight} kg</p>
                    </div>
                  </div>
                  {job.cargo.description && (
                    <div>
                      <p className="text-sm font-medium text-secondary-700">Description</p>
                      <p className="text-secondary-600">{job.cargo.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Provider */}
              <div className="bg-white border border-accent-beige-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Service Provider
                </h3>
                <div className="space-y-2">
                  <p className="font-medium">Driver: John Mwangi</p>
                  <p className="text-secondary-600">License: DL123456789</p>
                  <p className="text-secondary-600">Vehicle: 2022 Toyota Hilux</p>
                  <p className="text-secondary-600">Plate: KCA 123A</p>
                  <p className="text-secondary-600">Location: Kenya</p>
                </div>
              </div>
            </div>

            {/* Right Column - Cost Breakdown */}
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <div className="bg-white border border-accent-beige-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">
                      Base Rate ({job.durationHours} {job.bookingType === 'hourly' ? 'hrs' : 'days'})
                    </span>
                    <span className="font-medium">KES {invoice.breakdown.baseRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Distance Fee</span>
                    <span className="font-medium">KES {invoice.breakdown.distanceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Platform Fee (10%)</span>
                    <span className="font-medium">KES {invoice.breakdown.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">VAT (16%)</span>
                    <span className="font-medium">KES {invoice.breakdown.taxes.toLocaleString()}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span className="text-accent-peach-600">KES {invoice.breakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-accent-beige-200 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Payment Method</span>
                    <span className="font-medium">M-Pesa ****1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Transaction ID</span>
                    <span className="font-medium">TXN-{invoice.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Payment Date</span>
                    <span className="font-medium">
                      {invoice.status === 'paid' ? new Date(invoice.createdAt).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-accent-beige-50 rounded-lg p-4">
                <h3 className="font-semibold text-primary-800 mb-4">TruckConnect Kenya</h3>
                <div className="text-sm text-secondary-600 space-y-1">
                  <p>Westlands Square, Westlands</p>
                  <p>Nairobi, Kenya 00100</p>
                  <p>Phone: +254-700-TRUCK-KE</p>
                  <p>Email: billing@truckconnect.co.ke</p>
                  <p>KRA PIN: P051234567A</p>
                </div>
              </div>

              {/* Actions */}
              {invoice.status === 'pending' && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <h4 className="font-medium text-warning-800 mb-2">Payment Pending</h4>
                  <p className="text-sm text-warning-700 mb-3">
                    Payment will be processed automatically upon job completion via M-Pesa.
                  </p>
                  <button className="w-full bg-warning-600 hover:bg-warning-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                    Pay via M-Pesa
                  </button>
                </div>
              )}

              {invoice.status === 'disputed' && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <h4 className="font-medium text-error-800 mb-2">Payment Disputed</h4>
                  <p className="text-sm text-error-700 mb-3">
                    This payment is under review. Our support team will contact you soon.
                  </p>
                  <button className="w-full bg-error-600 hover:bg-error-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                    Contact Support
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-accent-beige-200 text-center text-sm text-secondary-600">
            <p>This invoice was automatically generated by TruckConnect Kenya.</p>
            <p>For questions about this invoice, please contact our support team at +254-700-TRUCK-KE.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;