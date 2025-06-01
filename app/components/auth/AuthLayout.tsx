import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@remix-run/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Branding Side - Left side on desktop, top on mobile */}
      <motion.div 
        className="w-full md:w-1/2 bg-[#131313] flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Abstract animated background elements */}
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={20 + i * 15}
                cy={20 + i * 12}
                r={5 + i * 3}
                fill="none"
                stroke="#FFBF00"
                strokeWidth="0.2"
                strokeOpacity={0.3 - i * 0.05}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.2, 0.8], 
                  opacity: [0.1, 0.3, 0.1],
                  strokeDashoffset: [0, 100]
                }}
                transition={{ 
                  duration: 8 + i, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Subtle grid lines */}
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0"
                y1={i * 12.5}
                x2="100"
                y2={i * 12.5}
                stroke="#FFBF00"
                strokeWidth="0.1"
                strokeOpacity={0.1}
                initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, delay: 0.5 + i * 0.2, ease: "easeOut" }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={i * 12.5}
                y1="0"
                x2={i * 12.5}
                y2="100"
                stroke="#FFBF00"
                strokeWidth="0.1"
                strokeOpacity={0.1}
                initial={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 3, delay: 0.5 + i * 0.2, ease: "easeOut" }}
              />
            ))}
          </svg>
        </div>
        
        {/* Branding Content */}
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/" className="inline-block">
              <div className="h-12 w-12 bg-amber rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-charcoal">C</span>
              </div>
            </Link>
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-offwhite mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-amber">Cognito</span> Intelligence
          </motion.h1>
          
          <motion.p
            className="text-silver mb-8 leading-relaxed"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.div
            className="relative h-40 md:h-64 mb-8 w-full max-w-sm mx-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {/* Abstract visualization representing intelligence data */}
            <svg className="w-full h-full" viewBox="0 0 300 200">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFBF00" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Main connections graph */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {/* Central node */}
                <motion.circle 
                  cx="150" 
                  cy="100" 
                  r="12" 
                  fill="#FFBF00" 
                  animate={{ 
                    r: [12, 14, 12],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Connected nodes with animated appearance */}
                {[
                  { x: 80, y: 60, r: 6 },
                  { x: 100, y: 150, r: 8 },
                  { x: 200, y: 80, r: 7 },
                  { x: 220, y: 140, r: 5 },
                  { x: 60, y: 120, r: 4 },
                  { x: 230, y: 50, r: 5 },
                ].map((node, i) => (
                  <React.Fragment key={i}>
                    {/* Connection line */}
                    <motion.line
                      x1="150"
                      y1="100"
                      x2={node.x}
                      y2={node.y}
                      stroke="#FFBF00"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                    />
                    
                    {/* Node */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill="#FFBF00"
                      fillOpacity="0.6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                    />
                    
                    {/* Pulse effect */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill="none"
                      stroke="#FFBF00"
                      strokeWidth="1"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ 
                        duration: 1.5,
                        delay: 1.2 + i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2 + i
                      }}
                    />
                  </React.Fragment>
                ))}
              </motion.g>
              
              {/* Data Flow Animation */}
              {[...Array(3)].map((_, i) => (
                <motion.circle
                  key={`data-${i}`}
                  cx="0"
                  cy="0"
                  r="2"
                  fill="#FFBF00"
                  initial={{ pathOffset: i * 0.3 }}
                  animate={{ pathOffset: 1 }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "linear"
                  }}
                  style={{ 
                    offsetPath: "path('M150,100 C100,60 80,140 200,80 C260,40 150,150 150,100')",
                    offsetRotate: "0deg"
                  }}
                />
              ))}
            </svg>
          </motion.div>
          
          <motion.div
            className="text-silver text-sm hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            Trusted by leading organizations worldwide
          </motion.div>
        </div>
      </motion.div>
      
      {/* Form Side - Right side on desktop, bottom on mobile */}
      <motion.div 
        className="w-full md:w-1/2 bg-[#1A1A1A] flex justify-center items-center p-6 md:p-12"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="w-full max-w-md">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-offwhite mb-2">
              {title}
            </h2>
            {/* Replaced with empty div - link to alternate auth page now handled in child components */}
            <div></div>
          </div>
          
          {children}
          
          <div className="mt-8 text-center md:text-left">
            <p className="text-silver text-xs">
              By using Cognito, you agree to our <a href="#" className="text-amber hover:underline">Terms of Service</a> and <a href="#" className="text-amber hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
