import { Button } from "@/components/ui/button";
import { 
  Globe, 
  ArrowRight,
  ShoppingCart
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
import amazonLogo from "@/assets/amazon-logo-black.png";
import amazonIcon from "@/assets/amazon-icon.png";
import caFlag from "@/assets/flags/ca.png";
import gbFlag from "@/assets/flags/gb.png";
import deFlag from "@/assets/flags/de.png";
import frFlag from "@/assets/flags/fr.png";
import itFlag from "@/assets/flags/it.png";
import esFlag from "@/assets/flags/es.png";
import jpFlag from "@/assets/flags/jp.png";
import auFlag from "@/assets/flags/au.png";
import nlFlag from "@/assets/flags/nl.png";
import seFlag from "@/assets/flags/se.png";
import sgFlag from "@/assets/flags/sg.png";
import plFlag from "@/assets/flags/pl.png";
import saFlag from "@/assets/flags/sa.png";

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
      
      {/* Amazon Partnership Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#232F3E] to-[#131921] p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-4 py-2 rounded">
                      <img src={amazonLogo} alt="Amazon" className="h-8" />
                    </div>
                    <div className="h-8 w-px bg-white/30"></div>
                    <div>
                      <div className="text-sm text-blue-200">{t('amazon.partnership.officialPartner')}</div>
                      <div className="text-xs text-gray-300">{t('amazon.partnership.oneLinkProgram')}</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('amazon.partnership.shopTitle')}</h2>
                  <p className="text-gray-300 text-sm mb-4">{t('amazon.partnership.trustDescription')}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">{t('amazon.partnership.verifiedPartner')}</span>
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">{t('amazon.partnership.securePayment')}</span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{t('amazon.partnership.buyerProtection')}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button 
                    onClick={() => navigate('/amazon')}
                    className="bg-gradient-to-r from-[#FF9900] via-[#FFB84D] to-[#FF9900] hover:from-[#F08804] hover:to-[#F08804] text-black font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <img 
                      src={amazonIcon} 
                      alt="Amazon" 
                      className="h-7 w-7 mr-1" 
                    />
                    {t('amazon.partnership.shopButton')}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">{t('amazon.partnership.amazonVerified')}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <span>{t('amazon.partnership.shipsTo')}</span>
                    <div className="flex items-center gap-1.5">
                      <img src={caFlag} alt="Canada" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={gbFlag} alt="United Kingdom" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={deFlag} alt="Germany" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={frFlag} alt="France" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={itFlag} alt="Italy" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={esFlag} alt="Spain" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={jpFlag} alt="Japan" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={auFlag} alt="Australia" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={nlFlag} alt="Netherlands" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={seFlag} alt="Sweden" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={sgFlag} alt="Singapore" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={plFlag} alt="Poland" className="h-4 w-6 object-cover rounded-sm" />
                      <img src={saFlag} alt="Saudi Arabia" className="h-4 w-6 object-cover rounded-sm" />
                    </div>
                  </div>
                </div>
                <a 
                  href="https://affiliate-program.amazon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {t('amazon.partnership.verifyPartnership')}
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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