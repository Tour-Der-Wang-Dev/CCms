import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        } else if (data.session) {
          setSuccess(true);
          // Redirect will be handled by Navigate component
        } else {
          setError('No session found. Please try signing in again.');
        }
      } catch (err) {
        setError('An unexpected error occurred during authentication.');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-sage mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900">
            Completing authentication...
          </h2>
          <p className="text-neutral-600 mt-2">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Authentication Error
        </h2>
        <p className="text-neutral-600 mb-6">
          {error || 'There was a problem completing your authentication.'}
        </p>
        <a
          href="/login"
          className="inline-block bg-sage text-white py-3 px-6 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  );
}
