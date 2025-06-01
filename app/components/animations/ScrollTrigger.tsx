import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale" | "stagger";
  delay?: number;
  duration?: number;
  threshold?: number; // 0 to 1, when to start the animation
  className?: string;
}

export default function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.8,
  threshold = 0.4,
  className = "",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const element = ref.current;
    if (!element) return;
    
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: `top ${threshold * 100}%`,
        toggleActions: "play none none none",
      },
    });

    // Set initial state
    gsap.set(element, { 
      opacity: animation !== "stagger" ? 0 : 1,
      y: animation === "slideUp" ? 50 : 0,
      x: animation === "slideIn" ? -50 : 0,
      scale: animation === "scale" ? 0.9 : 1,
    });

    // Create animation based on type
    switch (animation) {
      case "fadeIn":
        tl.to(element, { opacity: 1, duration, delay });
        break;
      case "slideUp":
        tl.to(element, { opacity: 1, y: 0, duration, delay, ease: "power2.out" });
        break;
      case "slideIn":
        tl.to(element, { opacity: 1, x: 0, duration, delay, ease: "power2.out" });
        break;
      case "scale":
        tl.to(element, { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.5)" });
        break;
      case "stagger":
        if (element.children.length > 0) {
          gsap.set([...element.children], { opacity: 0, y: 20 });
          tl.to([...element.children], { 
            opacity: 1, 
            y: 0, 
            duration: duration * 0.7, 
            stagger: 0.1, 
            delay, 
            ease: "power2.out" 
          });
        }
        break;
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animation, delay, duration, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
