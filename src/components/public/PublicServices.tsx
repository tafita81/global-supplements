import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  Users, 
  Globe,
  Truck,
  FileCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const services = [
  {
    title: "B2B Global Trading",
    description: "Connect with verified premium supplement manufacturers worldwide through our AI-powered network.",
    icon: Building2,
    features: [
      "10,000+ Verified Suppliers",
      "Real-time Pricing & Availability", 
      "Automated Contract Management",
      "Quality Assurance Guarantee"
    ],
    benefits: "200-500% Profit Margins",
    color: "from-blue-500 to-cyan-500",
    category: "Trading"
  },
  {
    title: "Government Contracts",
    description: "Access exclusive government procurement opportunities in health and supplement sectors globally.",
    icon: Shield,
    features: [
      "SAM.gov Integration",
      "Compliance Automation",
      "Bid Preparation Support",
      "Contract Execution"
    ],
    benefits: "$100K - $2M per Contract",
    color: "from-green-500 to-emerald-500",
    category: "Government"
  },
  {
    title: "Private Label Solutions",
    description: "Custom supplement manufacturing and branding services with full regulatory compliance.",
    icon: Users,
    features: [
      "Custom Formulations",
      "FDA/CE Compliance",
      "Brand Development",
      "Global Distribution"
    ],
    benefits: "Complete Turnkey Solution",
    color: "from-purple-500 to-violet-500",
    category: "Manufacturing"
  },
  {
    title: "Global Logistics",
    description: "End-to-end supply chain management with AI-optimized routing and real-time tracking.",
    icon: Truck,
    features: [
      "Worldwide Shipping",
      "Customs Clearance",
      "Real-time Tracking",
      "Insurance Coverage"
    ],
    benefits: "40% Cost Reduction",
    color: "from-orange-500 to-red-500",
    category: "Logistics"
  },
  {
    title: "Regulatory Compliance",
    description: "Complete compliance management for all international markets and regulatory bodies.",
    icon: FileCheck,
    features: [
      "FDA Registration",
      "CE Marking",
      "GMP Certification",
      "Documentation Support"
    ],
    benefits: "100% Compliance Rate",
    color: "from-teal-500 to-blue-500",
    category: "Compliance"
  },
  {
    title: "Market Intelligence",
    description: "AI-powered market analysis and opportunity identification for maximum profitability.",
    icon: TrendingUp,
    features: [
      "Real-time Market Data",
      "Competitor Analysis",
      "Price Optimization",
      "Trend Forecasting"
    ],
    benefits: "94.7% Accuracy Rate",
    color: "from-pink-500 to-rose-500",
    category: "Analytics"
  }
];

export function PublicServices() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <Zap className="h-3 w-3 mr-1" />
            COMPREHENSIVE SOLUTIONS
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            End-to-End Supplement Business Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From sourcing to delivery, our Orlando-based team provides complete business solutions 
            backed by advanced AI technology and 15+ years of global market expertise.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits Badge */}
                  <div className="mb-4">
                    <Badge className={`bg-gradient-to-r ${service.color} text-white`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {service.benefits}
                    </Badge>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                    onClick={scrollToContact}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Scale Your Supplement Business?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join Fortune 500 companies and government agencies who trust our global network 
            for their supplement procurement and distribution needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
            >
              <Globe className="h-5 w-5 mr-2" />
              Start Partnership
            </Button>
            <Button size="lg" variant="outline">
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}