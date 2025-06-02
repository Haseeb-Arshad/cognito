import { useEffect, useRef } from "react";
import { json, redirect, type MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// Import our custom animation components
import ParticleBackground from "~/components/animations/ParticleBackground";
import MotionElement from "~/components/animations/MotionElement";
import ScrollAnimation from "~/components/animations/ScrollTrigger";
import AnimatedDashboardPreview from '~/components/animations/AnimatedDashboardPreview';

export const meta: MetaFunction = () => {
  return [
    { title: "Cognito - See Tomorrow's Crises & Opportunities, Today" },
    { 
      name: "description", 
      content: "Leverage real-time web intelligence and AI to proactively navigate risks and seize advantages before they unfold." 
    },
  ];
};

// In a real app, we would check if user is authenticated and redirect accordingly
export async function loader() {
  // This would be replaced with real auth check
  const isAuthenticated = false;
  
  // If user is already logged in, redirect to dashboard
  if (isAuthenticated) {
    return redirect("/app/dashboard");
  }
  
  return json({});
}

export default function Index() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // GSAP animation for hero section text reveal
  useEffect(() => {
    if (typeof window === "undefined" || !heroRef.current) return;
    
    const heroElement = heroRef.current;
    const headlineElement = heroElement.querySelector('h1');
    const subheadlineElement = heroElement.querySelector('p');
    const ctaElement = heroElement.querySelector('.cta-container');
    
    if (!headlineElement || !subheadlineElement || !ctaElement) return;
    
    // Split text into words for animation
    const headline = headlineElement.textContent || '';
    const words = headline.split(' ');
    
    // Replace text with spans around each word
    headlineElement.innerHTML = words
      .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block transform">${word}</span></span>`)
      .join(' ');
    
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate each word
    tl.from(
      headlineElement.querySelectorAll('span > span'),
      {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    )
    .from(
      subheadlineElement,
      {
        opacity: 0,
        duration: 0.6,
        y: 20
      },
      "-=0.2"
    )
    .from(
      ctaElement,
      {
        opacity: 0,
        duration: 0.6,
        y: 20
      },
      "-=0.3"
    );
    
    // Check for logged-in user in client-side storage (just for demo)
    const checkAuth = () => {
      const hasSession = localStorage.getItem("cognito_session");
      if (hasSession) {
        navigate("/app/dashboard");
      }
    };
    
    checkAuth();
    
    return () => {
      tl.kill();
    };
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-offwhite overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="absolute top-0 left-0 right-0 z-50 py-6 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2 5h-4v2h4v-2z" />
                  </svg>
                  <span className="ml-3 text-2xl font-bold text-offwhite">Cognito</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login" 
                  className="text-silver hover:text-offwhite transition-colors duration-300"
                >
                  Log in
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/signup" 
                  className="bg-amber hover:bg-amber-dark text-charcoal font-semibold py-2 px-6 rounded-md transition-colors duration-300 shadow-md"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section with Particle Background */}
      <div className="relative min-h-screen flex items-center" ref={heroRef}>
        {/* Particle animation background */}
        <ParticleBackground />
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-32">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-7 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-offwhite leading-loose">
                    <span className="block">Cognito: See <span className="text-amber">Tomorrow's</span> Crises</span>
                    <span className="block">&amp; Opportunities, <span className="text-amber">Today</span>.</span>
                  </h1>
                  <p className="mt-6 text-base text-silver sm:text-xl md:text-2xl leading-relaxed">
                    Leverage real-time web intelligence and AI to proactively navigate risks and seize advantages before they unfold.
                  </p>
                  <div className="mt-10 cta-container">
                    <motion.div 
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        className="bg-amber hover:bg-amber-dark text-charcoal font-semibold py-3 px-8 rounded-md transition-colors duration-300 shadow-md text-lg"
                      >
                        Get Started Free
                      </Link>
                    </motion.div>
                    <motion.div 
                      className="inline-block mt-4 sm:mt-0 sm:ml-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        className="border border-amber text-amber hover:text-amber-dark hover:border-amber-dark font-semibold py-3 px-8 rounded-md transition-colors duration-300 text-lg"
                      >
                        Explore Cognito
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5">
                <motion.div 
                  className="relative mx-auto max-w-md overflow-hidden rounded-xl shadow-2xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                >
                  <div className="w-full h-[420px]">
                    <AnimatedDashboardPreview />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg className="w-6 h-10 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
      
      {/* Problem/Solution Section */}
      <section className="py-24 bg-[#131313]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-offwhite mb-16">
              <span className="text-amber">Intelligent</span> Web Monitoring
            </h2>
          </ScrollAnimation>
          
          {/* Problem Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <ScrollAnimation animation="slideIn" className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber/10 to-amber-dark/5 rounded-xl blur-xl opacity-50"></div>
                <div className="relative bg-[#1A1A1A] p-6 rounded-xl overflow-hidden">
                  <div className="chaotic-data-viz h-72 relative">
                    {/* This would be implemented with a real visualization in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" className="text-silver">
                          {/* Chaotic data visualization - simplified for this example */}
                          <path d="M10,150 Q100,50 200,150 T390,150" />
                          <path d="M10,100 Q150,200 300,100" />
                          <path d="M50,200 Q150,100 250,200" />
                          <path d="M30,100 Q80,20 130,100 T230,100" />
                          <path d="M20,180 Q70,250 120,180 T220,180" />
                        </g>
                        <g className="text-amber" opacity="0.8">
                          <circle cx="50" cy="150" r="4" />
                          <circle cx="120" cy="90" r="4" />
                          <circle cx="200" cy="160" r="4" />
                          <circle cx="280" cy="120" r="4" />
                          <circle cx="350" cy="140" r="4" />
                        </g>
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-60"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1A1A] to-transparent">
                      <div className="flex items-center space-x-2 text-silver">
                        <svg className="h-5 w-5 text-amber" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">Data visualization represents the chaos of unfiltered web information</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideUp" className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-offwhite mb-6">
                The Web is Exploding. <br />
                <span className="text-amber">Can You Keep Up?</span>
              </h3>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Every day, billions of data points are created across the web. News articles, social media posts, forum discussions, regulatory updates, market shifts—all potentially relevant to your business.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                The challenge isn't just volume—it's finding the signal in the noise. Critical information is buried under mountains of irrelevant content, spread across countless sources, and changing constantly.
              </p>
              <div className="mt-8 flex items-center text-amber">
                <div className="h-px flex-1 bg-amber/30 mr-4"></div>
                <span className="font-semibold">Information Overload</span>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* Solution Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation animation="slideUp">
              <h3 className="text-2xl md:text-3xl font-bold text-offwhite mb-6">
                AI Agents: <br />
                <span className="text-amber">Your Eyes and Ears on the Web, 24/7</span>
              </h3>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Cognito deploys intelligent AI agents that continuously scan, monitor, and analyze the web for you. They work autonomously, learning your priorities and focusing on what matters most to your business.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                Our agents don't just collect data—they understand context, identify patterns, and extract meaningful insights, transforming overwhelming information into actionable intelligence.
              </p>
              <div className="mt-8 flex items-center text-amber">
                <div className="h-px flex-1 bg-amber/30 mr-4"></div>
                <span className="font-semibold">Intelligent Filtering</span>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideIn">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber/10 to-amber-dark/5 rounded-xl blur-xl opacity-50"></div>
                <div className="relative bg-[#1A1A1A] p-6 rounded-xl overflow-hidden">
                  <div className="organized-data-viz h-72 relative">
                    {/* This would be implemented with a real visualization in production */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" className="text-silver">
                          <line x1="50" y1="50" x2="50" y2="250" />
                          <line x1="150" y1="50" x2="150" y2="250" />
                          <line x1="250" y1="50" x2="250" y2="250" />
                          <line x1="350" y1="50" x2="350" y2="250" />
                          
                          <line x1="0" y1="75" x2="400" y2="75" />
                          <line x1="0" y1="125" x2="400" y2="125" />
                          <line x1="0" y1="175" x2="400" y2="175" />
                          <line x1="0" y1="225" x2="400" y2="225" />
                        </g>
                        
                        <g className="text-amber" fill="currentColor">
                          <rect x="40" y="100" width="20" height="125" opacity="0.7" />
                          <rect x="140" y="150" width="20" height="75" opacity="0.7" />
                          <rect x="240" y="75" width="20" height="150" opacity="0.7" />
                          <rect x="340" y="125" width="20" height="100" opacity="0.7" />
                        </g>
                        
                        <circle cx="50" cy="75" r="5" className="text-amber" fill="currentColor" />
                        <circle cx="150" cy="125" r="5" className="text-amber" fill="currentColor" />
                        <circle cx="250" cy="50" r="5" className="text-amber" fill="currentColor" />
                        <circle cx="350" cy="100" r="5" className="text-amber" fill="currentColor" />
                        
                        <path d="M50,75 L150,125 L250,50 L350,100" stroke="#FFBF00" strokeWidth="2" fill="none" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-60"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1A1A] to-transparent">
                      <div className="flex items-center space-x-2 text-silver">
                        <svg className="h-5 w-5 text-amber" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">AI agents transform chaos into structured, actionable data</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* Four Pillars - How Cognito Works Section */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-offwhite mb-6">
              How <span className="text-amber">Cognito</span> Works
            </h2>
            <p className="text-silver text-xl text-center max-w-3xl mx-auto mb-20">
              Our AI agents work tirelessly across four integrated processes to deliver intelligence that matters.
            </p>
          </ScrollAnimation>
          
          {/* Pillar 1: Discover */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <ScrollAnimation animation="slideUp">
              <h3 className="text-2xl font-bold text-offwhite mb-4">
                <span className="text-amber">1. Discover</span>
              </h3>
              <h4 className="text-xl font-semibold text-offwhite mb-6">Constant Web Surveillance</h4>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Cognito's AI agents constantly scan thousands of web sources, from news sites and social media to regulatory filings and industry forums.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                Unlike traditional monitoring tools that rely on fixed keywords, our agents understand semantic meaning and context, discovering relevant information even when it doesn't contain your specific search terms.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Continuous monitoring across disparate sources</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Semantic understanding beyond keyword matching</span>
                </li>
              </ul>
            </ScrollAnimation>
            <ScrollAnimation animation="scale" delay={0.3}>
              <div className="relative bg-[#131313] p-6 rounded-xl overflow-hidden shadow-xl border border-amber/10">
                <div className="h-64 relative flex items-center justify-center">
                  <svg className="w-full h-full absolute" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="radar" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FFBF00" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="200" cy="150" r="120" fill="url(#radar)" />
                    
                    <circle cx="200" cy="150" r="30" className="text-amber" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="200" cy="150" r="60" className="text-amber" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                    <circle cx="200" cy="150" r="90" className="text-amber" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                    <circle cx="200" cy="150" r="120" className="text-amber" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5,5" />
                    
                    <g className="text-amber" fill="currentColor">
                      <circle cx="155" cy="90" r="4" opacity="0.7" />
                      <circle cx="260" cy="170" r="4" opacity="0.7" />
                      <circle cx="180" cy="210" r="4" opacity="0.7" />
                      <circle cx="120" cy="150" r="4" opacity="0.7" />
                      <circle cx="250" cy="100" r="4" opacity="0.7" />
                    </g>
                  </svg>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber/10 mb-4">
                      <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h5 className="text-amber font-semibold">Discovery in Action</h5>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* Pillar 2: Access */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <ScrollAnimation animation="scale" delay={0.3} className="order-2 lg:order-1">
              <div className="relative bg-[#131313] p-6 rounded-xl overflow-hidden shadow-xl border border-amber/10">
                <div className="h-64 relative flex items-center justify-center">
                  <svg className="w-full h-full absolute" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#FFBF00" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    
                    <rect x="50" y="80" width="80" height="140" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.3" />
                    <rect x="160" y="60" width="80" height="180" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.3" />
                    <rect x="270" y="100" width="80" height="120" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.3" />
                    
                    <path d="M90,150 C120,80 130,150 200,150 C270,150 280,80 310,150" stroke="#FFBF00" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                    
                    <circle cx="90" cy="150" r="6" fill="#FFBF00" />
                    <circle cx="200" cy="150" r="6" fill="#FFBF00" />
                    <circle cx="310" cy="150" r="6" fill="#FFBF00" />
                  </svg>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber/10 mb-4">
                      <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h5 className="text-amber font-semibold">Access in Action</h5>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideUp" className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-offwhite mb-4">
                <span className="text-amber">2. Access</span>
              </h3>
              <h4 className="text-xl font-semibold text-offwhite mb-6">Breaking Through Barriers</h4>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Once relevant sources are identified, Cognito's agents overcome access challenges that would stop traditional tools—navigating paywalls, registration walls, and complex site structures.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                Our technology can handle dynamic content, JavaScript-rendered pages, and multi-step processes to ensure you never miss critical information due to technical barriers.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Sophisticated techniques to navigate complex web environments</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Persistent retrieval of hard-to-reach information</span>
                </li>
              </ul>
            </ScrollAnimation>
          </div>
          
          {/* Pillar 3: Extract */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <ScrollAnimation animation="slideUp">
              <h3 className="text-2xl font-bold text-offwhite mb-4">
                <span className="text-amber">3. Extract</span>
              </h3>
              <h4 className="text-xl font-semibold text-offwhite mb-6">Intelligent Data Processing</h4>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Cognito's AI doesn't just collect—it comprehends. Our agents extract structured data from unstructured content, identifying entities, relationships, sentiment, and key data points.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                Using advanced NLP and machine learning, our system creates a rich knowledge graph that connects disparate pieces of information into a coherent intelligence picture.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Contextual understanding of complex information</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Transformation of raw data into structured intelligence</span>
                </li>
              </ul>
            </ScrollAnimation>
            <ScrollAnimation animation="scale" delay={0.3}>
              <div className="relative bg-[#131313] p-6 rounded-xl overflow-hidden shadow-xl border border-amber/10">
                <div className="h-64 relative flex items-center justify-center">
                  <svg className="w-full h-full absolute" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="data-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#FFBF00" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    
                    <rect x="50" y="50" width="300" height="80" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.3" />
                    <rect x="100" y="160" width="50" height="80" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.6" />
                    <rect x="175" y="160" width="50" height="80" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.6" />
                    <rect x="250" y="160" width="50" height="80" rx="4" fill="#2C3A47" stroke="#FFBF00" strokeOpacity="0.6" />
                    
                    <line x1="125" y1="130" x2="125" y2="160" stroke="#FFBF00" strokeWidth="2" />
                    <line x1="200" y1="130" x2="200" y2="160" stroke="#FFBF00" strokeWidth="2" />
                    <line x1="275" y1="130" x2="275" y2="160" stroke="#FFBF00" strokeWidth="2" />
                    
                    <line x1="125" y1="130" x2="275" y2="130" stroke="#FFBF00" strokeWidth="2" />
                    
                    <text x="200" y="90" textAnchor="middle" fill="#FFBF00" fontSize="10">Unstructured Content</text>
                    <text x="125" y="200" textAnchor="middle" fill="#FFBF00" fontSize="10">Entities</text>
                    <text x="200" y="200" textAnchor="middle" fill="#FFBF00" fontSize="10">Relations</text>
                    <text x="275" y="200" textAnchor="middle" fill="#FFBF00" fontSize="10">Insights</text>
                  </svg>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber/10 mb-4">
                      <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h5 className="text-amber font-semibold">Extraction in Action</h5>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
          
          {/* Pillar 4: Interact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation animation="scale" delay={0.3} className="order-2 lg:order-1">
              <div className="relative bg-[#131313] p-6 rounded-xl overflow-hidden shadow-xl border border-amber/10">
                <div className="h-64 relative flex items-center justify-center">
                  <svg className="w-full h-full absolute" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="interaction-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFBF00" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#FFBF00" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    
                    <ellipse cx="200" cy="150" rx="120" ry="70" fill="url(#interaction-gradient)" />
                    
                    <circle cx="200" cy="150" r="40" fill="#2C3A47" stroke="#FFBF00" strokeWidth="2" />
                    <text x="200" y="155" textAnchor="middle" fill="#FFBF00" fontSize="12">AI Agent</text>
                    
                    <circle cx="120" cy="100" r="25" fill="#2C3A47" stroke="#FFBF00" strokeWidth="1" />
                    <text x="120" y="105" textAnchor="middle" fill="#FFBF00" fontSize="10">Question</text>
                    
                    <circle cx="120" cy="200" r="25" fill="#2C3A47" stroke="#FFBF00" strokeWidth="1" />
                    <text x="120" y="205" textAnchor="middle" fill="#FFBF00" fontSize="10">Alert</text>
                    
                    <circle cx="280" cy="100" r="25" fill="#2C3A47" stroke="#FFBF00" strokeWidth="1" />
                    <text x="280" y="105" textAnchor="middle" fill="#FFBF00" fontSize="10">Answer</text>
                    
                    <circle cx="280" cy="200" r="25" fill="#2C3A47" stroke="#FFBF00" strokeWidth="1" />
                    <text x="280" y="205" textAnchor="middle" fill="#FFBF00" fontSize="10">Report</text>
                    
                    <line x1="145" y1="100" x2="175" y2="130" stroke="#FFBF00" strokeWidth="1.5" />
                    <line x1="145" y1="200" x2="175" y2="170" stroke="#FFBF00" strokeWidth="1.5" />
                    <line x1="225" y1="130" x2="255" y2="100" stroke="#FFBF00" strokeWidth="1.5" />
                    <line x1="225" y1="170" x2="255" y2="200" stroke="#FFBF00" strokeWidth="1.5" />
                  </svg>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber/10 mb-4">
                      <svg className="h-10 w-10 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h5 className="text-amber font-semibold">Interaction in Action</h5>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideUp" className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-offwhite mb-4">
                <span className="text-amber">4. Interact</span>
              </h3>
              <h4 className="text-xl font-semibold text-offwhite mb-6">Natural AI Collaboration</h4>
              <p className="text-silver text-lg mb-6 leading-relaxed">
                Cognito transforms your relationship with information through natural language interaction. Ask questions, request analysis, and collaborate with AI agents to explore insights deeper.
              </p>
              <p className="text-silver text-lg leading-relaxed">
                Our agents don't just deliver data—they provide explanations, suggest connections, and help you understand the implications, creating a true intelligence partner for your business.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">Natural language queries and responses</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-silver">AI-powered analysis that explains implications</span>
                </li>
              </ul>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-[#131313]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-offwhite mb-6">
              Key <span className="text-amber">Features</span> & Benefits
            </h2>
            <p className="text-silver text-xl text-center max-w-3xl mx-auto mb-20">
              Powerful capabilities that transform how you monitor and respond to web intelligence.
            </p>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <ScrollAnimation animation="slideUp" delay={0.1}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Real-Time Alerts</h3>
                <p className="text-silver">
                  Receive instant notifications when critical information emerges. Configure alerts based on keywords, entities, sentiment, or complex logical conditions.
                </p>
              </div>
            </ScrollAnimation>
            
            {/* Feature 2 */}
            <ScrollAnimation animation="slideUp" delay={0.2}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Predictive Insights</h3>
                <p className="text-silver">
                  Leverage AI to identify emerging trends and patterns before they become obvious. Stay ahead of market shifts, potential PR issues, and competitive movements.
                </p>
              </div>
            </ScrollAnimation>
            
            {/* Feature 3 */}
            <ScrollAnimation animation="slideUp" delay={0.3}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Customizable Monitoring</h3>
                <p className="text-silver">
                  Create personalized monitoring workflows tailored to your specific business needs. Monitor competitors, industry news, regulatory changes, and more.
                </p>
              </div>
            </ScrollAnimation>
            
            {/* Feature 4 */}
            <ScrollAnimation animation="slideUp" delay={0.4}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Natural Language Interface</h3>
                <p className="text-silver">
                  Interact with Cognito using conversational language. Ask questions, request analyses, and explore insights without needing to learn complex query languages.
                </p>
              </div>
            </ScrollAnimation>
            
            {/* Feature 5 */}
            <ScrollAnimation animation="slideUp" delay={0.5}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Visual Analytics</h3>
                <p className="text-silver">
                  Transform complex data into intuitive visualizations. Track trends, monitor sentiment, and visualize connections between entities and events.
                </p>
              </div>
            </ScrollAnimation>
            
            {/* Feature 6 */}
            <ScrollAnimation animation="slideUp" delay={0.6}>
              <div className="bg-[#1A1A1A] p-8 rounded-xl h-full border border-amber/10 hover:border-amber/30 transition-colors duration-300 shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/10 mb-6">
                  <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-offwhite mb-4">Seamless Integrations</h3>
                <p className="text-silver">
                  Connect Cognito with your existing tools and workflows. Integrate with Slack, Teams, Jira, email, and more to ensure insights reach the right people.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FFBF00" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation animation="fadeIn">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-offwhite mb-8 leading-relaxed">
                Ready to <span className="text-amber">Illuminate</span> Your Path?
              </h1>
              <p className="text-silver text-xl mb-10 leading-relaxed">
                Join organizations that use Cognito to transform web intelligence into strategic advantage.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div 
                  className="w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth/signup"
                    className="w-full sm:w-auto bg-amber hover:bg-amber-dark text-charcoal font-semibold py-4 px-8 rounded-md transition-colors duration-300 shadow-xl text-lg inline-block"
                  >
                    Start Free Trial
                  </Link>
                </motion.div>
                
                <motion.div 
                  className="w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/contact"
                    className="w-full sm:w-auto border-2 border-amber text-amber hover:bg-amber/10 font-semibold py-4 px-8 rounded-md transition-colors duration-300 text-lg inline-block"
                  >
                    Schedule a Demo
                  </Link>
                </motion.div>
              </div>
            </div>
          </ScrollAnimation>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation animation="slideUp" delay={0.1}>
              <div className="bg-[#1A1A1A]/60 backdrop-blur-sm p-8 rounded-xl border border-amber/10 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber/10 mr-4">
                    <svg className="h-6 w-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-offwhite">Enterprise Security</h3>
                </div>
                <p className="text-silver">
                  Bank-level encryption, SOC 2 compliance, and role-based access controls keep your data secure.
                </p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="slideUp" delay={0.2}>
              <div className="bg-[#1A1A1A]/60 backdrop-blur-sm p-8 rounded-xl border border-amber/10 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber/10 mr-4">
                    <svg className="h-6 w-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-offwhite">Fast Implementation</h3>
                </div>
                <p className="text-silver">
                  Deploy within days, not months. Our team handles the setup, training, and integration.
                </p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="slideUp" delay={0.3}>
              <div className="bg-[#1A1A1A]/60 backdrop-blur-sm p-8 rounded-xl border border-amber/10 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber/10 mr-4">
                    <svg className="h-6 w-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-offwhite">Dedicated Support</h3>
                </div>
                <p className="text-silver">
                  Expert assistance available 24/7. We're committed to your success with personalized support.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#131313] py-16 border-t border-amber/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <svg className="h-8 w-8 text-amber" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2 5h-4v2h4v-2z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-offwhite">Cognito</span>
              </div>
              <p className="text-silver mb-6">
                See tomorrow's crises and opportunities, today. AI-powered web intelligence for forward-thinking organizations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-silver hover:text-amber transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-silver hover:text-amber transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-silver hover:text-amber transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-offwhite mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Features</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Use Cases</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Security</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-offwhite mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Community</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Case Studies</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-offwhite mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-silver hover:text-amber transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-amber/5 text-center">
            <p className="text-silver text-sm">
              &copy; {new Date().getFullYear()} Cognito AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
