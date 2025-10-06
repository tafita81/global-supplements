import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  Menu,
  ChevronDown,
  Star,
  Shield,
  Award
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/language-selector";

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigationItems = [
    { name: t("navigation.home"), href: "#home", id: "home" },
    { name: t("navigation.about"), href: "#about", id: "about" },
    { name: t("navigation.services"), href: "#services", id: "services" },
    { name: t("navigation.solutions"), href: "#solutions", id: "solutions" },
    { name: t("navigation.contact"), href: "#contact", id: "contact" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      {/* Top Bar - Trust Signals */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Orlando, FL - USA</span>
                <span className="sm:hidden">Orlando, FL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 2029498397</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@globalsupplements.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-yellow-500 text-black font-semibold">
                <Star className="h-3 w-3 mr-1" />
                A+ BBB Rating
              </Badge>
              <Badge variant="secondary" className="bg-green-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                FDA Registered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Global Supplements</h1>
              <p className="text-xs text-gray-600">Premium Worldwide Network</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Language Selector and CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              {t("navigation.getQuote")}
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg">
              {t("navigation.partnerWithUs")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <div className="mb-4">
                  <LanguageSelector />
                </div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600">
                  {t("navigation.getQuote")}
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {t("navigation.partnerWithUs")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}