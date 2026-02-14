import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  tilt?: boolean;
  glow?: boolean;
  delay?: number;
}

export default function GlassCard({ children, className, onClick, tilt = false, glow = false, delay = 0 }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.05, ease: [0.4, 0, 0.2, 1] }}
      style={{ transform: tilt ? transform : undefined, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        'glass-card p-5 relative overflow-hidden',
        glow && 'pulse-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
