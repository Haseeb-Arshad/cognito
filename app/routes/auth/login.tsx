import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { json, ActionFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Login | Cognito" },
    { name: "description", content: "Login to Cognito monitoring platform" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  // In a real app, this would validate credentials against a database
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Simulate successful login (in a real app, this would verify credentials)
  if (email && password) {
    return json({ success: true });
  }
  
  return json({ 
    success: false, 
    error: "Invalid email or password. Please try again." 
  });
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // In a real app, this would call the action and handle authentication
      // Simulating auth for now
      if (email && password) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulated delay
        navigate("/dashboard");
      } else {
        setError("Please enter both email and password.");
      }
    } catch (err) {
      setError("Authentication failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite dark:bg-charcoal p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2 5h-4v2h4v-2z" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-charcoal dark:text-offwhite">Cognito</span>
          </div>
        </div>
        
        {/* Login Card */}
        <div className="card shadow-card p-8">
          <h1 className="text-xl font-bold text-center text-charcoal dark:text-offwhite mb-6">
            Log in to your account
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-md text-sm text-warning">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-graphite dark:text-silver">
                  Password
                </label>
                <Link 
                  to="/auth/forgot-password"
                  className="text-xs text-amber hover:text-amber-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-amber focus:ring-amber-dark border-steel rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-graphite dark:text-silver">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-graphite dark:text-silver">
            Don't have an account?{' '}
            <Link 
              to="/auth/register"
              className="text-amber hover:text-amber-dark font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
