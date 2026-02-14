import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Globe, Palette, Database, Key, Save, Moon, Sun } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const settingSections = [
  {
    title: 'الإشعارات',
    icon: Bell,
    settings: [
      { label: 'إشعارات الحوادث الحرجة', enabled: true },
      { label: 'تنبيهات الامتثال', enabled: true },
      { label: 'تحديثات النظام', enabled: false },
      { label: 'تقارير دورية', enabled: true },
    ]
  },
  {
    title: 'الأمان',
    icon: Shield,
    settings: [
      { label: 'المصادقة الثنائية', enabled: true },
      { label: 'تسجيل الجلسات', enabled: true },
      { label: 'قفل تلقائي بعد 15 دقيقة', enabled: false },
    ]
  },
  {
    title: 'البيانات',
    icon: Database,
    settings: [
      { label: 'النسخ الاحتياطي التلقائي', enabled: true },
      { label: 'تشفير البيانات المحلية', enabled: true },
      { label: 'مزامنة سحابية', enabled: false },
    ]
  },
];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#F2A44E]" />
            الإعدادات
          </h2>
          <button
            onClick={() => toast.success('تم حفظ الإعدادات')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #F2A44E, #D4AF37)' }}
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
        </div>

        {/* Theme Toggle */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2A44E]/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#F2A44E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">المظهر</h3>
                <p className="text-[10px] text-white/40">تبديل بين الوضع الفاتح والداكن</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F2A44E]" /> : <Moon className="w-4 h-4 text-white" />}
              <span className="text-xs text-white">{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
            </button>
          </div>
        </GlassCard>

        {/* Setting Sections */}
        <div className="space-y-6">
          {settingSections.map((section, si) => (
            <GlassCard key={section.title} delay={si}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white/60" />
                </div>
                <h3 className="text-base font-bold text-white">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.settings.map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/2">
                    <span className="text-sm text-white">{setting.label}</span>
                    <button
                      className={`w-11 h-6 rounded-full transition-colors relative ${setting.enabled ? 'bg-[#F2A44E]' : 'bg-white/15'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${setting.enabled ? 'left-1' : 'right-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
