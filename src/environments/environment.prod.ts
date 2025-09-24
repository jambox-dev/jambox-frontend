export const environment = {
  production: true,
  
  // Security Configuration
  security: {
    // Content Security Policy
    csp: {
      defaultSrc: "'self'",
      styleSrc: "'self'",
      scriptSrc: "'self'",
      imgSrc: "'self' data: https:",
      connectSrc: "'self'",
      fontSrc: "'self'",
      objectSrc: "'none'",
      mediaSrc: "'self'",
      frameSrc: "'none'",
    },
    
    // Security headers
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },

  // API Configuration
  api: {
    baseUrl: '/api',
    timeout: 10000,
    retries: 3
  },

  // Feature flags
  features: {
    enableLogging: false,
    enableAnalytics: true,
    enableDebugMode: false
  },

  // Validation limits
  limits: {
    maxSearchLength: 100,
    maxUsernameLength: 50,
    minPasswordLength: 8,  // Stronger password requirement in production
    maxQueueSize: 50,
    requestTimeout: 30000
  }
};