import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Enhanced security headers
    const metaTags = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'SAMEORIGIN' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'X-Permitted-Cross-Domain-Policies', content: 'none' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
      { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' },
      { 
        name: 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.openai.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://bfhfnwgyifjexqciktsa.supabase.co wss://bfhfnwgyifjexqciktsa.supabase.co https://api.openai.com; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
      },
      {
        name: 'Strict-Transport-Security',
        content: 'max-age=31536000; includeSubDomains; preload'
      }
    ];

    metaTags.forEach(({ name, content }) => {
      let existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        existing = document.createElement('meta');
        existing.setAttribute('name', name);
        document.head.appendChild(existing);
      }
      existing.setAttribute('content', content);
    });

    // Set Permissions Policy via meta tag
    const permissionsPolicy = document.querySelector('meta[http-equiv="Permissions-Policy"]');
    if (!permissionsPolicy) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Permissions-Policy');
      meta.setAttribute('content', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
      document.head.appendChild(meta);
    }
  }, []);

  return null;
};