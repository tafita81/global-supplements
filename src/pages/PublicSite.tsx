import { Button } from "@/components/ui/button";
import { 
  Globe, 
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { PremiumVideoHeroPublic } from "@/components/premium/PremiumVideoHeroPublic";
import { AdvancedProductCategories } from "@/components/premium/AdvancedProductCategories";
import { PremiumCountryFlags } from "@/components/premium/PremiumCountryFlags";
import { PremiumTechShowcase } from "@/components/premium/PremiumTechShowcase";
import { PremiumTestimonials } from "@/components/premium/PremiumTestimonials";
import { TechWellnessBundles } from "@/components/premium/TechWellnessBundles";
import { CertificationBadges } from "@/components/premium/CertificationBadges";

export default function PublicSite() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      
      {/* Hero Video Premium - Public Version */}
      <PremiumVideoHeroPublic />
      
      {/* Advanced Product Categories */}
      <AdvancedProductCategories />
      
      {/* Tech & Wellness Bundles */}
      <TechWellnessBundles />
      
      {/* Country Flags Section */}
      <PremiumCountryFlags />


      {/* Premium Testimonials */}
      <PremiumTestimonials />



      {/* Certifications */}
      <CertificationBadges />

      <PremiumFooter />
    </div>
  );
}