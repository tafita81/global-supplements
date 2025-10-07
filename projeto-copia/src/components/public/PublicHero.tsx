import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  TrendingUp, 
  Shield, 
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Zap,
  Building2
} from "lucide-react";
import premiumProductsImage from "@/assets/premium-products-showcase-4k.jpg";
import amazonLogo from "@/assets/amazon-logo.png";
import { useTranslation } from "react-i18next";

export function PublicHero() {
  const { t } = useTranslation();
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={premiumProductsImage} 
          alt="Premium supplements and global network" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-purple-900/90 to-indigo-900/95"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-white">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-yellow-500 text-black font-semibold">
                <Star className="h-3 w-3 mr-1" />
                {t('public.hero.badges.bbbRated')}
              </Badge>
              <Badge className="bg-green-600">
                <Shield className="h-3 w-3 mr-1" />
                {t('public.hero.badges.fdaRegistered')}
              </Badge>
              <Badge className="bg-blue-600">
                <Award className="h-3 w-3 mr-1" />
                {t('public.hero.badges.isoSystem')}
              </Badge>
            </div>

            {/* Main Headline - Attention Engineering */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                {t("hero.title").split(" ")[0]} {t("hero.title").split(" ")[1]}
              </span>
              <br />
              <span className="text-white">
                {t("hero.title").split(" ").slice(2).join(" ")}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-blue-200 mb-6 font-medium">
              {t("hero.subtitle")}
            </p>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl">
              {t("hero.description")}
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">{t("hero.benefits.profitMargins")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">{t("hero.benefits.compliance")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">{t("hero.benefits.coverage")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg">{t("hero.benefits.support")}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative inline-block group">
                {/* Urgency Badge */}
                <div className="absolute -top-3 -right-3 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  {t("public.hero.amazonBadge")}
                </div>
                
                <a 
                  href="https://www.globalsupplements.site/amazon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  aria-label="Shop premium supplements on Amazon - opens in new tab"
                >
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden bg-gradient-to-r from-[#FF9900] via-[#FFB84D] to-[#FF9900] bg-[length:200%_100%] text-black text-lg px-10 py-7 rounded-full font-bold shadow-[0_10px_40px_-15px_rgba(255,153,0,0.6),0_0_80px_-20px_rgba(255,153,0,0.4)] hover:shadow-[0_20px_60px_-15px_rgba(255,153,0,0.9),0_0_100px_-10px_rgba(255,153,0,0.6)] transition-all duration-500 hover:bg-[position:100%_0] hover:scale-110 hover:-translate-y-1 active:scale-105 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-blue-900 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:-translate-x-full group-hover:before:translate-x-full before:transition-transform before:duration-700 after:absolute after:inset-0 after:rounded-full after:bg-white/0 group-hover:after:bg-white/10 after:transition-colors after:duration-300 animate-[subtle-pulse_3s_ease-in-out_infinite]"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      animation: 'subtle-pulse 3s ease-in-out infinite, magnetic-glow 2s ease-in-out infinite alternate'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <img 
                        src={amazonLogo} 
                        alt="" 
                        className="h-8 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[-8deg]" 
                        aria-hidden="true"
                      />
                      <span className="transition-all duration-300 group-hover:tracking-wider font-extrabold">
                        {t("public.hero.startPartnership")}
                      </span>
                    </span>
                  </Button>
                </a>
                
                {/* Social Proof */}
                <div className="text-center mt-2 text-sm text-white/80 font-medium">
                  {t("public.hero.amazonSubtext")}
                </div>
              </div>
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToServices}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6 rounded-full transition-all duration-300"
              >
                <Building2 className="h-5 w-5 mr-2" />
                {t("hero.viewSolutions")}
              </Button>
            </div>
          </div>

          {/* Right Column - Trust Indicators */}
          <div className="lg:pl-12">
            {/* Live Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
              <div className="text-center mb-6">
                <Badge className="bg-green-500 text-white mb-3">
                  <Zap className="h-3 w-3 mr-1" />
                  {t("hero.liveData")}
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-2">{t("hero.realTimeStatus")}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">10,847</div>
                  <div className="text-sm text-gray-300">{t("hero.activeSuppliers")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">52</div>
                  <div className="text-sm text-gray-300">{t("hero.countries")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">99.7%</div>
                  <div className="text-sm text-gray-300">{t("hero.uptime")}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">$2.8B</div>
                  <div className="text-sm text-gray-300">{t("hero.volume2024")}</div>
                </div>
              </div>
            </div>

            {/* Recent Success */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{t("hero.latestSuccess")}</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    {t("hero.successDescription")}
                  </p>
                  <Badge className="bg-blue-600 text-white">
                    {t("hero.hoursAgo")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}