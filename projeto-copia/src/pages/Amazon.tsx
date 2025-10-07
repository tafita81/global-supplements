import { useState, useEffect, useMemo, useRef } from "react";
import { Star, DollarSign, Brain, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { AmazonStrategyAI } from "@/services/amazonStrategy";
import { MultiAPIClient } from "@/services/rapidAPIClient";
import { aiValidator } from "@/services/aiProductValidator";
import { productMonitor } from "@/services/productMonitor";
import { AmazonHeader } from "@/components/amazon/AmazonHeader";
import { useMarketplace } from "@/hooks/useMarketplace";
import { getAffiliateLink } from "@/config/amazonMarketplaces";
import { geolocationService } from "@/services/geolocation";
import { currencyService } from "@/services/currency";
import amazonIcon from "@/assets/amazon-icon.png";

// Import high-quality flags from assets
import usFlag from "@/assets/flags/us.png";
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
import plFlag from "@/assets/flags/pl.svg";
import saFlag from "@/assets/flags/sa.png";

interface AmazonProduct {
  asin: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  affiliateLink: string;
  category: string;
  prime: boolean;
  _score?: number;
  _commission?: number;
}

const apiClient = new MultiAPIClient();
const strategyAI = new AmazonStrategyAI();

const productCache = new Map<string, { products: any[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const Amazon = () => {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("beauty");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [apiStats, setApiStats] = useState<any[]>([]);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const { toast } = useToast();
  const { currentMarketplace, setMarketplaceById, initializeFromGeolocation } = useMarketplace();
  
  // ⚠️ FIX: Previne múltiplas execuções simultâneas
  const isSearching = useRef(false);
  
  // 🛡️ REQUEST ID: Protege contra race conditions quando marketplace muda rapidamente
  const globalFetchRequestId = useRef(0);
  const searchFetchRequestId = useRef(0);
  
  // 🌟 GLOBAL TOP PRODUCTS: Cache dos 40 produtos mais populares GERAIS da Amazon
  // Inclui marketplaceId E domain para evitar usar cache stale após mudança de marketplace
  const [globalTopProducts, setGlobalTopProducts] = useState<{
    marketplaceId: string;
    domain: string;
    products: AmazonProduct[];
  } | null>(null);
  
  // 🔄 Versão dos produtos globais (incrementa quando carregam)
  const [globalProductsVersion, setGlobalProductsVersion] = useState(0);

  // Auto-detecta país do visitante na primeira carga
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        setIsDetectingLocation(true);
        const marketplaceId = await geolocationService.detectMarketplace();
        initializeFromGeolocation(marketplaceId);
      } catch (error) {
        console.warn('Erro ao detectar país, usando USA como padrão:', error);
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectUserCountry();
  }, []); // Executa apenas uma vez na montagem

  // 🌟 Busca TOP 40 produtos GERAIS mais populares da Amazon (sem filtro de categoria)
  // Re-busca quando o marketplace mudar!
  useEffect(() => {
    if (isDetectingLocation) {
      return; // Aguarda detecção de localização
    }
    
    const fetchGlobalTopProducts = async () => {
      // 🛡️ Incrementa request ID e guarda referência local
      globalFetchRequestId.current += 1;
      const thisRequestId = globalFetchRequestId.current;
      
      try {
        // ⚠️ LIMPA cache antigo IMEDIATAMENTE para evitar uso de dados stale
        setGlobalTopProducts(null);
        console.log(`🌟 Buscando TOP 40 produtos GERAIS (request #${thisRequestId})...`);
        
        // Busca produtos gerais focando nas 5 categorias principais
        const results = await apiClient.searchProducts(
          "supplements vitamins beauty skincare biotin collagen hyaluronic keratin hair skin nails health wellness fitness nutrition", 
          40,
          currentMarketplace.id,
          currentMarketplace.domain,
          'HIGHEST_RATED'  // 🎯 ORDENA POR REVIEWS para garantir produtos com 100K+ reviews
        );
        
        // 🛡️ Só atualiza se ESTA requisição ainda é a mais recente (evita race condition)
        if (thisRequestId === globalFetchRequestId.current) {
          setGlobalTopProducts({
            marketplaceId: currentMarketplace.id,
            domain: currentMarketplace.domain,
            products: results
          });
          setGlobalProductsVersion(v => v + 1); // Incrementa versão para triggar re-agregação
          console.log(`✅ TOP 40 GERAIS carregados: ${results.length} produtos (${results[0]?.reviews || 0} reviews no topo)`);
        } else {
          console.log(`⚠️ Request #${thisRequestId} descartado - nova requisição em andamento (#${globalFetchRequestId.current})`);
        }
        
        // Log dos top 5 para debug
        if (results.length > 0) {
          console.log(`📊 Top 5 produtos gerais:`);
          results.slice(0, 5).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.title.substring(0, 60)}... (${p.reviews} reviews)`);
          });
        }
      } catch (error) {
        console.error('❌ Erro ao buscar produtos gerais:', error);
      }
    };
    
    fetchGlobalTopProducts();
  }, [isDetectingLocation, currentMarketplace.id, currentMarketplace.domain]);

  const { t } = useTranslation();
  
  const categories = [
    { id: "all", label: t('amazon.categories.all'), keywords: "supplements vitamins health wellness" },
    { id: "beauty", label: t('amazon.categories.beautyPersonalCare'), keywords: "beauty supplements biotin collagen hair skin nails vitamins keratin" },
    { id: "wellness", label: t('amazon.categories.healthHousehold'), keywords: "health care medical monitor device first aid" },
    { id: "devices", label: t('amazon.categories.healthWellnessDevices'), keywords: "fitness tracker smart watch blood pressure monitor thermometer scale" },
    { id: "sports", label: t('amazon.categories.sportsNutrition'), keywords: "protein powder whey creatine pre-workout bcaa" },
    { id: "vitamins", label: t('amazon.categories.vitaminsSupplements'), keywords: "vitamin supplement mineral multivitamin probiotic omega" },
  ];

  const subcategories: Record<string, Array<{key: string, label: string}>> = {
    'vitamins': [
      {key: 'Multivitamins', label: t('amazon.subcategories.multivitamins')},
      {key: 'Single Vitamins', label: t('amazon.subcategories.singleVitamins')},
      {key: 'Minerals', label: t('amazon.subcategories.minerals')},
      {key: 'Herbs & Botanicals', label: t('amazon.subcategories.herbsBotanicals')},
      {key: 'Probiotics', label: t('amazon.subcategories.probiotics')},
      {key: 'Omega-3', label: t('amazon.subcategories.omega3')},
      {key: 'Digestive Enzymes', label: t('amazon.subcategories.digestiveEnzymes')},
      {key: 'Antioxidants', label: t('amazon.subcategories.antioxidants')},
      {key: 'Amino Acids', label: t('amazon.subcategories.aminoAcids')},
      {key: 'Collagen Supplements', label: t('amazon.subcategories.collagenSupplements')}
    ],
    'sports': [
      {key: 'Protein Powders', label: t('amazon.subcategories.proteinPowders')},
      {key: 'Pre-Workout', label: t('amazon.subcategories.preWorkout')},
      {key: 'Post-Workout', label: t('amazon.subcategories.postWorkout')},
      {key: 'Energy Drinks', label: t('amazon.subcategories.energyDrinks')},
      {key: 'BCAAs', label: t('amazon.subcategories.bcaas')},
      {key: 'Creatine', label: t('amazon.subcategories.creatine')},
      {key: 'Amino Acids', label: t('amazon.subcategories.aminoAcids')},
      {key: 'Nutrition Bars', label: t('amazon.subcategories.nutritionBars')},
      {key: 'Fat Burners', label: t('amazon.subcategories.fatBurners')},
      {key: 'Electrolytes', label: t('amazon.subcategories.electrolytes')},
      {key: 'Nitric Oxide', label: t('amazon.subcategories.nitricOxide')}
    ],
    'beauty': [
      {key: 'Skin Care', label: t('amazon.subcategories.skinCare')},
      {key: 'Hair Care', label: t('amazon.subcategories.hairCare')},
      {key: 'Nail Care', label: t('amazon.subcategories.nailCare')},
      {key: 'Bath & Body', label: t('amazon.subcategories.bathBody')},
      {key: 'Makeup', label: t('amazon.subcategories.makeup')},
      {key: 'Anti-Aging', label: t('amazon.subcategories.antiAging')},
      {key: 'Fragrance', label: t('amazon.subcategories.fragrance')},
      {key: 'Tools & Accessories', label: t('amazon.subcategories.toolsAccessories')},
      {key: 'Oral Care', label: t('amazon.subcategories.oralCare')},
      {key: 'Men\'s Grooming', label: t('amazon.subcategories.mensGrooming')}
    ],
    'devices': [
      {key: 'Fitness Trackers', label: t('amazon.subcategories.fitnessTrackers')},
      {key: 'Blood Pressure Monitors', label: t('amazon.subcategories.bloodPressureMonitors')},
      {key: 'Thermometers', label: t('amazon.subcategories.thermometers')},
      {key: 'Scales', label: t('amazon.subcategories.scales')},
      {key: 'Pulse Oximeters', label: t('amazon.subcategories.pulseOximeters')}
    ],
    'wellness': [
      {key: 'First Aid', label: t('amazon.subcategories.firstAid')},
      {key: 'Pain Relief', label: t('amazon.subcategories.painRelief')},
      {key: 'Digestive Health', label: t('amazon.subcategories.digestiveHealth')},
      {key: 'Cold & Flu', label: t('amazon.subcategories.coldFlu')},
      {key: 'Sleep Support', label: t('amazon.subcategories.sleepSupport')},
      {key: 'Mobility Aids', label: t('amazon.subcategories.mobilityAids')},
      {key: 'Braces & Supports', label: t('amazon.subcategories.bracesSupports')},
      {key: 'Wound Care', label: t('amazon.subcategories.woundCare')},
      {key: 'Physical Therapy', label: t('amazon.subcategories.physicalTherapy')},
      {key: 'Medical Storage', label: t('amazon.subcategories.medicalStorage')},
      {key: 'Respiratory Care', label: t('amazon.subcategories.respiratoryCare')}
    ]
  };

  // Mapping de subcategorias para queries específicas de busca
  // Queries primárias otimizadas para Amazon Real-Time API
  const subcategorySearchTerms: Record<string, string> = {
    'skin care': 'face cream moisturizer serum lotion cleanser toner mask collagen vitamin',
    'hair care': 'shampoo conditioner hair mask styling gel leave-in spray biotin keratin',
    'nail care': 'nail polish gel lacquer manicure top coat base remover',
    'bath & body': 'body lotion shower gel bath soap scrub body butter wash',
    'makeup': 'lipstick mascara foundation eyeshadow blush eyeliner concealer',
    'anti-aging': 'anti-aging wrinkle cream retinol serum hyaluronic acid',
    'multivitamins': 'multivitamin supplement',
    'single vitamins': 'vitamin supplements',
    'minerals': 'mineral supplements calcium magnesium',
    'herbs & botanicals': 'herbal supplements',
    'probiotics': 'probiotic supplement digestive',
    'omega-3': 'fish oil omega 3',
    'protein powders': 'protein powder whey',
    'pre-workout': 'pre workout supplement',
    'post-workout': 'post workout recovery supplement',
    'energy drinks': 'energy drink supplement',
    'bcaas': 'bcaa amino acids supplement',
    'creatine': 'creatine supplement',
    'fitness trackers': 'fitness tracker watch',
    'blood pressure monitors': 'blood pressure monitor',
    'thermometers': 'thermometer digital',
    'scales': 'bathroom scale digital',
    'pulse oximeters': 'pulse oximeter',
    'first aid': 'first aid kit',
    'pain relief': 'pain relief supplement cream',
    'digestive health': 'digestive health supplement',
    'cold & flu': 'cold flu supplement immune',
    'sleep support': 'sleep supplement melatonin',
    'vitamins': 'vitamin supplements multivitamin',
    'digestive enzymes': 'digestive enzyme supplement',
    'antioxidants': 'antioxidant supplement coq10',
    'amino acids': 'amino acid supplement',
    'collagen supplements': 'collagen supplement powder',
    'nutrition bars': 'protein bar energy bar',
    'fat burners': 'fat burner thermogenic supplement',
    'electrolytes': 'electrolyte supplement hydration',
    'nitric oxide': 'nitric oxide supplement pump',
    'fragrance': 'perfume cologne fragrance',
    'tools & accessories': 'makeup brush beauty tools',
    'oral care': 'toothpaste mouthwash dental',
    "men's grooming": 'mens grooming shaving beard',
    'mobility aids': 'walker cane wheelchair mobility',
    'braces & supports': 'knee brace back support',
    'wound care': 'bandage gauze wound dressing',
    'physical therapy': 'tens unit therapy massage',
    'medical storage': 'pill organizer medication box',
    'respiratory care': 'nebulizer cpap breathing'
  };

  // Queries de fallback caso a primária não retorne resultados suficientes
  const subcategoryFallbackTerms: Record<string, string> = {
    'skin care': 'facial cream lotion serum',
    'hair care': 'hair treatment conditioner shampoo',
    'nail care': 'nail lacquer polish remover',
    'bath & body': 'body wash lotion bath soap',
    'makeup': 'cosmetics lip eye face color',
    'anti-aging': 'anti-wrinkle face cream retinol',
    'multivitamins': 'vitamins',
    'single vitamins': 'vitamin',
    'minerals': 'supplements',
    'herbs & botanicals': 'herbal',
    'probiotics': 'probiotic',
    'omega-3': 'omega',
    'protein powders': 'protein',
    'pre-workout': 'workout',
    'post-workout': 'recovery',
    'energy drinks': 'energy',
    'bcaas': 'amino acids',
    'creatine': 'muscle supplement',
    'fitness trackers': 'smartwatch',
    'blood pressure monitors': 'health monitor',
    'thermometers': 'fever',
    'scales': 'weight scale',
    'pulse oximeters': 'oximeter',
    'first aid': 'medical supplies',
    'pain relief': 'pain',
    'digestive health': 'digestive',
    'cold & flu': 'immune support',
    'sleep support': 'sleep',
    'vitamins': 'vitamin',
    'digestive enzymes': 'enzyme',
    'antioxidants': 'antioxidant',
    'amino acids': 'amino',
    'collagen supplements': 'collagen',
    'nutrition bars': 'protein bar',
    'fat burners': 'weight loss',
    'electrolytes': 'hydration',
    'nitric oxide': 'pump supplement',
    'fragrance': 'perfume',
    'tools & accessories': 'beauty accessories',
    'oral care': 'dental care',
    "men's grooming": 'shaving',
    'mobility aids': 'mobility',
    'braces & supports': 'support brace',
    'wound care': 'bandage',
    'physical therapy': 'therapy',
    'medical storage': 'pill box',
    'respiratory care': 'breathing'
  };

  // Keywords para filtrar produtos relevantes por subcategoria (RELAXADOS para aceitar mais produtos)
  const subcategoryFilters: Record<string, string[]> = {
    'skin care': ['skin', 'face', 'facial', 'serum', 'moisturizer', 'cleanser', 'cream', 'lotion', 'beauty', 'care', 'derma', 'anti-wrinkle', 'acne'],
    'hair care': ['hair', 'shampoo', 'conditioner', 'treatment', 'scalp', 'salon', 'styling', 'repair', 'growth'],
    'nail care': ['nail', 'manicure', 'pedicure', 'cuticle', 'polish', 'gel', 'strengthener'],
    'bath & body': ['body', 'bath', 'shower', 'soap', 'wash', 'lotion', 'gel', 'scrub', 'oil', 'butter'],
    'makeup': ['makeup', 'cosmetic', 'beauty', 'lip', 'eye', 'face', 'foundation', 'mascara', 'blush', 'powder', 'brush', 'palette'],
    'anti-aging': ['anti', 'aging', 'age', 'wrinkle', 'collagen', 'retinol', 'youth', 'firm', 'lift'],
    'multivitamins': ['multivitamin', 'multi', 'vitamin', 'daily', 'complete', 'one', 'complex'],
    'single vitamins': ['vitamin', 'vit', 'supplement'],
    'minerals': ['mineral', 'calcium', 'magnesium', 'zinc', 'iron', 'supplement'],
    'herbs & botanicals': ['herb', 'botanical', 'plant', 'extract', 'natural', 'organic'],
    'probiotics': ['probiotic', 'digestive', 'gut', 'flora', 'bacteria', 'billion'],
    'omega-3': ['omega', 'fish', 'oil', 'dha', 'epa', 'krill', 'fatty'],
    'protein powders': ['protein', 'whey', 'isolate', 'powder', 'shake', 'muscle', 'nutrition'],
    'pre-workout': ['pre', 'workout', 'energy', 'pump', 'nitric', 'performance', 'boost'],
    'post-workout': ['post', 'recovery', 'bcaa', 'amino', 'muscle', 'repair'],
    'energy drinks': ['energy', 'drink', 'caffeine', 'boost', 'performance', 'stamina'],
    'bcaas': ['bcaa', 'amino', 'leucine', 'muscle', 'recovery'],
    'creatine': ['creatine', 'muscle', 'strength', 'performance', 'power'],
    'fitness trackers': ['fitness', 'tracker', 'watch', 'smart', 'activity', 'monitor', 'band', 'wearable'],
    'blood pressure monitors': ['blood', 'pressure', 'monitor', 'bp', 'cuff', 'heart', 'health'],
    'thermometers': ['thermometer', 'temperature', 'fever', 'digital', 'infrared', 'forehead'],
    'scales': ['scale', 'weight', 'body', 'bathroom', 'fat', 'digital'],
    'pulse oximeters': ['pulse', 'oximeter', 'oxygen', 'spo2', 'saturation', 'fingertip'],
    'first aid': ['first', 'aid', 'kit', 'bandage', 'wound', 'medical', 'emergency', 'supplies'],
    'pain relief': ['pain', 'relief', 'ache', 'sore', 'muscle', 'joint', 'back', 'topical', 'cream'],
    'digestive health': ['digestive', 'digest', 'fiber', 'gut', 'stomach', 'enzyme', 'probiotic', 'intestinal'],
    'cold & flu': ['cold', 'flu', 'immune', 'cough', 'sinus', 'congestion', 'throat', 'defense'],
    'sleep support': ['sleep', 'melatonin', 'rest', 'night', 'insomnia', 'calm', 'relax'],
    'vitamins': ['vitamin', 'vit', 'supplement', 'multi', 'daily', 'health', 'nutrition'],
    'digestive enzymes': ['enzyme', 'digestive', 'digest', 'bromelain', 'papain', 'lipase', 'amylase', 'protease'],
    'antioxidants': ['antioxidant', 'coq10', 'resveratrol', 'glutathione', 'astaxanthin', 'polyphenol', 'free radical'],
    'amino acids': ['amino', 'acid', 'lysine', 'arginine', 'glutamine', 'leucine', 'bcaa', 'essential'],
    'collagen supplements': ['collagen', 'peptide', 'hydrolyzed', 'skin', 'hair', 'nail', 'joint', 'bone'],
    'nutrition bars': ['bar', 'protein', 'energy', 'snack', 'meal', 'nutrition', 'granola'],
    'fat burners': ['fat', 'burner', 'thermogenic', 'weight', 'loss', 'metabolism', 'diet', 'lean'],
    'electrolytes': ['electrolyte', 'hydration', 'sodium', 'potassium', 'magnesium', 'replenish', 'hydrate'],
    'nitric oxide': ['nitric', 'oxide', 'pump', 'vasodilator', 'circulation', 'blood flow', 'arginine', 'citrulline'],
    'fragrance': ['perfume', 'cologne', 'fragrance', 'scent', 'eau', 'spray', 'toilette', 'parfum'],
    'tools & accessories': ['brush', 'sponge', 'applicator', 'tool', 'mirror', 'tweezers', 'scissors', 'bag'],
    'oral care': ['tooth', 'dental', 'mouth', 'oral', 'brush', 'paste', 'floss', 'rinse', 'mouthwash', 'whitening'],
    "men's grooming": ['men', 'shaving', 'beard', 'razor', 'trimmer', 'aftershave', 'grooming', 'male'],
    'mobility aids': ['walker', 'cane', 'wheelchair', 'mobility', 'rollator', 'scooter', 'crutch', 'walking'],
    'braces & supports': ['brace', 'support', 'compression', 'knee', 'ankle', 'back', 'wrist', 'elbow', 'shoulder'],
    'wound care': ['wound', 'bandage', 'gauze', 'dressing', 'tape', 'pad', 'antiseptic', 'first aid'],
    'physical therapy': ['therapy', 'tens', 'massage', 'rehab', 'recovery', 'exercise', 'band', 'hot', 'cold'],
    'medical storage': ['pill', 'organizer', 'medication', 'storage', 'dispenser', 'box', 'case', 'container'],
    'respiratory care': ['respiratory', 'nebulizer', 'cpap', 'breathing', 'inhaler', 'oxygen', 'mask', 'humidifier']
  };

  // 🚫 PALAVRAS PROIBIDAS por categoria (filtro determinístico ANTES da AI)
  // NOTA: Para categorias gerais, filtro mais suave. Para subcategorias, filtro rigoroso.
  const forbiddenKeywordsByCategory: Record<string, string[]> = {
    'beauty': [
      // APENAS suplementos ORAIS óbvios (permite produtos tópicos)
      'vitamin capsule', 'supplement capsule', 'tablet', 'pill', 'softgel', 'gummy vitamin',
      'multivitamin', 'fish oil', 'omega-3 supplement',
      // Nutrição Esportiva
      'whey protein', 'isolate protein', 'pre-workout', 'post-workout', 'bcaa', 'creatine',
      'thermogenic', 'mass gainer',
      // Equipamentos Médicos
      'blood pressure monitor', 'thermometer digital', 'glucose meter', 'first aid kit',
      'wheelchair', 'walker', 'crutch', 'nebulizer', 'cpap machine'
    ],
    'vitamins': [
      // Beleza/Cosméticos
      'lipstick', 'mascara', 'foundation', 'eyeshadow', 'blush', 'eyeliner', 'lip gloss',
      'makeup', 'cosmetic', 'nail polish', 'perfume', 'cologne', 'fragrance',
      'shampoo', 'conditioner', 'body wash', 'lotion', 'cream topical', 'serum topical',
      // Equipamentos
      'fitness tracker', 'smart watch', 'blood pressure monitor', 'thermometer',
      'scale', 'pulse oximeter', 'medical device'
    ],
    'sports': [
      // Beleza/Cosméticos
      'lipstick', 'mascara', 'foundation', 'eyeshadow', 'makeup', 'cosmetic',
      'perfume', 'cologne', 'nail polish', 'hair dye', 'shampoo', 'conditioner',
      // Equipamentos Médicos
      'blood pressure', 'thermometer', 'glucose meter', 'wheelchair', 'walker',
      'cpap', 'nebulizer', 'medical device', 'first aid kit'
    ],
    'health': [
      // Beleza/Cosméticos
      'lipstick', 'mascara', 'foundation', 'eyeshadow', 'makeup', 'cosmetic',
      'perfume', 'cologne', 'nail polish', 'body wash beauty',
      // Nutrição Esportiva
      'whey protein', 'mass gainer', 'pre-workout', 'post-workout energizer',
      'bcaa powder', 'creatine monohydrate'
    ],
    'devices': [
      // Beleza/Cosméticos
      'lipstick', 'mascara', 'foundation', 'makeup', 'perfume', 'nail polish',
      // Suplementos
      'vitamin', 'supplement', 'capsule', 'tablet', 'pill', 'gummy', 'powder supplement',
      'protein powder', 'pre-workout', 'bcaa', 'creatine', 'fat burner'
    ]
  };

  // 🚫 PALAVRAS PROIBIDAS por subcategoria específica (FILTRO RIGOROSO)
  const forbiddenKeywordsBySubcategory: Record<string, string[]> = {
    // BEAUTY & PERSONAL CARE - Bloqueia suplementos orais
    'makeup': ['vitamin', 'supplement', 'capsule', 'tablet', 'pill', 'biotin capsule', 'collagen capsule', 'gummy vitamin', 'softgel', 'mcg', 'iu vitamin'],
    'skin care': ['capsule', 'tablet', 'pill', 'gummy vitamin', 'softgel', 'supplement oral'],
    'hair care': ['capsule', 'tablet', 'pill', 'gummy vitamin', 'softgel', 'supplement oral', 'mcg biotin'],
    'nail care': ['capsule', 'tablet', 'pill', 'gummy vitamin', 'softgel'],
    'fragrance': ['vitamin', 'supplement', 'capsule', 'pill'],
    'oral care': ['vitamin supplement', 'gummy candy'],
    'tools & accessories': ['vitamin', 'supplement', 'capsule'],
    "men's grooming": ['vitamin', 'supplement', 'capsule'],
    
    // SPORTS NUTRITION - Bloqueia cosméticos
    'protein powders': ['lipstick', 'mascara', 'foundation', 'makeup', 'perfume', 'nail polish', 'face cream'],
    'pre-workout': ['lipstick', 'mascara', 'makeup', 'perfume', 'cosmetic'],
    'bcaas': ['lipstick', 'mascara', 'makeup', 'perfume', 'cosmetic'],
    'creatine': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'amino acids': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'fat burners': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'electrolytes': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'nitric oxide': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'nutrition bars': ['lipstick', 'mascara', 'makeup', 'perfume'],
    
    // VITAMINS & SUPPLEMENTS - Bloqueia cosméticos e equipamentos
    'single vitamins': ['lipstick', 'mascara', 'makeup', 'perfume', 'face cream', 'body lotion'],
    'multivitamins': ['lipstick', 'mascara', 'makeup', 'perfume', 'face cream'],
    'minerals': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'probiotics': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'omega-3': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'digestive enzymes': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'antioxidants': ['lipstick', 'mascara', 'makeup', 'perfume'],
    'collagen supplements': ['lipstick', 'mascara', 'foundation', 'makeup', 'perfume']
  };

  // 🔒 FILTRO DETERMINÍSTICO: Bloqueia produtos com palavras proibidas
  const applyForbiddenKeywordsFilter = (
    products: AmazonProduct[], 
    category: string, 
    subcategory: string | null
  ): { passed: AmazonProduct[], rejected: AmazonProduct[] } => {
    console.log(`🔍 Aplicando filtro determinístico: categoria="${category}", subcategoria="${subcategory}"`);
    
    const passed: AmazonProduct[] = [];
    const rejected: AmazonProduct[] = [];
    
    // ⭐ EXCEÇÃO: Suplementos de BELEZA (cabelo/pele/unhas) são permitidos em Beauty
    const beautySupplementKeywords = ['hair', 'skin', 'nail', 'beauty', 'collagen', 'biotin', 'keratin'];
    
    // Pega lista de palavras proibidas
    const categoryForbidden = forbiddenKeywordsByCategory[category] || [];
    const subcategoryForbidden = subcategory 
      ? (forbiddenKeywordsBySubcategory[subcategory.toLowerCase().trim()] || [])
      : [];
    
    const allForbidden = [...categoryForbidden, ...subcategoryForbidden];
    
    console.log(`📋 ${allForbidden.length} palavras proibidas encontradas`);
    
    if (allForbidden.length === 0) {
      console.log(`⚠️ Nenhuma palavra proibida configurada - todos os produtos passam`);
      return { passed: products, rejected: [] };
    }
    
    products.forEach(product => {
      const titleLower = product.title.toLowerCase();
      
      // ⭐ VERIFICA SE É SUPLEMENTO DE BELEZA
      const isBeautySupplementException = category === 'beauty' && 
        beautySupplementKeywords.some(keyword => titleLower.includes(keyword));
      
      // Verifica se contém alguma palavra proibida
      const hasForbidden = allForbidden.some(forbidden => {
        const forbiddenLower = forbidden.toLowerCase();
        return titleLower.includes(forbiddenLower);
      });
      
      // Se tem palavra proibida MAS é exceção de suplemento de beleza, permite
      if (hasForbidden && !isBeautySupplementException) {
        rejected.push(product);
      } else {
        passed.push(product);
      }
    });
    
    console.log(`🚫 Filtro determinístico: ${rejected.length}/${products.length} produtos bloqueados`);
    console.log(`✅ Filtro determinístico: ${passed.length}/${products.length} produtos aprovados`);
    
    if (rejected.length > 0 && rejected.length <= 3) {
      console.log(`📝 Produtos rejeitados:`, rejected.map(p => p.title));
    }
    
    return { passed, rejected };
  };

  // SEU STORE ID DE AFILIADO AMAZON - TODOS OS LINKS USAM ESTE ID!
  const AFFILIATE_TAG = "globalsupleme-20";

  const handleSearchClick = () => {
    setSelectedCategory("all");
    setSelectedSubcategory(null);
  };

  // Limpa subcategoria quando troca de categoria
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // FetchKey estável para evitar loop de renderização
  // NÃO inclui globalProductsVersion para evitar re-triggering infinito
  const fetchKey = useMemo(() => {
    return `${currentMarketplace.id}|${selectedCategory}|${selectedSubcategory || 'none'}`;
  }, [currentMarketplace.id, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    // Só busca produtos depois que terminou de detectar localização
    if (isDetectingLocation) {
      return;
    }
    
    // 🛡️ Incrementa request ID para esta busca
    searchFetchRequestId.current += 1;
    const thisRequestId = searchFetchRequestId.current;
    
    let cancelled = false;
    const searchId = `${Date.now()}_${Math.random()}`;
    
    const searchProductsEffect = async () => {
      console.log(`🎬 [${searchId}] Request #${thisRequestId} - Category: ${selectedCategory}, Subcategory: ${selectedSubcategory}`);
      
      // 🔄 Ativa loading MANTENDO produtos existentes (não limpa até ter novos dados)
      if (thisRequestId === searchFetchRequestId.current) {
        setLoading(true);
        isSearching.current = true;
      } else {
        console.log(`⏭️ Request #${thisRequestId} obsoleto, pulando...`);
        return;
      }
      
      try {
        strategyAI.setMarketplace(currentMarketplace.affiliateTag, currentMarketplace.domain);

        // 📊 AGREGAÇÃO POR CATEGORIA: Se não tem subcategoria, busca de TODAS as subcategorias
        const shouldAggregateFromSubcategories = !selectedSubcategory && selectedCategory !== 'all' && subcategories[selectedCategory];
        
        if (shouldAggregateFromSubcategories) {
          console.log(`📊 Categoria geral "${selectedCategory}" - Agregando produtos de TODAS as subcategorias`);
          
          const categorySubcategories = subcategories[selectedCategory];
          const allProducts: any[] = [];
          const seenAsins = new Set<string>();
          
          // 🌟 PASSO 0: Adiciona produtos GLOBAIS TOP que pertencem a esta categoria
          // ⚠️ Verifica se os produtos globais são do marketplace E domain ATUAIS (não stale)
          if (globalTopProducts && 
              globalTopProducts.marketplaceId === currentMarketplace.id &&
              globalTopProducts.domain === currentMarketplace.domain) {
            console.log(`  🌟 Filtrando produtos TOP GERAIS para categoria "${selectedCategory}"...`);
            
            const globalFiltered = applyForbiddenKeywordsFilter(
              globalTopProducts.products,
              selectedCategory,
              null
            );
            
            globalFiltered.passed.forEach(product => {
              if (!seenAsins.has(product.asin)) {
                seenAsins.add(product.asin);
                allProducts.push(product);
              }
            });
            
            console.log(`  ✨ ${globalFiltered.passed.length} produtos TOP GERAIS adicionados à categoria`);
          } else if (globalTopProducts) {
            console.log(`  ⏳ Produtos globais são de ${globalTopProducts.marketplaceId}/${globalTopProducts.domain}, aguardando ${currentMarketplace.id}/${currentMarketplace.domain}...`);
          } else {
            console.log(`  ⏳ Aguardando carregamento de produtos TOP GERAIS...`);
          }
          
          // 🎯 PASSO 1: Busca TOP 40 produtos com MAIS REVIEWS da categoria (SEM FILTROS)
          try {
            const category = categories.find(cat => cat.id === selectedCategory);
            const generalQuery = category?.keywords || selectedCategory;
            console.log(`  🏆 Buscando TOP 40 produtos com mais reviews: "${generalQuery}"`);
            
            const topReviewsResults = await apiClient.searchProducts(
              generalQuery,
              40, // TOP 40 com mais reviews
              currentMarketplace.id,
              currentMarketplace.domain,
              'HIGHEST_RATED'  // Ordena por produtos com mais reviews/ratings
            );
            
            console.log(`  ✅ Recebeu ${topReviewsResults.length} produtos top reviews`);
            
            // Aplica filtro determinístico
            const filtered = applyForbiddenKeywordsFilter(
              topReviewsResults,
              selectedCategory,
              null
            );
            
            // Adiciona produtos únicos
            filtered.passed.forEach(product => {
              if (!seenAsins.has(product.asin)) {
                seenAsins.add(product.asin);
                allProducts.push(product);
              }
            });
            
            console.log(`  🎯 TOP products: ${filtered.passed.length} produtos válidos adicionados`);
          } catch (error) {
            console.error(`  ❌ Erro ao buscar TOP products:`, error);
          }
          
          // 🔍 PASSO 2: Busca produtos de cada subcategoria (máximo 5 subcategorias)
          const subcatsToFetch = categorySubcategories.slice(0, 5);
          
          for (const subcat of subcatsToFetch) {
            const subcatKey = typeof subcat === 'string' ? subcat : subcat.key;
            const subcategoryKey = subcatKey.toLowerCase().trim();
            const subcatQuery = subcategorySearchTerms[subcategoryKey] || subcatKey;
            
            try {
              console.log(`  🔍 Buscando: ${subcatKey} → "${subcatQuery}"`);
              
              const subcatResults = await apiClient.searchProducts(
                subcatQuery,
                20, // 20 produtos por subcategoria
                currentMarketplace.id,
                currentMarketplace.domain
              );
              
              // Aplica filtro determinístico
              const filtered = applyForbiddenKeywordsFilter(
                subcatResults,
                selectedCategory,
                subcategoryKey
              );
              
              // Adiciona apenas produtos únicos (sem duplicatas)
              let newProducts = 0;
              filtered.passed.forEach(product => {
                if (!seenAsins.has(product.asin)) {
                  seenAsins.add(product.asin);
                  allProducts.push(product);
                  newProducts++;
                }
              });
              
              console.log(`  ✅ ${subcatKey}: ${newProducts} produtos novos (${filtered.passed.length - newProducts} duplicados ignorados)`);
            } catch (error) {
              console.error(`  ❌ Erro ao buscar ${subcatKey}:`, error);
            }
          }
          
          console.log(`📦 Total agregado: ${allProducts.length} produtos de ${subcatsToFetch.length} subcategorias`);
          
          // Ordena por reviews (decrescente) e pega top 40
          const sorted = productMonitor.sortByReviews(allProducts);
          const topProducts = sorted.slice(0, 40);
          
          // 🛡️ Só atualiza estado se ESTA requisição ainda é a mais recente
          if (thisRequestId === searchFetchRequestId.current) {
            console.log(`📊 Definindo ${topProducts.length} produtos no estado (Req #${thisRequestId})...`);
            setProducts([...topProducts]); // Força um novo array
            setLoading(false);
            setApiStats(apiClient.getUsageStats());
            console.log(`✅ Categoria agregada completa: ${topProducts.length} produtos (${topProducts[0]?.reviews || 0} reviews no topo)`);
            isSearching.current = false;
          } else {
            console.log(`⏭️ Req #${thisRequestId} descartado (atual: #${searchFetchRequestId.current})`);
            isSearching.current = false;
          }
          return;
        }
        
        // Determina a query de busca baseada na subcategoria selecionada ou categoria
        let searchQuery: string;
        
        if (selectedSubcategory) {
          // Se há subcategoria selecionada, usa o termo específico dela
          const subcategoryKey = selectedSubcategory.toLowerCase().trim();
          searchQuery = subcategorySearchTerms[subcategoryKey] || selectedSubcategory;
          console.log(`📋 Subcategoria selecionada: "${subcategoryKey}" → Query: "${searchQuery}"`);
        } else {
          // Usa as keywords da categoria selecionada
          const category = categories.find(cat => cat.id === selectedCategory);
          searchQuery = category?.keywords || "supplements";
          console.log(`📁 Categoria selecionada: "${selectedCategory}" → Query: "${searchQuery}"`);
        }
        
        // 🧠 SISTEMA INTELIGENTE: Verifica se precisa fazer requisição
        const monitorKey = productMonitor.getCacheKey(
          selectedCategory,
          selectedSubcategory,
          currentMarketplace.id
        );
        
        // Verifica se deve atualizar cache (inteligência para economizar requisições)
        const shouldRefresh = productMonitor.shouldRefreshCache(monitorKey);
        
        if (!shouldRefresh) {
          const cachedProducts = productMonitor.getCachedProducts(monitorKey);
          if (cachedProducts && cachedProducts.length > 0) {
            // Ordena por reviews (maior para menor)
            const sorted = productMonitor.sortByReviews([...cachedProducts]);
            const final = sorted.slice(0, 40);
            
            // 🛡️ Só atualiza se esta requisição ainda é válida
            if (thisRequestId === searchFetchRequestId.current) {
              setLoading(false);
              setProducts([...final]);
              setApiStats(apiClient.getUsageStats());
              console.log(`✅ Usando cache inteligente: ${final.length} produtos ordenados por reviews`);
            }
            return;
          }
        }
        
        // Só define loading=true se realmente vai buscar dados novos
        setLoading(true);
        
        console.log(`🔍 Buscando produtos: "${searchQuery}"`);
        
        let results = await apiClient.searchProducts(
          searchQuery, 
          40, 
          currentMarketplace.id,
          currentMarketplace.domain
        );

        let uniqueProducts = Array.from(
          new Map(results.map(p => [p.asin, p])).values()
        );
        
        let filteredProducts = uniqueProducts;
        
        // 🔒 FILTRO DETERMINÍSTICO: Remove produtos com palavras proibidas ANTES da AI
        if (selectedCategory !== 'all') {
          const deterministicFilter = applyForbiddenKeywordsFilter(
            uniqueProducts,
            selectedCategory,
            selectedSubcategory
          );
          
          // Usa apenas produtos que passaram no filtro
          uniqueProducts = deterministicFilter.passed;
          filteredProducts = deterministicFilter.passed;
          
          // Log dos produtos rejeitados para análise
          if (deterministicFilter.rejected.length > 0) {
            console.log(`📝 Produtos rejeitados (primeiros 3):`, 
              deterministicFilter.rejected.slice(0, 3).map(p => p.title)
            );
          }
        }
        
        // 🤖 VALIDAÇÃO AI: Usa inteligência artificial para garantir produtos corretos
        if (selectedSubcategory || selectedCategory !== 'all') {
          const categoryName = selectedCategory;
          const subcategoryName = selectedSubcategory;
          
          console.log(`🤖 Validando produtos com IA para: ${categoryName}${subcategoryName ? ' > ' + subcategoryName : ''}`);
          
          try {
            // Valida produtos em lote usando AI (já pré-filtrados)
            const validationResults = await aiValidator.validateProductBatch(
              uniqueProducts.map(p => ({ title: p.title, asin: p.asin })),
              categoryName,
              subcategoryName
            );
            
            // Filtra apenas produtos que a IA confirmou como relevantes
            filteredProducts = uniqueProducts.filter(product => 
              validationResults.get(product.asin) === true
            );
            
            console.log(`✅ IA validou: ${filteredProducts.length}/${uniqueProducts.length} produtos são relevantes`);
          } catch (error) {
            console.error('❌ Erro na validação AI, usando fallback:', error);
            
            // Fallback para filtro de keywords se AI falhar
            if (selectedSubcategory) {
              const subcategoryKey = selectedSubcategory.toLowerCase().trim();
              const filterKeywords = subcategoryFilters[subcategoryKey];
              
              if (filterKeywords && filterKeywords.length > 0) {
                console.log(`🔍 Aplicando filtro de keywords (fallback) para: "${subcategoryKey}"`);
                filteredProducts = uniqueProducts.filter(product => {
                  const titleLower = (product.title || '').toLowerCase();
                  const categoryLower = (product.category || '').toLowerCase();
                  const searchText = `${titleLower} ${categoryLower}`;
                  
                  const isRelevant = filterKeywords.some(keyword => 
                    searchText.includes(keyword.toLowerCase())
                  );
                  
                  return isRelevant;
                });
                
                console.log(`✅ Filtrados (fallback): ${filteredProducts.length} de ${uniqueProducts.length} produtos relevantes`);
              }
            }
          }
          
          // Aplica validação adicional se necessário
          if (selectedSubcategory) {
            const subcategoryKey = selectedSubcategory.toLowerCase().trim();
            const filterKeywords = subcategoryFilters[subcategoryKey];
            
            // SISTEMA DE FALLBACK: Se poucos produtos filtrados, tenta query alternativa
            if (filteredProducts.length < 10) {
              const fallbackQuery = subcategoryFallbackTerms[subcategoryKey];
              if (fallbackQuery && fallbackQuery !== searchQuery) {
                console.log(`⚠️ Apenas ${filteredProducts.length} produtos encontrados. Tentando fallback com AI: "${fallbackQuery}"`);
                
                const fallbackResults = await apiClient.searchProducts(
                  fallbackQuery,
                  40,
                  currentMarketplace.id,
                  currentMarketplace.domain
                );
                
                let fallbackUnique = Array.from(
                  new Map(fallbackResults.map(p => [p.asin, p])).values()
                );
                
                // 🔒 Aplica filtro determinístico nos produtos de fallback
                const fallbackFilter = applyForbiddenKeywordsFilter(
                  fallbackUnique,
                  selectedCategory,
                  selectedSubcategory
                );
                fallbackUnique = fallbackFilter.passed;
                
                // Valida produtos de fallback com AI
                try {
                  const fallbackValidation = await aiValidator.validateProductBatch(
                    fallbackUnique.map(p => ({ title: p.title, asin: p.asin })),
                    categoryName,
                    subcategoryName
                  );
                  
                  const fallbackFiltered = fallbackUnique.filter(product => 
                    fallbackValidation.get(product.asin) === true
                  );
                  
                  console.log(`🔄 Fallback com AI: ${fallbackFiltered.length}/${fallbackUnique.length} produtos válidos`);
                  
                  // Combina produtos originais com fallback (remove duplicatas)
                  const combinedMap = new Map();
                  [...filteredProducts, ...fallbackFiltered].forEach(p => {
                    if (!combinedMap.has(p.asin)) {
                      combinedMap.set(p.asin, p);
                    }
                  });
                  
                  filteredProducts = Array.from(combinedMap.values());
                  console.log(`✅ Total após fallback com AI: ${filteredProducts.length} produtos`);
                  
                } catch (fallbackError) {
                  console.error('❌ Erro na validação AI do fallback:', fallbackError);
                  // Usa produtos do fallback sem validação AI
                  const combinedMap = new Map();
                  [...filteredProducts, ...fallbackUnique].forEach(p => {
                    if (!combinedMap.has(p.asin)) {
                      combinedMap.set(p.asin, p);
                    }
                  });
                  filteredProducts = Array.from(combinedMap.values());
                  console.log(`✅ Total após fallback (sem AI): ${filteredProducts.length} produtos`);
                }
              }
            }
          }
        }
        
        // 🧠 PROCESSAMENTO INTELIGENTE: Detecta mudanças e economiza requisições
        const processed = productMonitor.processNewProducts(
          filteredProducts,
          monitorKey,
          selectedCategory,
          selectedSubcategory
        );
        
        let finalProductsList = processed.products;
        
        // ⚠️ GARANTIA DE MÍNIMO: Se tem menos de 20 produtos, busca mais
        if (finalProductsList.length < 20 && processed.needsMore) {
          console.log(`⚠️ Apenas ${finalProductsList.length}/20 produtos - buscando mais...`);
          
          try {
            const category = categories.find(cat => cat.id === selectedCategory);
            const broadQuery = category?.keywords || selectedCategory;
            
            const moreResults = await apiClient.searchProducts(
              broadQuery,
              30,
              currentMarketplace.id,
              currentMarketplace.domain
            );
            
            // Remove duplicados
            const existingAsins = new Set(finalProductsList.map(p => p.asin));
            let newUnique = moreResults.filter(p => !existingAsins.has(p.asin));
            
            // 🔒 Aplica filtro determinístico nos produtos adicionais
            if (selectedCategory !== 'all') {
              const additionalFilter = applyForbiddenKeywordsFilter(
                newUnique,
                selectedCategory,
                selectedSubcategory
              );
              newUnique = additionalFilter.passed;
            }
            
            // 🤖 VALIDAÇÃO AI dos produtos adicionais
            if (selectedSubcategory || selectedCategory !== 'all') {
              try {
                const additionalValidation = await aiValidator.validateProductBatch(
                  newUnique.map(p => ({ title: p.title, asin: p.asin })),
                  selectedCategory,
                  selectedSubcategory
                );
                
                const validatedAdditional = newUnique.filter(product => 
                  additionalValidation.get(product.asin) === true
                );
                
                console.log(`✅ Produtos adicionais validados por AI: ${validatedAdditional.length}/${newUnique.length}`);
                finalProductsList = [...finalProductsList, ...validatedAdditional];
              } catch (error) {
                console.error('❌ Erro na validação AI dos produtos adicionais:', error);
                // Em caso de erro, não adiciona produtos não validados
                console.log(`⚠️ Mantendo apenas ${finalProductsList.length} produtos validados`);
              }
            } else {
              // Para categoria 'all', adiciona sem validação
              console.log(`✅ Buscados ${newUnique.length} produtos adicionais`);
              finalProductsList = [...finalProductsList, ...newUnique];
            }
          } catch (error) {
            console.error('❌ Erro ao buscar produtos adicionais:', error);
          }
        }
        
        // Ordena por reviews (maior → menor) 
        const sorted = productMonitor.sortByReviews(finalProductsList);
        const finalProducts = sorted.slice(0, 40);
        
        console.log(`📦 ${finalProducts.length} produtos (${finalProducts[0]?.reviews || 0} reviews no topo)`);
        console.log(`💡 Economia: ${processed.stats.apiCallsAvoided} requisições evitadas`);
        
        // 🛡️ Só atualiza se esta requisição ainda é a mais recente
        if (thisRequestId === searchFetchRequestId.current) {
          setLoading(false);
          setProducts([...finalProducts]);
          setApiStats(apiClient.getUsageStats());
          isSearching.current = false;
          console.log(`✅ Loading set to FALSE, ${finalProducts.length} produtos finais`);
        } else {
          isSearching.current = false;
          console.log(`⏭️ Req #${thisRequestId} descartado na finalização`);
        }
      } catch (error) {
        console.error('Search error:', error);
        
        // 🛡️ Só atualiza erro se esta requisição ainda é válida
        if (thisRequestId === searchFetchRequestId.current) {
          setProducts([]);
          setLoading(false);
          isSearching.current = false;
          console.log(`❌ Loading set to FALSE (error)`);
        } else {
          isSearching.current = false;
        }
      }
    };
    
    searchProductsEffect();
    
    return () => {
      console.log(`🔄 [${searchId}] useEffect cleanup - cancelando busca para: ${selectedCategory}/${selectedSubcategory || 'none'}`);
      cancelled = true;
    };
  }, [fetchKey, isDetectingLocation]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <AmazonHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearchClick}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Subcategories Bar - Dynamic based on selected category */}
      {subcategories[selectedCategory] && subcategories[selectedCategory].length > 0 && (
        <div className="bg-[#F7F7F7] border-b border-gray-300 py-3 px-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
            {subcategories[selectedCategory].map((sub) => (
              <button 
                key={sub.key}
                onClick={() => setSelectedSubcategory(sub.key.toLowerCase())}
                className={`text-xs hover:text-[#C7511F] hover:underline whitespace-nowrap transition-colors ${
                  selectedSubcategory?.toLowerCase() === sub.key.toLowerCase() 
                    ? 'text-[#C7511F] font-semibold underline' 
                    : 'text-gray-800'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full">
        
        {/* Global Credibility Section - Ultra Compact Premium Design */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-b border-gray-200 py-1.5 mb-6">
          <div className="w-full px-4 flex items-center justify-between gap-6">
            {/* Left: Compact Info */}
            <div className="flex items-center gap-3">
              <Badge className="bg-[#FF9900] text-black font-bold text-xs px-2 py-0.5 whitespace-nowrap">{t('amazon.badges.amazonOnelinkPartner')}</Badge>
              <Badge variant="outline" className="border-green-600 text-green-700 text-xs px-2 py-0.5 whitespace-nowrap flex items-center gap-1">
                <span>✓</span>
                <span>{t('amazon.badges.official')}</span>
              </Badge>
              <div className="h-5 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-xs">
                <svg className="h-3.5 w-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold text-gray-700">{t('amazon.badges.securePayment')}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-700">{t('amazon.badges.buyerProtection')}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-700">{t('amazon.badges.globalDelivery')}</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-700">{t('amazon.badges.easyReturns')}</span>
              </div>
            </div>
            
            {/* Right: All 14 Country Flags in Single Horizontal Row */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => setMarketplaceById('US')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'US' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={usFlag} width="32" height="24" alt="USA" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('CA')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'CA' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={caFlag} width="32" height="24" alt="Canada" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('UK')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'UK' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={gbFlag} width="32" height="24" alt="UK" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('DE')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'DE' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={deFlag} width="32" height="24" alt="Germany" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('FR')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'FR' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={frFlag} width="32" height="24" alt="France" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('IT')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'IT' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={itFlag} width="32" height="24" alt="Italy" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('ES')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'ES' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={esFlag} width="32" height="24" alt="Spain" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('JP')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'JP' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={jpFlag} width="32" height="24" alt="Japan" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('AU')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'AU' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={auFlag} width="32" height="24" alt="Australia" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('NL')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'NL' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={nlFlag} width="32" height="24" alt="Netherlands" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('SE')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'SE' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={seFlag} width="32" height="24" alt="Sweden" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('SG')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'SG' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={sgFlag} width="32" height="24" alt="Singapore" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('PL')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'PL' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={plFlag} width="32" height="24" alt="Poland" className="rounded shadow-sm" />
              </button>
              <button onClick={() => setMarketplaceById('SA')} className={`hover:scale-110 transition-transform cursor-pointer ${currentMarketplace.id === 'SA' ? 'ring-2 ring-[#FF9900] rounded' : ''}`}>
                <img src={saFlag} width="32" height="24" alt="Saudi Arabia" className="rounded shadow-sm" />
              </button>
            </div>
          </div>
        </div>


        {/* Products Grid */}
        {isDetectingLocation ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Detecting your location...</p>
          </div>
        ) : products.length === 0 && loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products from Amazon...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-4">
            {loading && (
              <div className="col-span-full mb-4 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                  <span className="text-sm font-medium">Updating products...</span>
                </div>
              </div>
            )}
            {products.map((product) => (
              <Card key={product.asin} className="hover:shadow-lg transition-all hover:-translate-y-1 bg-white border border-gray-200">
                <CardHeader className="p-0">
                  <div className="relative bg-white">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-72 object-contain rounded-t-lg p-4"
                      loading="lazy"
                    />
                    {product.rating >= 4.5 && product.reviews >= 500 && (
                      <Badge className="absolute top-3 left-3 bg-[#232F3E] text-white font-bold px-2 py-1 text-xs">
                        {t('amazon.badges.amazonsChoice')}
                      </Badge>
                    )}
                    {product.prime && (
                      <Badge className="absolute top-3 right-3 bg-[#00A8E1] text-white font-bold px-2 py-1">
                        <svg className="h-4 w-4 mr-1" viewBox="0 0 100 30" fill="currentColor">
                          <path d="M58.074 22.557c-4.372 3.223-10.718 4.94-16.177 4.94-7.658 0-14.562-2.831-19.784-7.544-.41-.37-.043-.875.45-.587 5.632 3.28 12.592 5.25 19.78 5.25 4.85 0 10.186-1.006 15.093-3.088.74-.314 1.36.487.638 1.03z"/>
                          <path d="M60.16 20.23c-.558-.716-3.697-.339-5.108-.17-.43.052-.496-.322-.108-.592 2.5-1.76 6.604-1.25 7.083-.662.48.593-.127 4.704-2.472 6.665-.36.302-.704.141-.544-.258.527-1.314 1.707-4.267 1.15-4.982z"/>
                        </svg>
                        Prime
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <CardTitle className="text-base mb-3 line-clamp-2 font-normal text-[#0F1111] hover:text-[#C7511F] cursor-pointer leading-snug">
                    {product.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-[#0F1111] mr-1">{product.rating}</span>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-[#FFA41C] text-[#FFA41C]' : 'fill-gray-300 text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#007185] ml-2 hover:text-[#C7511F] cursor-pointer">
                      {product.reviews.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-bold text-[#B12704]">
                      {product.price}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button 
                    className="professional-cta-animation w-full relative overflow-hidden bg-[#EFEFEF] text-[#FF9900] text-sm font-bold px-6 py-3 rounded-full border-[3px] border-[#FF9900] hover:shadow-[0_20px_60px_-15px_rgba(255,153,0,0.8)] transition-all duration-500 hover:scale-105 h-12 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000"
                    onClick={() => window.open(product.affiliateLink, '_blank')}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <img 
                        src={amazonIcon} 
                        alt="Amazon" 
                        className="h-5 w-5" 
                      />
                      {t('amazon.buttons.shopPremiumProduct')}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#232F3E] to-[#131921] text-white rounded-lg p-6">
          <div className="flex items-start gap-4">
            <ShoppingCart className="h-8 w-8 flex-shrink-0 text-[#FF9900]" />
            <div>
              <h3 className="text-xl font-bold mb-2">Amazon Affiliate Program</h3>
              <p className="text-gray-300">
                All products are linked through our Amazon Associates affiliate program (Store ID: globalsupleme-20). 
                We earn a commission on qualifying purchases at no extra cost to you.
                Products are updated in real-time from Amazon's catalog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amazon;
