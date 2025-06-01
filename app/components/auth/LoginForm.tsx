import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, useNavigate } from '@remix-run/react';
import { isValidEmail } from '~/utils/validation';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });

  // Validate form fields on change
  useEffect(() => {
    const errors: { email?: string; password?: string } = {};
    
    if (touched.email) {
      if (!email) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email';
      }
    }
    
    if (touched.password) {
      if (!password) {
        errors.password = 'Password is required';
      } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
    }
    
    setFormErrors(errors);
  }, [email, password, touched]);

  // Handle field blur
  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set all fields as touched to trigger validation
    setTouched({ email: true, password: true });
    
    // Check for validation errors
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setFormErrors({});
    
    // Simulate API call
    setTimeout(() => {
      // Success scenario - in a real app we would handle real authentication
      const success = Math.random() > 0.3; // 70% chance of success for demo
      
      if (success) {
        // Store fake auth token in localStorage for demo purposes
        localStorage.setItem('cognito_session', 'demo_session_token');
        navigate('/dashboard');
      } else {
        // Show error message
        setFormErrors({ general: 'Invalid email or password. Please try again.' });
        setIsLoading(false);
      }
    }, 1500);
  };

  // Variants for form element animations
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + (i * 0.1),
        duration: 0.4
      }
    })
  };

  return (
    <Form method="post" onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      {/* Display general error message if any */}
      <AnimatePresence>
        {formErrors.general && (
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-md mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {formErrors.general}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="space-y-2"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="relative">
          <motion.label 
            htmlFor="email" 
            className={`absolute text-sm ${email ? (formErrors.email ? 'text-red-500 -top-6' : 'text-amber -top-6') : 'text-silver top-3 left-3'} transition-all duration-200`}
            animate={{ 
              top: email ? '-1.5rem' : '0.75rem',
              color: email ? (formErrors.email ? '#EF4444' : '#FFBF00') : '#C0C0C0',
              scale: email ? 0.85 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            Email Address
          </motion.label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full bg-[#252525] border-b-2 ${formErrors.email ? 'border-red-500' : 'border-silver focus:border-amber'} px-3 py-3 text-offwhite rounded-t-md outline-none transition-colors`}
            required
          />
          {email && !formErrors.email && (
            <motion.span 
              className="absolute right-3 top-3 text-green-500"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.span>
          )}
          {formErrors.email && touched.email && (
            <motion.p 
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formErrors.email}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div 
        className="space-y-2"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="relative">
          <motion.label 
            htmlFor="password" 
            className={`absolute text-sm ${password ? (formErrors.password ? 'text-red-500 -top-6' : 'text-amber -top-6') : 'text-silver top-3 left-3'} transition-all duration-200`}
            animate={{ 
              top: password ? '-1.5rem' : '0.75rem',
              color: password ? (formErrors.password ? '#EF4444' : '#FFBF00') : '#C0C0C0',
              scale: password ? 0.85 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            Password
          </motion.label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`w-full bg-[#252525] border-b-2 ${formErrors.password ? 'border-red-500' : 'border-silver focus:border-amber'} px-3 py-3 text-offwhite rounded-t-md outline-none transition-colors`}
            required
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-silver hover:text-amber transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </motion.button>
          {formErrors.password && touched.password && (
            <motion.p 
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formErrors.password}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Remember Me and Forgot Password */}
      <motion.div 
        className="flex justify-between items-center text-sm"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={rememberMe} 
            onChange={() => setRememberMe(!rememberMe)} 
            className="sr-only"
          />
          <motion.div 
            className={`w-4 h-4 mr-2 border ${rememberMe ? 'bg-amber border-amber' : 'border-silver'} rounded flex items-center justify-center`}
            whileTap={{ scale: 0.9 }}
          >
            {rememberMe && (
              <motion.svg 
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="w-3 h-3 text-charcoal" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
            )}
          </motion.div>
          <span className="text-silver select-none">Remember me</span>
        </label>
        <motion.a 
          href="#" 
          className="text-amber hover:text-amber-dark transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot password?
        </motion.a>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <motion.button
          type="submit"
          className="w-full bg-amber hover:bg-amber-dark text-charcoal font-semibold py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              className="w-6 h-6 border-2 border-charcoal border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          ) : (
            "Sign In"
          )}
        </motion.button>
      </motion.div>

      {/* Social Login Buttons */}
      <motion.div
        className="pt-4"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <div className="relative flex items-center justify-center">
          <div className="h-px bg-gray-600 w-full"></div>
          <div className="absolute bg-[#1A1A1A] px-4 text-sm text-silver">or continue with</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <motion.button
            type="button"
            className="flex items-center justify-center bg-[#252525] hover:bg-[#303030] py-2.5 px-4 rounded-md transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </motion.button>
          
          <motion.button
            type="button"
            className="flex items-center justify-center bg-[#252525] hover:bg-[#303030] py-2.5 px-4 rounded-md transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </motion.button>
        </div>
      </motion.div>
    </Form>
  );
};

export default LoginForm;
