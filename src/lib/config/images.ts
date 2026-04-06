// Image configuration for ChaseDue landing page
// Using placeholder paths that work with Next.js Image component

export const images = {
  // Hero section images
  hero: {
    invoice: '/images/hero-invoice.svg',
    dashboard: '/images/hero-dashboard.svg',
    mobile: '/images/hero-mobile.svg'
  },
  
  // Feature icons
  features: {
    invoicing: '/icons/invoicing.svg',
    whatsapp: '/icons/whatsapp.svg',
    analytics: '/icons/analytics.svg',
    gst: '/icons/gst.svg'
  },
  
  // Brand assets
  brand: {
    logo: '/logo.svg',
    favicon: '/favicon.ico',
    ogImage: '/og-image.jpg'
  },
  
  // Social proof
  social: {
    testimonials: '/images/testimonials.jpg',
    team: '/images/team.jpg'
  }
}

// Fallback placeholder for missing images
export const placeholderImage = '/images/placeholder.svg'

// Helper function to get image with fallback
export function getImage(path: string) {
  return path || placeholderImage
}
