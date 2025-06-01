import React from 'react';
import AuthLayout from '~/components/auth/AuthLayout';
import SignupForm from '~/components/auth/SignupForm';
import { Link } from '@remix-run/react';

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join Cognito and start exploring AI-powered analytics"
    >
      <div className="w-full max-w-md mx-auto">
        <SignupForm />
        
        <div className="mt-6 text-center text-sm text-silver">
          Already have an account?{' '}
          <Link to="/login" className="text-amber hover:text-amber-dark transition-colors font-medium">
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
