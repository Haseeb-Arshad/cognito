import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

type AnimationType = "fadeIn" | "slideUp" | "slideIn" | "pop" | "none";

interface MotionElementProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  viewport?: { once?: boolean; amount?: number };
  custom?: any;
  as?: React.ElementType;
}

const animations: Record<AnimationType, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: i * 0.1 }
    })
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: i * 0.1,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  },
  slideIn: {
    hidden: { opacity: 0, x: -50 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.5, 
        delay: i * 0.1,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  },
  pop: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  },
  none: {
    hidden: {},
    visible: {}
  }
};

export default function MotionElement({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
  viewport = { once: true, amount: 0.3 },
  custom = 0,
  as = "div"
}: MotionElementProps) {
  const Component = motion[as as keyof typeof motion] || motion.div;
  
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={animations[animation]}
      custom={custom + delay}
      transition={{ 
        duration: duration,
        ease: [0.215, 0.61, 0.355, 1] 
      }}
    >
      {children}
    </Component>
  );
}
