import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Ultra Glass Card with 3D Frame
 * ─────────────────────────────
 * Design Tokens (sampled from reference):
 *   blue:      gradient(#6B7388 → #394B6C → #25385B) border:#556586
 *   maroon:    gradient(#6D697B → #533A4E → #442A43) border:#5E677C
 *   green:     gradient(#355E52 → #264C47 → #123E39) border:#2E3C5C
 *   purple:    gradient(#434678 → #2B2F5A → #232A56) border:#373866
 *   dmaroon:   gradient(#4B2A4E → #40284D → #362349) border:#43233B
 *   neutral:   gradient(#5B5676 → #4C4663 → #3B3D56) border:#4F5D7D
 *   default:   glass overlay on base
 *
 * 3D Effects:
 *   - Multi-layer box-shadow (ambient + lift)
 *   - Inner shadow (inset) for depth
 *   - Rim light (top highlight)
 *   - Border gradient with gold tint
 *   - Hover: lift + glow
 *   - Active: press
 */

export type CardVariant = 'blue' | 'maroon' | 'green' | 'purple' | 'dmaroon' | 'neutral' | 'default';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  tilt?: boolean;
  glow?: boolean;
  delay?: number;
  variant?: CardVariant;
  noPadding?: boolean;
}

const variantStyles: Record<CardVariant, {
  bg: string;
  border: string;
  shadow: string;
  innerShadow: string;
  rimLight: string;
  hoverShadow: string;
}> = {
  blue: {
    bg: 'linear-gradient(160deg, rgba(107,115,136,0.85) 0%, rgba(97,114,146,0.75) 25%, rgba(57,75,108,0.85) 60%, rgba(37,56,91,0.95) 100%)',
    border: '1px solid rgba(103,158,205,0.25)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(37,56,91,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(37,56,91,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(37,56,91,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  maroon: {
    bg: 'linear-gradient(160deg, rgba(109,105,123,0.85) 0%, rgba(117,89,109,0.75) 25%, rgba(83,58,78,0.85) 60%, rgba(68,42,67,0.95) 100%)',
    border: '1px solid rgba(117,89,109,0.3)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(68,42,67,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(68,42,67,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(68,42,67,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  green: {
    bg: 'linear-gradient(160deg, rgba(53,94,82,0.85) 0%, rgba(48,88,78,0.80) 35%, rgba(38,76,71,0.88) 65%, rgba(18,62,57,0.95) 100%)',
    border: '1px solid rgba(75,145,105,0.25)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(18,62,57,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(18,62,57,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(18,62,57,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  purple: {
    bg: 'linear-gradient(160deg, rgba(67,70,120,0.85) 0%, rgba(55,56,102,0.80) 35%, rgba(43,47,90,0.88) 65%, rgba(35,42,86,0.95) 100%)',
    border: '1px solid rgba(67,70,120,0.3)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(35,42,86,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(35,42,86,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(35,42,86,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  dmaroon: {
    bg: 'linear-gradient(160deg, rgba(75,42,78,0.85) 0%, rgba(73,42,78,0.80) 35%, rgba(64,40,77,0.88) 65%, rgba(54,35,73,0.95) 100%)',
    border: '1px solid rgba(75,42,78,0.3)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(54,35,73,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(54,35,73,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(54,35,73,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  neutral: {
    bg: 'linear-gradient(160deg, rgba(91,86,118,0.80) 0%, rgba(76,70,99,0.78) 40%, rgba(59,61,86,0.85) 70%, rgba(49,53,82,0.92) 100%)',
    border: '1px solid rgba(79,93,125,0.25)',
    shadow: '0 4px 16px rgba(0,0,0,0.35), 0 8px 32px rgba(49,53,82,0.25), 0 1px 3px rgba(0,0,0,0.2)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(49,53,82,0.3)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.4), 0 12px 40px rgba(49,53,82,0.3), 0 1px 3px rgba(0,0,0,0.2)',
  },
  default: {
    bg: 'linear-gradient(160deg, rgba(14,26,47,0.55) 0%, rgba(14,26,47,0.65) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 4px 16px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.15)',
    innerShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 8px rgba(0,0,0,0.15)',
    rimLight: 'inset 0 1px 0 rgba(255,255,255,0.08)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.35), 0 12px 40px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)',
  },
};

export default function GlassCard({
  children,
  className,
  onClick,
  tilt = false,
  glow = false,
  delay = 0,
  variant = 'default',
  noPadding = false,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);
  const style = variantStyles[variant];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!tilt) return;
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.05, ease: [0.4, 0, 0.2, 1] }}
      style={{
        transform: tilt ? transform : undefined,
        transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
        background: style.bg,
        border: style.border,
        boxShadow: `${isHovered ? style.hoverShadow : style.shadow}, ${style.innerShadow}, ${style.rimLight}`,
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        borderRadius: '16px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden',
        !noPadding && 'p-5',
        glow && 'ultra-glass-glow',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      {/* Top rim light highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 30%, rgba(242,164,78,0.12) 50%, rgba(255,255,255,0.15) 70%, transparent 90%)',
        }}
      />
      {/* Gold accent border glow at top */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent 20%, rgba(242,164,78,0.3) 50%, transparent 80%)',
          filter: 'blur(1px)',
        }}
      />
      {children}
    </motion.div>
  );
}
