import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Wifi, Clock, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const metrics = [
  { label: 'وقت الاستجابة', value: '45ms', status: 'good', icon: Clock, color: '#22C55E' },
  { label: 'استخدام المعالج', value: '34%', status: 'good', icon: Cpu, color: '#3B82F6' },
  { label: 'استخدام الذاكرة', value: '67%', status: 'warning', icon: HardDrive, color: '#F97316' },
  { label: 'حالة الشبكة', value: '99.9%', status: 'good', icon: Wifi, color: '#22C55E' },
];

const logs = [
  { time: '14:32:15', level: 'info', message: 'تم تحديث مؤشرات الامتثال بنجاح', source: 'compliance-engine' },
  { time: '14:31:42', level: 'warning', message: 'ارتفاع في استخدام الذاكرة - خادم التحليلات', source: 'monitoring' },
  { time: '14:30:18', level: 'info', message: 'اكتمال مسح البيانات الدوري', source: 'data-scanner' },
  { time: '14:28:55', level: 'error', message: 'فشل الاتصال بخدمة API الخارجية - إعادة المحاولة', source: 'api-gateway' },
  { time: '14:27:30', level: 'info', message: 'تسجيل دخول ناجح - م. محمد الرحيلي', source: 'auth-service' },
  { time: '14:25:12', level: 'info', message: 'تم إنشاء تقرير الامتثال الشهري', source: 'report-engine' },
  { time: '14:22:45', level: 'warning', message: 'محاولة وصول مشبوهة من IP خارجي', source: 'security' },
];

const levelConfig: Record<string, { color: string; bg: string }> = {
  info: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  warning: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' },
  error: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export default function ObservabilityPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#C5A55A]" />
            لوحة المراقبة
          </h2>
          <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            مباشر
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric, i) => (
            <GlassCard key={metric.label} delay={i} tilt>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                {metric.status === 'good' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-[#0A192F] dark:text-white">{metric.value}</p>
              <p className="text-xs text-[#0A192F]/40 dark:text-white/40">{metric.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Live Logs */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C5A55A]" />
              سجل الأحداث المباشر
            </h3>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, i) => {
              const level = levelConfig[log.level];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0A192F]/2 dark:hover:bg-white/2 transition-colors"
                >
                  <span className="text-[#0A192F]/30 dark:text-white/30 w-16 flex-shrink-0">{log.time}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium w-16 text-center" style={{ color: level.color, background: level.bg }}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-[#0A192F] dark:text-white flex-1">{log.message}</span>
                  <span className="text-[#0A192F]/20 dark:text-white/20 text-[10px]">{log.source}</span>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
