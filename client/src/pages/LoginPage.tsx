import { useState, useEffect } from 'react';
import { IMAGES } from '@/lib/images';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { Eye, EyeOff, Lock, User, Shield, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading: authLoading } = useLocalAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(userId.trim(), password);
      if (!result.success) {
        setError(result.error || 'فشل تسجيل الدخول');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" dir="rtl" style={{ fontFamily: "'Tajawal', 'Inter', sans-serif" }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0d1f3c]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#1e40af]/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#C5A55A]/[0.08] blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#64FFDA]/[0.05] blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 w-full max-w-[1100px] mx-4 flex rounded-3xl overflow-hidden transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ 
          minHeight: '600px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-[#0A192F] to-[#1a2744] flex-col items-center justify-center p-12 overflow-hidden">
          {/* Gold accent line top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-[#C5A55A] to-transparent" />
          
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 border border-[#C5A55A]/30 rounded-full" />
            <div className="absolute bottom-20 left-10 w-48 h-48 border border-[#C5A55A]/20 rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-20 h-20 border border-[#64FFDA]/20 rounded-lg rotate-45" />
          </div>

          {/* Logo */}
          <div className={`mb-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <img src={IMAGES.logoWhite} alt="راصد" className="h-20 object-contain drop-shadow-lg" />
          </div>

          {/* 3D Character */}
          <div className={`relative mb-8 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="absolute inset-0 bg-[#C5A55A]/10 rounded-full blur-3xl" />
            <img 
              src={IMAGES.charStanding} 
              alt="شخصية راصد" 
              className="relative h-[280px] object-contain"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(197, 165, 90, 0.2))' }}
            />
          </div>

          {/* Text */}
          <div className={`text-center transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-2xl font-bold text-white mb-3">مكتب إدارة البيانات الوطنية</h2>
            <p className="text-[#8892b0] text-sm leading-relaxed max-w-sm">
              منصة راصد الذكية لإدارة البيانات الوطنية والامتثال لنظام حماية البيانات الشخصية
            </p>
          </div>

          {/* Bottom badges */}
          <div className={`mt-8 flex gap-4 transition-all duration-700 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Shield className="w-4 h-4 text-[#64FFDA]" />
              <span className="text-xs text-[#8892b0]">نظام آمن</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Lock className="w-4 h-4 text-[#C5A55A]" />
              <span className="text-xs text-[#8892b0]">تشفير متقدم</span>
            </div>
          </div>

          {/* Gold accent line bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-[#C5A55A] to-transparent" />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-[45%] bg-white dark:bg-[#0A192F] flex flex-col justify-center p-8 lg:p-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={IMAGES.logoDark} alt="راصد" className="h-16 object-contain" />
          </div>

          {/* Header */}
          <div className={`mb-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-2xl font-bold text-[#0A192F] dark:text-white mb-2">تسجيل الدخول</h1>
            <p className="text-[#64748b] dark:text-[#8892b0] text-sm">أدخل بيانات الاعتماد للوصول إلى لوحة التحكم</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" style={{ animation: 'loginSlideIn 300ms ease-out' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#8892b0] mb-2">اسم المستخدم</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setError(''); }}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full h-12 pr-12 pl-4 rounded-xl border-2 border-[#e2e8f0] bg-[#f8fafc] text-[#0A192F] placeholder:text-[#94a3b8] focus:border-[#1e40af] focus:bg-white dark:bg-[#0A192F] dark:border-white/10 dark:text-white dark:focus:border-[#C5A55A] focus:ring-4 focus:ring-[#1e40af]/10 dark:focus:ring-[#C5A55A]/10 transition-all duration-200 outline-none text-sm"
                  autoComplete="username"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password field */}
            <div className={`transition-all duration-700 delay-[600ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#8892b0] mb-2">كلمة المرور</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="أدخل كلمة المرور"
                  className="w-full h-12 pr-12 pl-12 rounded-xl border-2 border-[#e2e8f0] bg-[#f8fafc] text-[#0A192F] placeholder:text-[#94a3b8] focus:border-[#1e40af] focus:bg-white dark:bg-[#0A192F] dark:border-white/10 dark:text-white dark:focus:border-[#C5A55A] focus:ring-4 focus:ring-[#1e40af]/10 dark:focus:ring-[#C5A55A]/10 transition-all duration-200 outline-none text-sm"
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1e40af] dark:hover:text-[#C5A55A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className={`pt-2 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-[#0A192F] to-[#1e3a8a] text-white font-semibold text-sm hover:from-[#112240] hover:to-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ boxShadow: '0 4px 14px rgba(10, 25, 47, 0.3)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className={`mt-8 pt-6 border-t border-[#e2e8f0] dark:border-white/10 transition-all duration-700 delay-[900ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={IMAGES.logoMain} alt="راصد" className="h-6 object-contain opacity-60" />
              <div className="w-px h-4 bg-[#e2e8f0] dark:bg-white/10" />
              <img src={IMAGES.logoOffice} alt="مكتب إدارة البيانات" className="h-6 object-contain opacity-60" />
            </div>
            <p className="text-center text-xs text-[#94a3b8]">
              منصة راصد الذكية · مكتب إدارة البيانات الوطنية
            </p>
            <p className="text-center text-xs text-[#94a3b8] mt-1">
              © {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loginSlideIn {
          from { opacity: 0; transform: translateY(-0.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
