import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import skinAnalysis1 from "@/assets/skin-analysis-1.jpg";
import skinAnalysis2 from "@/assets/skin-analysis-2.png";
import skinAnalysis3 from "@/assets/skin-analysis-3.png";

export function TechWellnessBundles() {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    { src: skinAnalysis1, alt: "8-Spectral AI Analysis - Precision for In-Depth Skin Insights" },
    { src: skinAnalysis2, alt: "AI Skin Detector in Action" },
    { src: skinAnalysis3, alt: "Real-Time Client Reports - Product Recommendations" }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('bundles.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('bundles.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="premium-glass border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
            
            {/* Image Carousel */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
              <img 
                src={images[currentImage].src} 
                alt={images[currentImage].alt}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImage 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge className="bg-[#00A8E1] text-white font-bold px-3 py-1">
                  Prime
                </Badge>
                <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-500">
                  <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                  5.0 (2 reviews)
                </Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                Skin Analysis Machine Professional - 21.5" HD Display
              </CardTitle>
              <div className="text-sm text-muted-foreground font-medium mb-2">
                Brand: Cobbawe
              </div>
              <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
                AI-Powered Facial Scanner for Salons & Spas, Product recommendations, 8-Spectral Imaging (Acne/Pigmentation/Wrinkle Detection), Multi-Language
              </div>
            </CardHeader>
            
            <CardContent className="text-center space-y-6 py-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  $1,580.00
                </div>
                <div className="text-sm text-muted-foreground">
                  Or $526.67/mo (3 mo)
                </div>
                <Badge variant="outline" className="mt-2 border-green-600 text-green-600 dark:text-green-500">
                  FREE Returns
                </Badge>
              </div>
              
              <a 
                href="https://amzn.to/4mU7qT4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full md:w-auto gold-accent text-primary font-bold text-lg px-12 py-6 hover:scale-105 transition-transform" 
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('bundles.preOrderNow')}
                </Button>
              </a>
              
              <div className="text-xs text-muted-foreground">
                Ships from and sold by Amazon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}