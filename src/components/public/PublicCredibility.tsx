import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Award, 
  Building2, 
  Star,
  CheckCircle,
  Globe,
  Users,
  FileCheck
} from "lucide-react";

const certifications = [
  {
    title: "FDA Registered",
    description: "Facility Registration Number: 12345678",
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    title: "ISO 9001:2015",
    description: "Quality Management System Certified",
    icon: Award,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "GMP Certified",
    description: "Good Manufacturing Practice Standards",
    icon: FileCheck,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    title: "Better Business Bureau",
    description: "A+ Rating Since 2018",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-50"
  }
];

const companyInfo = [
  {
    label: "DUNS Number",
    value: "123456789",
    description: "D&B Business Registry"
  },
  {
    label: "EIN",
    value: "12-3456789",
    description: "Federal Tax ID"
  },
  {
    label: "Founded",
    value: "2008",
    description: "15+ Years Experience"
  },
  {
    label: "Headquarters",
    value: "Orlando, FL",
    description: "United States"
  }
];

const trustIndicators = [
  "Member of Natural Products Association (NPA)",
  "Council for Responsible Nutrition (CRN)",
  "International Alliance of Dietary/Food Supplement Associations (IADSA)",
  "American Herbal Products Association (AHPA)",
  "Verified by Google My Business",
  "Listed on SAM.gov Government Contracting Database"
];

export function PublicCredibility() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <Shield className="h-3 w-3 mr-1" />
            TRUSTED & VERIFIED
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Industry-Leading Certifications & Compliance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our Orlando-based operations maintain the highest industry standards with full transparency 
            and regulatory compliance across all international markets.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${cert.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${cert.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Company Details */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h3>
            <div className="space-y-6">
              {companyInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-900">{info.label}</div>
                    <div className="text-sm text-gray-600">{info.description}</div>
                  </div>
                  <div className="font-mono text-lg text-blue-600">{info.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-900">Legal Entity</span>
              </div>
              <p className="text-gray-700 mb-2">Global Supplements Corporation</p>
              <p className="text-sm text-gray-600">
                Delaware C-Corporation registered in Florida with international operations 
                license for dietary supplement distribution.
              </p>
            </div>
          </div>

          {/* Right Column - Trust Indicators */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry Memberships</h3>
            <div className="space-y-3">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">{indicator}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-6 w-6" />
                <span className="text-lg font-semibold">Global Presence</span>
              </div>
              <p className="mb-4">
                Headquartered in Orlando with strategic partnerships across 52 countries, 
                we're your trusted American gateway to the global supplement market.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>2,400+ Clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Fortune 500 Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Assurance */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            100% Transparency Guarantee
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            All certifications, licenses, and registrations are publicly verifiable. 
            We maintain full documentation transparency for all business partnerships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Publicly Verifiable
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <FileCheck className="h-3 w-3 mr-1" />
              Full Documentation
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="h-3 w-3 mr-1" />
              Compliance Guaranteed
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}