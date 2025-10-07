// ⚡ INSTANT CACHE - Sistema de cache ultra-rápido com LocalStorage
// Prioriza velocidade máxima: sempre mostra cache primeiro, atualiza depois

interface CachedProducts {
  products: any[];
  timestamp: number;
  marketplace: string;
  category: string;
  subcategory: string | null;
}

class InstantCache {
  private readonly CACHE_KEY_PREFIX = 'amazon_products_';
  private readonly CACHE_MAX_AGE = 1 * 60 * 60 * 1000; // 1 hora

  private getCacheKey(marketplace: string, category: string, subcategory: string | null): string {
    return `${this.CACHE_KEY_PREFIX}${marketplace}_${category}_${subcategory || 'all'}`;
  }

  // ⚡ INSTANT: Retorna cache IMEDIATAMENTE se existir (mesmo se expirado)
  getInstant(marketplace: string, category: string, subcategory: string | null): any[] | null {
    try {
      const key = this.getCacheKey(marketplace, category, subcategory);
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;
      
      const data: CachedProducts = JSON.parse(cached);
      
      // Retorna SEMPRE, mesmo se expirado (usuário vê produtos instantaneamente)
      console.log(`⚡ INSTANT CACHE HIT: ${data.products.length} produtos (${Math.round((Date.now() - data.timestamp) / 1000)}s atrás)`);
      return data.products;
    } catch (error) {
      console.error('❌ Erro ao ler cache:', error);
      return null;
    }
  }

  // Verifica se cache está fresco (< 1 hora)
  isFresh(marketplace: string, category: string, subcategory: string | null): boolean {
    try {
      const key = this.getCacheKey(marketplace, category, subcategory);
      const cached = localStorage.getItem(key);
      
      if (!cached) return false;
      
      const data: CachedProducts = JSON.parse(cached);
      const age = Date.now() - data.timestamp;
      
      return age < this.CACHE_MAX_AGE;
    } catch {
      return false;
    }
  }

  // Salva produtos no cache
  save(marketplace: string, category: string, subcategory: string | null, products: any[]): void {
    try {
      const key = this.getCacheKey(marketplace, category, subcategory);
      const data: CachedProducts = {
        products,
        timestamp: Date.now(),
        marketplace,
        category,
        subcategory
      };
      
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`💾 Cache salvo: ${products.length} produtos para ${key}`);
    } catch (error) {
      console.error('❌ Erro ao salvar cache:', error);
      // Se localStorage está cheio, limpa caches antigos
      this.cleanup();
    }
  }

  // Limpa caches antigos (> 24 horas)
  cleanup(): void {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_KEY_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            const data: CachedProducts = JSON.parse(cached);
            const age = now - data.timestamp;
            
            // Remove se > 24 horas
            if (age > 24 * 60 * 60 * 1000) {
              keysToRemove.push(key);
            }
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Cache cleanup: ${keysToRemove.length} itens antigos removidos`);
    } catch (error) {
      console.error('❌ Erro no cleanup:', error);
    }
  }

  // Limpa todo o cache de produtos
  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🗑️ Cache limpo: ${keysToRemove.length} itens removidos`);
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }
}

export const instantCache = new InstantCache();
