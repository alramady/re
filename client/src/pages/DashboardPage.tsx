import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Activity, Eye, FileText, Users, Building2, Globe, Lock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { IMAGES } from '@/lib/images';

const stats = [
  { label: 'مستوى الامتثال الوطني', value: '78.5%', change: '+3.2%', trend: 'up', icon: Shield, color: '#4CAF50' },
  { label: 'الحوادث النشطة', value: '12', change: '-2', trend: 'down', icon: AlertTriangle, color: '#FF9800' },
  { label: 'الجهات الممتثلة', value: '156', change: '+8', trend: 'up', icon: CheckCircle, color: '#2196F3' },
  { label: 'طلبات أصحاب البيانات', value: '2,847', change: '+124', trend: 'up', icon: Users, color: '#C5A55A' },
];

const sectors = [
  { name: 'القطاع الصحي', compliance: 82, incidents: 3, entities: 45, color: '#4CAF50' },
  { name: 'القطاع المالي', compliance: 91, incidents: 1, entities: 38, color: '#2196F3' },
  { name: 'القطاع التعليمي', compliance: 74, incidents: 4, entities: 62, color: '#FF9800' },
  { name: 'القطاع الحكومي', compliance: 88, incidents: 2, entities: 120, color: '#9C27B0' },
  { name: 'قطاع الاتصالات', compliance: 85, incidents: 2, entities: 28, color: '#00BCD4' },
  { name: 'قطاع التجزئة', compliance: 69, incidents: 5, entities: 95, color: '#FF5722' },
];

const recentIncidents = [
  { id: 'INC-2026-0142', title: 'تسريب بيانات مرضى - مستشفى المملكة', severity: 'critical', sector: 'صحي', date: '14 فبراير 2026' },
  { id: 'INC-2026-0141', title: 'وصول غير مصرح لقاعدة بيانات العملاء', severity: 'high', sector: 'مالي', date: '13 فبراير 2026' },
  { id: 'INC-2026-0140', title: 'مشاركة بيانات طلاب بدون موافقة', severity: 'medium', sector: 'تعليمي', date: '12 فبراير 2026' },
  { id: 'INC-2026-0139', title: 'خلل في نظام إدارة الموافقات', severity: 'low', sector: 'حكومي', date: '11 فبراير 2026' },
];

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'حرج', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  high: { label: 'عالي', color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' },
  medium: { label: 'متوسط', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)' },
  low: { label: 'منخفض', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
};

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <GlassCard key={stat.label} delay={i} tilt>
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-[#0A192F] dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs text-[#0A192F]/40 dark:text-white/40">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Sector Compliance */}
        <div className="xl:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C5A55A]" />
                امتثال القطاعات
              </h3>
              <span className="text-[10px] text-[#0A192F]/30 dark:text-white/30">آخر تحديث: اليوم</span>
            </div>
            <div className="space-y-4">
              {sectors.map((sector) => (
                <div key={sector.name} className="flex items-center gap-4">
                  <span className="text-sm text-[#0A192F] dark:text-white w-32 flex-shrink-0">{sector.name}</span>
                  <div className="flex-1 h-3 bg-[#0A192F]/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.compliance}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to left, ${sector.color}, ${sector.color}80)` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#0A192F] dark:text-white w-12 text-left">{sector.compliance}%</span>
                  <div className="flex items-center gap-1 text-[10px] text-[#0A192F]/40 dark:text-white/40 w-20">
                    <AlertTriangle className="w-3 h-3" />
                    {sector.incidents} حوادث
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* National Compliance Gauge */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#C5A55A]" />
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white">مؤشر الامتثال الوطني</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(10,25,47,0.05)" strokeWidth="12" className="dark:stroke-white/5" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" stroke="#C5A55A" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${78.5 * 3.267} ${326.7 - 78.5 * 3.267}`}
                  initial={{ strokeDasharray: '0 326.7' }}
                  animate={{ strokeDasharray: `${78.5 * 3.267} ${326.7 - 78.5 * 3.267}` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0A192F] dark:text-white">78.5%</span>
                <span className="text-[10px] text-[#C5A55A]">ممتاز</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 rounded-xl bg-[#0A192F]/3 dark:bg-white/3">
                <p className="text-lg font-bold text-[#0A192F] dark:text-white">156</p>
                <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">جهة ممتثلة</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[#0A192F]/3 dark:bg-white/3">
                <p className="text-lg font-bold text-[#0A192F] dark:text-white">44</p>
                <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">جهة غير ممتثلة</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Incidents */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF9800]" />
            آخر الحوادث
          </h3>
          <button className="text-xs text-[#C5A55A] hover:underline">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0A192F]/5 dark:border-white/5">
                <th className="text-right py-3 px-2 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">رقم الحادثة</th>
                <th className="text-right py-3 px-2 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">الوصف</th>
                <th className="text-right py-3 px-2 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">الخطورة</th>
                <th className="text-right py-3 px-2 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">القطاع</th>
                <th className="text-right py-3 px-2 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((incident) => {
                const sev = severityConfig[incident.severity];
                return (
                  <tr key={incident.id} className="border-b border-[#0A192F]/3 dark:border-white/3 hover:bg-[#0A192F]/2 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-[#C5A55A]">{incident.id}</td>
                    <td className="py-3 px-2 text-[#0A192F] dark:text-white">{incident.title}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium" style={{ color: sev.color, background: sev.bg }}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#0A192F]/60 dark:text-white/60">{incident.sector}</td>
                    <td className="py-3 px-2 text-[#0A192F]/40 dark:text-white/40 text-xs">{incident.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
