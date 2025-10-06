interface ProductSnapshot {
  asin: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  affiliateLink: string;
  category: string;
  prime: boolean;
  timestamp: number;
  lastChecked: number;
}

interface CategoryCache {
  products: ProductSnapshot[];
  lastUpdate: number;
  totalFetched: number;
  needsMoreProducts: boolean;
}

class ProductMonitor {
  private cache = new Map<string, CategoryCache>();
  private readonly MIN_PRODUCTS = 20;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
  private readonly CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
  
  getCacheKey(category: string, subcategory: string | null, marketplace: string): string {
    return `${marketplace}-${category}${subcategory ? '-' + subcategory : ''}`;
  }

  hasSignificantChange(old: ProductSnapshot, newProduct: any): boolean {
    const priceChanged = old.price !== newProduct.price;
    const reviewsIncreased = (newProduct.reviews || 0) > old.reviews;
    const ratingChanged = Math.abs((newProduct.rating || 0) - old.rating) > 0.1;
    
    return priceChanged || reviewsIncreased || ratingChanged;
  }

  shouldRefreshCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      console.log(`📊 Cache miss para "${cacheKey}" - primeira busca`);
      return true;
    }

    const cacheAge = Date.now() - cached.lastUpdate;
    
    if (cacheAge < this.CHECK_INTERVAL) {
      console.log(`⏱️ Cache recente (${Math.round(cacheAge / 1000)}s) - usando cache`);
      return false;
    }

    if (cached.products.length < this.MIN_PRODUCTS) {
      console.log(`⚠️ Poucos produtos no cache (${cached.products.length}/${this.MIN_PRODUCTS}) - atualizando`);
      return true;
    }

    if (cacheAge > this.CACHE_DURATION) {
      console.log(`⌛ Cache expirado (${Math.round(cacheAge / 60000)}min) - atualizando`);
      return true;
    }

    console.log(`✅ Cache válido com ${cached.products.length} produtos`);
    return false;
  }

  processNewProducts(
    currentProducts: any[],
    cacheKey: string,
    category: string,
    subcategory: string | null
  ): { 
    products: any[], 
    stats: { 
      new: number, 
      updated: number, 
      unchanged: number,
      apiCallsAvoided: number 
    },
    needsMore: boolean
  } {
    const cached = this.cache.get(cacheKey);
    
    // Converte produtos para snapshots COMPLETOS
    const toSnapshot = (p: any): ProductSnapshot => ({
      asin: p.asin,
      title: p.title,
      price: p.price,
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      image: p.image || '',
      affiliateLink: p.affiliateLink || '',
      category: p.category || category,
      prime: p.prime || false,
      timestamp: Date.now(),
      lastChecked: Date.now()
    });
    
    // Converte snapshot para produto
    const toProduct = (snapshot: ProductSnapshot): any => ({
      asin: snapshot.asin,
      title: snapshot.title,
      price: snapshot.price,
      rating: snapshot.rating,
      reviews: snapshot.reviews,
      image: snapshot.image,
      affiliateLink: snapshot.affiliateLink,
      category: snapshot.category,
      prime: snapshot.prime
    });
    
    if (!cached) {
      const snapshots = currentProducts.map(toSnapshot);
      const needsMore = snapshots.length < this.MIN_PRODUCTS;

      this.cache.set(cacheKey, {
        products: snapshots,
        lastUpdate: Date.now(),
        totalFetched: currentProducts.length,
        needsMoreProducts: needsMore
      });

      console.log(`🆕 Cache inicial criado: ${currentProducts.length} produtos`);
      
      if (needsMore) {
        console.log(`⚠️ Precisa de mais produtos: ${currentProducts.length}/${this.MIN_PRODUCTS}`);
      }
      
      return {
        products: currentProducts,
        stats: { new: currentProducts.length, updated: 0, unchanged: 0, apiCallsAvoided: 0 },
        needsMore
      };
    }

    const existingMap = new Map(cached.products.map(p => [p.asin, p]));
    const newProducts: any[] = [];
    const updatedProducts: any[] = [];
    const unchangedProducts: any[] = [];
    let apiCallsAvoided = 0;

    // Processa produtos atuais
    currentProducts.forEach(product => {
      const existing = existingMap.get(product.asin);
      
      if (!existing) {
        newProducts.push(product);
      } else if (this.hasSignificantChange(existing, product)) {
        updatedProducts.push(product);
      } else {
        // Produto sem alteração - usa dados completos do cache
        unchangedProducts.push(toProduct(existing));
        apiCallsAvoided++;
      }
    });

    // Mantém produtos antigos que não vieram na resposta atual (ainda válidos)
    cached.products.forEach(snapshot => {
      if (!currentProducts.find(p => p.asin === snapshot.asin)) {
        unchangedProducts.push(toProduct(snapshot));
      }
    });

    const allProducts = [...newProducts, ...updatedProducts, ...unchangedProducts];
    const needsMore = allProducts.length < this.MIN_PRODUCTS;
    
    // Atualiza cache com snapshots completos
    const updatedSnapshots = allProducts.map(toSnapshot);

    this.cache.set(cacheKey, {
      products: updatedSnapshots,
      lastUpdate: Date.now(),
      totalFetched: cached.totalFetched + newProducts.length,
      needsMoreProducts: needsMore
    });

    console.log(`📊 Estatísticas do cache:`);
    console.log(`   🆕 Novos: ${newProducts.length}`);
    console.log(`   🔄 Atualizados: ${updatedProducts.length}`);
    console.log(`   ✅ Sem alteração: ${unchangedProducts.length}`);
    console.log(`   💰 Requisições economizadas: ${apiCallsAvoided}`);

    return {
      products: allProducts,
      stats: {
        new: newProducts.length,
        updated: updatedProducts.length,
        unchanged: unchangedProducts.length,
        apiCallsAvoided
      },
      needsMore
    };
  }

  needsMoreProducts(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    return cached?.needsMoreProducts || false;
  }

  sortByReviews(products: any[]): any[] {
    return products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  getCachedProducts(cacheKey: string): any[] | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    const cacheAge = Date.now() - cached.lastUpdate;
    if (cacheAge > this.CACHE_DURATION) {
      return null;
    }

    // Retorna produtos COMPLETOS com todos os metadados
    return cached.products.map(snapshot => ({
      asin: snapshot.asin,
      title: snapshot.title,
      price: snapshot.price,
      rating: snapshot.rating,
      reviews: snapshot.reviews,
      image: snapshot.image,
      affiliateLink: snapshot.affiliateLink,
      category: snapshot.category,
      prime: snapshot.prime
    }));
  }

  getProductCount(cacheKey: string): number {
    const cached = this.cache.get(cacheKey);
    return cached?.products.length || 0;
  }

  clearCache(cacheKey?: string) {
    if (cacheKey) {
      this.cache.delete(cacheKey);
      console.log(`🗑️ Cache limpo para: ${cacheKey}`);
    } else {
      this.cache.clear();
      console.log(`🗑️ Todo cache limpo`);
    }
  }

  getCacheStats(): { total: number, categories: string[] } {
    return {
      total: this.cache.size,
      categories: Array.from(this.cache.keys())
    };
  }
}

export const productMonitor = new ProductMonitor();
