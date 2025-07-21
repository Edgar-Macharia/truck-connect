import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp,
  MapPin,
  Truck,
  Star,
  Calendar,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle,
  ArrowRight,
  Building,
  Clock,
  DollarSign
} from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    {
      number: '1,000+',
      label: 'Active Drivers',
      icon: Users,
      description: 'Verified professional drivers across Kenya'
    },
    {
      number: '10,000+',
      label: 'Jobs Completed',
      icon: CheckCircle,
      description: 'Successful deliveries and moves'
    },
    {
      number: '10+',
      label: 'Cities Served',
      icon: MapPin,
      description: 'Major metropolitan areas covered'
    },
    {
      number: '4.9★',
      label: 'Average Rating',
      icon: Star,
      description: 'Customer satisfaction score'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every driver is background-checked and verified. All vehicles are insured and regularly inspected for your peace of mind.',
      color: 'bg-accent-peach-500'
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'We put our customers at the heart of everything we do, ensuring exceptional service and support at every step.',
      color: 'bg-error-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to make transportation booking as simple as ordering a ride.',
      color: 'bg-warning-500'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Committed to reducing environmental impact through route optimization and promoting eco-friendly practices.',
      color: 'bg-accent-sage-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a strong community of drivers and customers who trust and support each other.',
      color: 'bg-secondary-700'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Continuously expanding our services and improving our platform to better serve our growing community.',
      color: 'bg-primary-700'
    }
  ];

  const team = [
    {
      name: 'Edmond',
      role: 'CEO & Co-Founder',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Former logistics executive with 15+ years experience in supply chain management and technology innovation.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Edgar',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Tech entrepreneur and software architect specializing in scalable platforms and mobile applications.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Florence',
      role: 'VP of Operations',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Operations expert with deep experience in fleet management and driver relations across multiple markets.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'George',
      role: 'Head of Customer Success',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Customer experience specialist focused on building lasting relationships and ensuring service excellence.',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Company Founded',
      description: 'TruckConnect was founded with a vision to revolutionize the transportation industry through technology in Kenya.'
    },
    {
      year: '2025',
      title: 'First 1,000 Drivers',
      description: 'Reached our first major milestone of 1,000 verified drivers across 10 major cities in Kenya.'
    },
    {
      year: '2025',
      title: 'Series A Funding',
      description: 'Secured $15M in Series A funding to accelerate growth and expand our technology platform.'
    },
    {
      year: '2025',
      title: 'National Expansion',
      description: 'Expanded to 10+ cities nationwide, serving over 20,000 customers and businesses.'
    },
    {
      year: '2025',
      title: 'Innovation Awards',
      description: 'Recognized as "Best Transportation Platform" and "Most Innovative Logistics Solution" in East Africa.'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Best Transportation Platform 2024',
      organization: 'Tech Innovation Awards'
    },
    {
      icon: Star,
      title: 'Top Rated Logistics App',
      organization: 'App Store & Google Play'
    },
    {
      icon: Building,
      title: 'Fastest Growing Startup',
      organization: 'Business Excellence Awards'
    },
    {
      icon: Users,
      title: 'Best Workplace Culture',
      organization: 'Employee Choice Awards'
    }
  ];

  return (
    <div className="min-h-screen bg-accent-beige-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionizing Transportation in Kenya
            </h1>
            <p className="text-xl text-accent-beige-200 max-w-3xl mx-auto mb-8">
              We're on a mission to make transportation services accessible, reliable, and efficient 
              for everyone. From individuals moving homes to businesses managing logistics, 
              TruckConnect is transforming how people think about transportation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-peach-400 hover:bg-accent-peach-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Join Our Mission
              </button>
              <button className="bg-transparent border-2 border-accent-beige-300 text-accent-beige-100 hover:bg-accent-peach-400 hover:border-accent-peach-400 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Meet Our Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-accent-peach-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-accent-peach-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-secondary-700 mb-1">{stat.label}</div>
                <div className="text-sm text-secondary-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-secondary-600 leading-relaxed">
                <p>
                  TruckConnect was born from a simple observation: finding reliable transportation 
                  for goods and belongings in Kenya was unnecessarily complicated, expensive, and stressful. 
                  Our founders experienced this firsthand when trying to move 
                  their startup office in Nairobi in 2024.
                </p>
                <p>
                  After spending hours calling different truck rental companies, dealing with 
                  hidden fees, and struggling with unreliable service, they realized there had 
                  to be a better way. That's when the idea for TruckConnect was born – a platform 
                  that would connect people who need transportation services with verified, 
                  professional drivers in their area.
                </p>
                <p>
                  Today, TruckConnect has grown from a small startup to a nationwide platform 
                  serving thousands of customers daily across Kenya. We've maintained our commitment to 
                  transparency, reliability, and exceptional customer service while continuously 
                  innovating to make transportation even more accessible.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" 
                alt="TruckConnect team working" 
                className="rounded-xl shadow-lg border border-accent-beige-200"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent-peach-400 text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">2+ Years</div>
                <div className="text-accent-beige-100">of Innovation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-accent-beige-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Mission & Vision
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Driving the future of transportation through innovation, reliability, and community.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-accent-beige-200">
              <div className="bg-accent-peach-100 p-4 rounded-lg w-fit mb-6">
                <Target className="h-8 w-8 text-accent-peach-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-4">Our Mission</h3>
              <p className="text-secondary-600 leading-relaxed">
                To democratize access to reliable transportation services by connecting people 
                and businesses with trusted drivers through innovative technology. We strive to 
                make every move, delivery, and transportation need simple, affordable, and stress-free
                for all Kenyans.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-accent-beige-200">
              <div className="bg-accent-sage-100 p-4 rounded-lg w-fit mb-6">
                <Globe className="h-8 w-8 text-accent-sage-600" />
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-4">Our Vision</h3>
              <p className="text-secondary-600 leading-relaxed">
                To become East Africa's most trusted transportation platform, where anyone can 
                access professional, reliable, and affordable transportation services at the 
                touch of a button, while creating sustainable economic opportunities for drivers
                throughout Kenya and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-accent-beige-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-accent-beige-200">
                <div className={`${value.color} p-3 rounded-lg w-fit mb-4`}>
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-accent-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Experienced leaders passionate about transforming the transportation industry in Kenya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-accent-beige-200">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-primary-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-accent-peach-500 font-medium mb-3">{member.role}</p>
                <p className="text-secondary-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-3">
                  <a href={member.linkedin} className="text-secondary-400 hover:text-accent-peach-400 transition-colors duration-200">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={member.twitter} className="text-secondary-400 hover:text-accent-peach-400 transition-colors duration-200">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Key milestones in our mission to revolutionize transportation in Kenya.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-accent-peach-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-accent-beige-200">
                      <div className="text-2xl font-bold text-accent-peach-500 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-primary-800 mb-3">{milestone.title}</h3>
                      <p className="text-secondary-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-accent-peach-400 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20 bg-accent-peach-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We're proud to be recognized for our innovation and commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-accent-beige-200">
                <div className="bg-warning-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <achievement.icon className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-secondary-600 text-sm">
                  {achievement.organization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-accent-beige-200 mb-8">
                Have questions about our services or want to learn more about TruckConnect? 
                We'd love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-accent-peach-400 mr-3" />
                  <span>+254-700-TRUCK-KE</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-accent-peach-400 mr-3" />
                  <span>hello@truckconnect.co.ke</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-accent-peach-400 mr-3 mt-1" />
                  <span>
                    Westlands Square, Westlands<br />
                    Nairobi, Kenya 00100
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-accent-peach-400 mr-3" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
            <div className="bg-primary-700 rounded-xl p-8 border border-primary-600">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg bg-primary-600 border border-primary-500 text-white placeholder-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg bg-primary-600 border border-primary-500 text-white placeholder-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg bg-primary-600 border border-primary-500 text-white placeholder-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                />
                <select className="w-full px-4 py-3 rounded-lg bg-primary-600 border border-primary-500 text-white focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400">
                  <option>General Inquiry</option>
                  <option>Partnership Opportunity</option>
                  <option>Driver Application</option>
                  <option>Media & Press</option>
                  <option>Technical Support</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg bg-primary-600 border border-primary-500 text-white placeholder-accent-beige-300 focus:ring-2 focus:ring-accent-peach-400 focus:border-accent-peach-400"
                ></textarea>
                <button className="w-full bg-accent-peach-400 hover:bg-accent-peach-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                  Send Message
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;