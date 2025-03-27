'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const checkAndRedirect = useCallback(async () => {
    try {
      // Detailed logging
      console.log('Checking session...');

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Log session details
      console.log('Session data:', session);
      console.log('Session error:', sessionError);

      // Get admin email from environment
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      console.log('Configured admin email:', adminEmail);

      // Check if there's an active session
      if (session) {
        console.log('Active session found');
        console.log('Current user email:', session.user?.email);

        // Check if the logged-in user is the admin
        if (session.user?.email === adminEmail) {
          console.log('Admin user confirmed, redirecting to admin page');
          router.push('/admin/doctors');
          return true;
        } else {
          console.log('Non-admin user, signing out');
          await supabase.auth.signOut();
        }
      }

      return false;
    } catch (err) {
      console.error('Session check error:', err);
      return false;
    }
  }, [router, supabase]);

  useEffect(() => {
    checkAndRedirect();
  }, [checkAndRedirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    try {
      console.log('Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Login response:', { data, error });

      if (error) {
        throw error;
      }

      // Verify admin status
      if (data.user?.email === adminEmail) {
        console.log('Admin login successful');
        router.push('/admin/doctors');
      } else {
        console.log('Non-admin user login attempted');
        await supabase.auth.signOut();
        setError('Access denied. Admin credentials required.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}