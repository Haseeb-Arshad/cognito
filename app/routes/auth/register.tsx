import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { json, ActionFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up | Cognito" },
    { name: "description", content: "Create a new account on Cognito monitoring platform" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  // In a real app, this would store user details in a database
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Simulate successful registration
  if (name && email && password) {
    return json({ success: true });
  }
  
  return json({ 
    success: false, 
    error: "Please fill in all required fields." 
  });
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call the action and create a user account
      // Simulating registration for now
      if (name && email && password) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulated delay
        navigate("/dashboard");
      } else {
        setError("Please fill in all required fields.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
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
        
        {/* Registration Card */}
        <div className="card shadow-card p-8">
          <h1 className="text-xl font-bold text-center text-charcoal dark:text-offwhite mb-6">
            Create your account
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-md text-sm text-warning">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-graphite dark:text-silver">
                At least 8 characters with a mix of letters, numbers, and symbols
              </p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-graphite dark:text-silver mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-amber focus:ring-amber-dark border-steel rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-graphite dark:text-silver">
                I agree to the <Link to="/terms" className="text-amber hover:text-amber-dark">Terms of Service</Link> and <Link to="/privacy" className="text-amber hover:text-amber-dark">Privacy Policy</Link>
              </label>
            </div>
            
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-graphite dark:text-silver">
            Already have an account?{' '}
            <Link 
              to="/auth/login"
              className="text-amber hover:text-amber-dark font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
