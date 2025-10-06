import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, Heart } from "lucide-react";

const bundles = [
  {
    id: "mind-glow",
    name: "Mind & Glow Bundle",
    items: "Energy Supplement + AI Skincare Analyzer",
    price: "$89.99",
    icon: <Brain className="h-8 w-8" />
  },
  {
    id: "glowtech-pro", 
    name: "GlowTech Pro Bundle",
    items: "Skincare Analyzer + Gua Sha Massager + Wireless Charger",
    price: "$129.99",
    icon: <Sparkles className="h-8 w-8" />
  },
  {
    id: "total-wellness",
    name: "Total Wellness Kit",
    items: "All 4 products (Supplement + Skincare Analyzer + Gua Sha + Charger)",
    price: "$149.99",
    icon: <Heart className="h-8 w-8" />
  }
];

export function TechWellnessBundles() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Introducing: Global Supplement + Tech Bundles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've combined science, beauty, and technology into curated kits for modern wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="premium-glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 text-primary w-fit">
                  {bundle.icon}
                </div>
                <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                <div className="text-sm text-muted-foreground">{bundle.items}</div>
              </CardHeader>
              
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">{bundle.price}</div>
                <Button 
                  className="w-full gold-accent text-primary font-bold" 
                  size="lg"
                  onClick={() => window.location.href = `/bundles/${bundle.id}`}
                >
                  Pre-Order Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}