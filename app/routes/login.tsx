import React from 'react';
import AuthLayout from '~/components/auth/AuthLayout';
import LoginForm from '~/components/auth/LoginForm';
import { Link } from '@remix-run/react';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Cognito account"
    >
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-silver">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber hover:text-amber-dark transition-colors font-medium">
            Sign up for free
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
