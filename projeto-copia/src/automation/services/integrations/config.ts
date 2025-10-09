export const integrationConfig = {
  isProduction: () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname !== 'localhost' && 
             !window.location.hostname.includes('repl');
    }
    return process.env.NODE_ENV === 'production';
  },

  hasBufferCredentials: () => {
    return !!(process.env.BUFFER_ACCESS_TOKEN || 
             (typeof window !== 'undefined' && (window as any).BUFFER_ACCESS_TOKEN));
  },

  hasSendGridCredentials: () => {
    return !!(process.env.SENDGRID_API_KEY || 
             (typeof window !== 'undefined' && (window as any).SENDGRID_API_KEY));
  },

  hasGSCCredentials: () => {
    return !!(process.env.GSC_CREDENTIALS || 
             (typeof window !== 'undefined' && (window as any).GSC_CREDENTIALS));
  },

  isDemoMode: () => {
    return process.env.DEMO_MODE === 'true' || 
           (typeof window !== 'undefined' && (window as any).DEMO_MODE === 'true');
  }
};
