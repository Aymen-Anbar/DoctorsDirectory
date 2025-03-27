/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move this to the root level
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Keep other experimental options if needed
  experimental: {
    // Any other experimental options would go here
  },
  
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;