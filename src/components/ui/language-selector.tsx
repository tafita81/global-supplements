import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

// Import flag images
import usFlag from '@/assets/flags/us.svg';
import brFlag from '@/assets/flags/br.svg';
import esFlag from '@/assets/flags/es.svg';
import frFlag from '@/assets/flags/fr.svg';
import deFlag from '@/assets/flags/de.svg';
import itFlag from '@/assets/flags/it.svg';
import jpFlag from '@/assets/flags/jp.svg';
import krFlag from '@/assets/flags/kr.svg';
import cnFlag from '@/assets/flags/cn.svg';
import saFlag from '@/assets/flags/sa.svg';
import aeFlag from '@/assets/flags/ae.svg';
import qaFlag from '@/assets/flags/qa.svg';
import kwFlag from '@/assets/flags/kw.svg';
import bhFlag from '@/assets/flags/bh.svg';
import omFlag from '@/assets/flags/om.svg';
import gbFlag from '@/assets/flags/gb.svg';
import caFlag from '@/assets/flags/ca.svg';
import auFlag from '@/assets/flags/au.svg';
import chFlag from '@/assets/flags/ch.svg';
import nlFlag from '@/assets/flags/nl.svg';
import seFlag from '@/assets/flags/se.svg';
import sgFlag from '@/assets/flags/sg.svg';
import twFlag from '@/assets/flags/tw.svg';
import mxFlag from '@/assets/flags/mx.svg';
import arFlag from '@/assets/flags/ar.svg';
import inFlag from '@/assets/flags/in.svg';
import myFlag from '@/assets/flags/my.svg';
import clFlag from '@/assets/flags/cl.svg';
import coFlag from '@/assets/flags/co.svg';
import peFlag from '@/assets/flags/pe.svg';
import ptFlag from '@/assets/flags/pt.svg';
import paFlag from '@/assets/flags/pa.svg';
import pyFlag from '@/assets/flags/py.svg';

const languages = {
  // English variants
  en: { name: 'US English', nativeName: 'US English', flag: usFlag },
  'en-GB': { name: 'UK English', nativeName: 'UK English', flag: gbFlag },
  'en-CA': { name: 'Canadian English', nativeName: 'Canadian English', flag: caFlag },
  'en-AU': { name: 'Australian English', nativeName: 'Australian English', flag: auFlag },
  
  // Spanish variants
  'es-US': { name: 'US Español', nativeName: 'US Español', flag: usFlag },
  es: { name: 'Spanish', nativeName: 'Español', flag: esFlag },
  'es-MX': { name: 'Mexican Spanish', nativeName: 'Español Mexicano', flag: mxFlag },
  'es-AR': { name: 'Argentinian Spanish', nativeName: 'Español Argentino', flag: arFlag },
  'es-CL': { name: 'Chilean Spanish', nativeName: 'Español Chileno', flag: clFlag },
  'es-CO': { name: 'Colombian Spanish', nativeName: 'Español Colombiano', flag: coFlag },
  'es-PE': { name: 'Peruvian Spanish', nativeName: 'Español Peruano', flag: peFlag },
  'es-PA': { name: 'Panamanian Spanish', nativeName: 'Español Panameño', flag: paFlag },
  'es-PY': { name: 'Paraguayan Spanish', nativeName: 'Español Paraguayo', flag: pyFlag },
  
  // Portuguese variants
  pt: { name: 'Portuguese', nativeName: 'Português', flag: brFlag },
  'pt-PT': { name: 'European Portuguese', nativeName: 'Português Europeu', flag: ptFlag },
  
  // French variants
  fr: { name: 'French', nativeName: 'Français', flag: frFlag },
  'fr-CA': { name: 'Canadian French', nativeName: 'Français Canadien', flag: caFlag },
  'fr-CH': { name: 'Swiss French', nativeName: 'Français Suisse', flag: chFlag },
  
  // German variants
  de: { name: 'German', nativeName: 'Deutsch', flag: deFlag },
  'de-CH': { name: 'Swiss German', nativeName: 'Schweizerdeutsch', flag: chFlag },
  
  // Other European languages
  it: { name: 'Italian', nativeName: 'Italiano', flag: itFlag },
  'nl': { name: 'Dutch', nativeName: 'Nederlands', flag: nlFlag },
  'sv': { name: 'Swedish', nativeName: 'Svenska', flag: seFlag },
  
  // Asian languages
  ja: { name: 'Japanese', nativeName: '日本語', flag: jpFlag },
  ko: { name: 'Korean', nativeName: '한국어', flag: krFlag },
  zh: { name: 'Chinese Simplified', nativeName: '中文 (简体)', flag: cnFlag },
  'zh-TW': { name: 'Chinese Traditional', nativeName: '中文 (繁體)', flag: twFlag },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: inFlag },
  'ms': { name: 'Malay', nativeName: 'Bahasa Melayu', flag: myFlag },
  
  // Arabic variants
  ar: { name: 'Arabic', nativeName: 'العربية', flag: saFlag },
  'ar-AE': { name: 'UAE Arabic', nativeName: 'العربية الإماراتية', flag: aeFlag },
  'ar-QA': { name: 'Qatari Arabic', nativeName: 'العربية القطرية', flag: qaFlag },
  'ar-KW': { name: 'Kuwaiti Arabic', nativeName: 'العربية الكويتية', flag: kwFlag },
  'ar-BH': { name: 'Bahraini Arabic', nativeName: 'العربية البحرينية', flag: bhFlag },
  'ar-OM': { name: 'Omani Arabic', nativeName: 'العربية العمانية', flag: omFlag },
} as const;

export function LanguageSelector() {
  const { i18n } = useTranslation();
  // Map the current language back to display the proper language option
  const getCurrentLanguageDisplay = () => {
    const currentLang = i18n.language;
    // Find if any complex language code maps to the current simple code
    const reverseMapping: Record<string, string[]> = {
      'en': ['en', 'en-GB', 'en-CA', 'en-AU'],
      'es': ['es', 'es-US', 'es-MX', 'es-AR', 'es-CL', 'es-CO', 'es-PE', 'es-PA', 'es-PY'],
      'pt': ['pt', 'pt-PT'],
      'fr': ['fr', 'fr-CA', 'fr-CH'],
      'de': ['de', 'de-CH'],
      'ar': ['ar', 'ar-AE', 'ar-QA', 'ar-KW', 'ar-BH', 'ar-OM']
    };
    
    // Check if we have a stored preference for complex codes
    const storedLanguage = localStorage.getItem('selectedLanguageCode');
    if (storedLanguage && languages[storedLanguage as keyof typeof languages]) {
      const storedLangData = languages[storedLanguage as keyof typeof languages];
      if (reverseMapping[currentLang]?.includes(storedLanguage)) {
        return storedLangData;
      }
    }
    
    return languages[currentLang as keyof typeof languages] || languages.en;
  };
  
  const currentLang = getCurrentLanguageDisplay();

  const changeLanguage = (languageCode: string) => {
    // Store the full language code for display purposes
    localStorage.setItem('selectedLanguageCode', languageCode);
    
    // Map complex language codes to simple ones that exist in translations
    const languageMap: Record<string, string> = {
      'en-GB': 'en',
      'en-CA': 'en', 
      'en-AU': 'en',
      'es-MX': 'es',
      'es-AR': 'es',
      'es-CL': 'es',
      'es-CO': 'es',
      'es-PE': 'es',
      'es-PA': 'es',
      'es-PY': 'es',
      'pt-PT': 'pt',
      'fr-CA': 'fr',
      'fr-CH': 'fr',
      'de-CH': 'de',
      'ar-AE': 'ar',
      'ar-QA': 'ar',
      'ar-KW': 'ar',
      'ar-BH': 'ar',
      'ar-OM': 'ar'
    };
    
    const targetLanguage = languageMap[languageCode] || languageCode;
    i18n.changeLanguage(targetLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-3 gap-2 text-sm bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
        >
          <img 
            src={currentLang.flag} 
            alt={currentLang.name}
            className="w-5 h-4 object-cover rounded-sm border border-border/20"
          />
          <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-sm border border-border/50"
        sideOffset={4}
      >
        {Object.entries(languages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50 ${
              (localStorage.getItem('selectedLanguageCode') === code) || 
              (i18n.language === code && !localStorage.getItem('selectedLanguageCode')) ? 'bg-muted/30' : ''
            }`}
          >
            <img 
              src={lang.flag} 
              alt={lang.name}
              className="w-6 h-4 object-cover rounded-sm border border-border/20 flex-shrink-0"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium truncate">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground truncate">{lang.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
