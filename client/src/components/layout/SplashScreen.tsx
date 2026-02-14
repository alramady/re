import { useEffect, useState } from 'react';
import { IMAGES } from '@/lib/images';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
         style={{ background: 'linear-gradient(135deg, #0A192F 0%, #112240 50%, #0d1f3c 100%)' }}>
      {/* Glow effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#1e40af]/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#C5A55A]/[0.08] blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Gold line top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-[#C5A55A] to-transparent" />
      
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <img src={IMAGES.logoWhite} alt="راصد" className="h-24 object-contain drop-shadow-lg" />
      </div>
      
      {/* Loading text */}
      <p className="text-[#8892b0] text-sm mb-6">جاري تحميل المنصة...</p>
      
      {/* Progress bar */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-100"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(to left, #C5A55A, #D4AF37)'
          }}
        />
      </div>
      
      <p className="text-[#64748b] text-xs mt-4">{progress}%</p>
      
      {/* Gold line bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-[#C5A55A] to-transparent" />
    </div>
  );
}
