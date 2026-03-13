# TruckConnect Kenya 🚚

A modern, comprehensive truck booking and logistics platform connecting businesses and individuals with verified truck drivers across Kenya. Built with React, TypeScript, and Supabase.

[TruckConnect] <img width="1661" height="805" alt="Screenshot 2025-06-30 at 18 35 21" src="https://github.com/user-attachments/assets/5707deea-a7a3-42ae-9aa0-9ec3f09051ff" />

## 🌟 Features

### 🚛 **Multi-User Platform**
- **Individual Users**: Personal transportation and moving services
- **Business Users**: Commercial logistics and fleet management
- **Drivers**: Professional driver network with earnings tracking
- **Admin Panel**: Platform management and oversight

### 📱 **Core Functionality**
- **Real-time Truck Search**: Location-based search with advanced filtering
- **Fleet Variety**: 7+ truck types from pickup trucks to semi-trailers
- **Flexible Booking**: Hourly and daily rental options
- **Live GPS Tracking**: Real-time location updates and ETAs
- **Automated Invoicing**: PDF generation with detailed cost breakdowns
- **Rating System**: Comprehensive driver and customer reviews
- **Secure Payments**: Multiple payment methods including M-Pesa

### 🏢 **Business Features**
- **Fleet Requests**: Bulk vehicle booking for large operations
- **Custom Pricing**: Volume discounts and contract rates
- **Invoice Management**: Business-grade billing and accounting
- **Team Management**: Multi-user business accounts
- **Analytics Dashboard**: Performance metrics and insights

### 🚗 **Driver Features**
- **Earnings Tracking**: Detailed income and job statistics
- **Availability Management**: Real-time status updates
- **Route Optimization**: Efficient job scheduling
- **Performance Metrics**: Rating and completion statistics
- **Document Management**: License and insurance tracking

## 🛠 Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Google Maps API** for location services

### **Backend & Database**
- **Supabase** for authentication and database
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless operations

### **Development Tools**
- **Vite** for fast development and building
- **ESLint** for code quality
- **TypeScript** for type safety
- **PostCSS** with Autoprefixer

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Maps API key (optional for maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd truck-service-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key (optional)
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations
   - Configure authentication settings

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

### **Core Tables**
- `users` - User accounts and profiles
- `businesses` - Business account details
- `drivers` - Driver profiles and vehicle information
- `jobs` - Booking requests and job tracking
- `invoices` - Billing and payment records
- `ratings` - Review and rating system

### **Security**
- Row Level Security (RLS) enabled on all tables
- User-based access control
- Secure authentication with Supabase Auth


## 🚚 Truck Types & Pricing

| Truck Type | Capacity | Hourly Rate (KES) | Daily Rate (KES) | Use Cases |
|------------|----------|-------------------|------------------|-----------|
| Pickup Truck | 1,500-3,000 kg | 2,500-3,000 | 18,000-22,000 | Small moves, furniture |
| Double Cab | 1,200-2,500 kg | 2,800-3,200 | 20,000-24,000 | Team transport + cargo |
| Box Truck | 3,000-10,000 kg | 3,500-4,500 | 25,000-32,000 | Weather protection |
| Flatbed | 10,000-25,000 kg | 4,500-5,500 | 32,000-40,000 | Construction materials |
| Dry Van | 5,000-15,000 kg | 4,000-5,000 | 28,000-36,000 | Bulk cargo |
| Refrigerated | 8,000-20,000 kg | 5,000-6,000 | 36,000-45,000 | Perishable goods |
| Semi-Trailer | 25,000-80,000 kg | 8,000-10,000 | 60,000-75,000 | Heavy-duty transport |

## 📱 User Roles & Permissions

### **Individual Users**
- Book trucks for personal use
- Track shipments in real-time
- Rate and review drivers
- Manage payment methods
- View booking history

### **Business Users**
- Fleet management and bulk booking
- Team member management
- Custom pricing and contracts
- Advanced analytics and reporting
- Invoice management and accounting

### **Drivers**
- Vehicle and document management
- Earnings and performance tracking
- Job acceptance and scheduling
- Real-time location sharing
- Customer communication tools

### **Administrators**
- Platform oversight and management
- User verification and support
- Pricing and policy management
- Analytics and reporting
- System maintenance

## 🔧 Configuration

### **Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Configuration
VITE_APP_NAME=TruckConnect
VITE_APP_VERSION=1.0.0
```

### **Supabase Setup**
1. Create a new Supabase project
2. Enable authentication with email/password
3. Disable email confirmation for development
4. Run database migrations
5. Configure RLS policies

## 🚀 Deployment

### **Netlify (Recommended)**
```bash
# Build the project
npm run build

# Deploy to Netlify
# The build output will be in the 'dist' directory
```

### **Environment Variables for Production**
- Set up environment variables in your hosting platform
- Ensure Supabase URLs are configured for production
- Configure custom domain and SSL


### **Test Accounts**
- **Individual**: test@individual.com
- **Business**: test@business.com  
- **Driver**: test@driver.com
- **Password**: testpassword123
  

## 🔒 Security

### **Authentication & Authorization**
- Supabase Auth with JWT tokens
- Row Level Security (RLS) on all tables
- Role-based access control
- Secure password requirements

### **Data Protection**
- HTTPS enforcement
- Input validation and sanitization
- SQL injection prevention
- XSS protection


### **Developer Support**
- **GitHub Issues**: (https://github.com/Edgar-Macharia)


### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing frontend library
- **Pexels** for high-quality stock photography
- **Lucide** for beautiful, consistent icons

---

**Built with ❤️ in Kenya for the Kenyan logistics industry**

*TruckConnect - Connecting Kenya, One Delivery at a Time* 🇰🇪
