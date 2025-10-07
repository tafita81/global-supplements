import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, Star, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TechWellnessBundles() {
  const { t } = useTranslation();
  
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

        <div className="max-w-4xl mx-auto">
          <Card className="premium-glass border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 text-primary w-fit">
                <Scan className="h-12 w-12" />
              </div>
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