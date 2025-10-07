export interface AmazonMarketplace {
  id: string;
  name: string;
  domain: string;
  affiliateTag: string;
  language: string;
  currency: string;
  flagCode: string;
  flagUrl: string;
}

// Amazon Associates - Tag única para TODOS os países via OneLink
// OneLink detecta automaticamente o país do visitante e redireciona mantendo a comissão
// Saiba mais: https://affiliate-program.amazon.com/help/node/topic/G2L3ZBRGXTS7EMEY
export const AMAZON_MARKETPLACES: AmazonMarketplace[] = [
  {
    id: 'US',
    name: 'United States',
    domain: 'amazon.com',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'USD',
    flagCode: 'us',
    flagUrl: 'https://flagcdn.com/w80/us.png'
  },
  {
    id: 'CA',
    name: 'Canada',
    domain: 'amazon.ca',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'CAD',
    flagCode: 'ca',
    flagUrl: 'https://flagcdn.com/w80/ca.png'
  },
  {
    id: 'UK',
    name: 'United Kingdom',
    domain: 'amazon.co.uk',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'GBP',
    flagCode: 'gb',
    flagUrl: 'https://flagcdn.com/w80/gb.png'
  },
  {
    id: 'DE',
    name: 'Germany',
    domain: 'amazon.de',
    affiliateTag: 'globalsupleme-20',
    language: 'de',
    currency: 'EUR',
    flagCode: 'de',
    flagUrl: 'https://flagcdn.com/w80/de.png'
  },
  {
    id: 'FR',
    name: 'France',
    domain: 'amazon.fr',
    affiliateTag: 'globalsupleme-20',
    language: 'fr',
    currency: 'EUR',
    flagCode: 'fr',
    flagUrl: 'https://flagcdn.com/w80/fr.png'
  },
  {
    id: 'IT',
    name: 'Italy',
    domain: 'amazon.it',
    affiliateTag: 'globalsupleme-20',
    language: 'it',
    currency: 'EUR',
    flagCode: 'it',
    flagUrl: 'https://flagcdn.com/w80/it.png'
  },
  {
    id: 'ES',
    name: 'Spain',
    domain: 'amazon.es',
    affiliateTag: 'globalsupleme-20',
    language: 'es',
    currency: 'EUR',
    flagCode: 'es',
    flagUrl: 'https://flagcdn.com/w80/es.png'
  },
  {
    id: 'JP',
    name: 'Japan',
    domain: 'amazon.co.jp',
    affiliateTag: 'globalsupleme-20',
    language: 'ja',
    currency: 'JPY',
    flagCode: 'jp',
    flagUrl: 'https://flagcdn.com/w80/jp.png'
  },
  {
    id: 'AU',
    name: 'Australia',
    domain: 'amazon.com.au',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'AUD',
    flagCode: 'au',
    flagUrl: 'https://flagcdn.com/w80/au.png'
  },
  {
    id: 'NL',
    name: 'Netherlands',
    domain: 'amazon.nl',
    affiliateTag: 'globalsupleme-20',
    language: 'nl',
    currency: 'EUR',
    flagCode: 'nl',
    flagUrl: 'https://flagcdn.com/w80/nl.png'
  },
  {
    id: 'SE',
    name: 'Sweden',
    domain: 'amazon.se',
    affiliateTag: 'globalsupleme-20',
    language: 'sv',
    currency: 'SEK',
    flagCode: 'se',
    flagUrl: 'https://flagcdn.com/w80/se.png'
  },
  {
    id: 'SG',
    name: 'Singapore',
    domain: 'amazon.sg',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'SGD',
    flagCode: 'sg',
    flagUrl: 'https://flagcdn.com/w80/sg.png'
  },
  {
    id: 'PL',
    name: 'Poland',
    domain: 'amazon.pl',
    affiliateTag: 'globalsupleme-20',
    language: 'en',
    currency: 'PLN',
    flagCode: 'pl',
    flagUrl: 'https://flagcdn.com/w80/pl.png'
  },
  {
    id: 'SA',
    name: 'Saudi Arabia',
    domain: 'amazon.sa',
    affiliateTag: 'globalsupleme-20',
    language: 'ar',
    currency: 'SAR',
    flagCode: 'sa',
    flagUrl: 'https://flagcdn.com/w80/sa.png'
  }
];

export const getMarketplaceById = (id: string): AmazonMarketplace => {
  return AMAZON_MARKETPLACES.find(m => m.id === id) || AMAZON_MARKETPLACES[0];
};

export const getAffiliateLink = (asin: string, marketplace: AmazonMarketplace): string => {
  return `https://www.${marketplace.domain}/dp/${asin}?tag=${marketplace.affiliateTag}`;
};
