import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Users, Building2, Globe, BookOpen, Heart, Landmark, Briefcase, HandHeart, GraduationCap } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

/**
 * Dashboard Design Tokens (sampled from reference):
 *   Blue card:    #6B7388 → #394B6C → #25385B
 *   Maroon card:  #6D697B → #533A4E → #442A43
 *   Green card:   #355E52 → #264C47 → #123E39
 *   Purple card:  #434678 → #2B2F5A → #232A56
 *   DMaroon card: #4B2A4E → #40284D → #362349
 *   Neutral card: #5B5676 → #4C4663 → #3B3D56
 *   Gold accent:  #F2A44E
 *   Chart green:  #4B9169
 *   Chart orange: #E69745
 */

const topStats = [
  { label: 'مستوى الامتثال الوطني', value: '78.5%', change: '+3.2%', trend: 'up' as const, icon: Shield, color: '#4B9169' },
  { label: 'الحوادث النشطة', value: '12', change: '-2', trend: 'down' as const, icon: AlertTriangle, color: '#E69745' },
  { label: 'الجهات الممتثلة', value: '156', change: '+8', trend: 'up' as const, icon: CheckCircle, color: '#679ECD' },
  { label: 'طلبات أصحاب البيانات', value: '2,847', change: '+124', trend: 'up' as const, icon: Users, color: '#F2A44E' },
];

const websiteCategories = [
  { label: 'المواقع التعليمية', value: '1,050', compliant: 85, connected: 30, icon: BookOpen, variant: 'blue' as const, iconBg: 'rgba(97,114,146,0.4)', iconColor: '#a8c4e6' },
  { label: 'المواقع الصحية', value: '850', compliant: 65, connected: 35, icon: Heart, variant: 'maroon' as const, iconBg: 'rgba(200,80,80,0.3)', iconColor: '#e88888' },
  { label: 'المواقع غير الربحية', value: '650', compliant: 40, connected: 10, icon: HandHeart, variant: 'purple' as const, iconBg: 'rgba(130,120,200,0.3)', iconColor: '#b0a8e8' },
  { label: 'المواقع التنموية', value: '850', compliant: 65, connected: 30, icon: GraduationCap, variant: 'dmaroon' as const, iconBg: 'rgba(180,80,100,0.3)', iconColor: '#d89898' },
];

const sectors = [
  { name: 'القطاع الصحي', compliance: 82, incidents: 3, entities: 45, color: '#4B9169' },
  { name: 'القطاع المالي', compliance: 91, incidents: 1, entities: 38, color: '#679ECD' },
  { name: 'القطاع التعليمي', compliance: 74, incidents: 4, entities: 62, color: '#E69745' },
  { name: 'القطاع الحكومي', compliance: 88, incidents: 2, entities: 120, color: '#434678' },
  { name: 'قطاع الاتصالات', compliance: 85, incidents: 2, entities: 28, color: '#4B9169' },
  { name: 'قطاع التجزئة', compliance: 69, incidents: 5, entities: 95, color: '#CC893E' },
];

const recentIncidents = [
  { id: 'INC-2026-0142', title: 'تسريب بيانات مرضى - مستشفى المملكة', severity: 'critical', sector: 'صحي', date: '14 فبراير 2026' },
  { id: 'INC-2026-0141', title: 'وصول غير مصرح لقاعدة بيانات العملاء', severity: 'high', sector: 'مالي', date: '13 فبراير 2026' },
  { id: 'INC-2026-0140', title: 'مشاركة بيانات طلاب بدون موافقة', severity: 'medium', sector: 'تعليمي', date: '12 فبراير 2026' },
  { id: 'INC-2026-0139', title: 'خلل في نظام إدارة الموافقات', severity: 'low', sector: 'حكومي', date: '11 فبراير 2026' },
];

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'حرج', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  high: { label: 'عالي', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  medium: { label: 'متوسط', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
  low: { label: 'منخفض', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.15)' },
};

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6 space-y-6">
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-2"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'linear-gradient(135deg, rgba(14,26,47,0.6) 0%, rgba(14,26,47,0.4) 100%)',
            border: '1px solid rgba(242,164,78,0.25)',
            color: '#F2A44E',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F2A44E] animate-pulse" />
          أتشفلت الفة النجارية
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-center mb-6"
        style={{ color: '#F2A44E', fontFamily: 'Tajawal, sans-serif' }}
      >
        فوشرات المواقع
      </motion.h2>

      {/* Top Row: Total + Category Cards + Chart */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left: Total Saudi Websites */}
        <div className="col-span-12 xl:col-span-3">
          <GlassCard variant="neutral" tilt delay={0}>
            <div className="text-center py-4">
              <p className="text-sm text-white/60 mb-2">عدد المواقع السعودي</p>
              <p className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>7,950</p>
            </div>
          </GlassCard>

          {/* Government Websites Card */}
          <div className="mt-4">
            <GlassCard variant="green" tilt delay={1}>
              <div className="py-2">
                <p className="text-sm text-white/80 font-medium mb-3">المواقع الحكومية</p>
                <div className="flex items-center gap-6 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-white">85</span>
                    <CheckCircle className="w-4 h-4 text-[#4B9169]" />
                    <span className="text-xs text-white/50">غير ممتثل</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-white">50 %</span>
                    <span className="text-xs text-white/50">متصل</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 mb-3">يتمسكك بتدان لئوصول حالة الامتثال</p>
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white/80 transition-all hover:text-white"
                  style={{
                    background: 'rgba(75,145,105,0.3)',
                    border: '1px solid rgba(75,145,105,0.4)',
                  }}
                >
                  تفاصيل
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Center: Category Cards Grid */}
        <div className="col-span-12 xl:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            {websiteCategories.map((cat, i) => (
              <GlassCard key={cat.label} variant={cat.variant} tilt delay={i + 2}>
                <div className="flex flex-col items-center text-center py-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: cat.iconBg }}
                  >
                    <cat.icon className="w-7 h-7" style={{ color: cat.iconColor }} />
                  </div>
                  <p className="text-sm text-white/80 font-medium mb-2">{cat.label}</p>
                  <p className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{cat.value}</p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{cat.compliant} % <span className="text-white/30">ممتثل</span></span>
                    <span>{cat.connected} % <span className="text-white/30">متصل</span></span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right: Compliance + Chart */}
        <div className="col-span-12 xl:col-span-4">
          <GlassCard variant="neutral" tilt delay={6}>
            <div className="py-2">
              <p className="text-sm text-white/60 mb-1">امتثال</p>
              <p className="text-4xl font-bold mb-6" style={{ color: '#F2A44E', fontFamily: 'Inter, sans-serif' }}>1,750</p>

              {/* Mini chart visualization */}
              <div className="flex items-end gap-3 h-32 mb-4">
                {/* Green tall bar */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-white/70 font-medium">5,500</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-full rounded-t-lg"
                    style={{ background: 'linear-gradient(to top, #2d6b4a, #4B9169)' }}
                  />
                </div>
                {/* Stacked bar */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-white/70 font-medium">78 %</span>
                  <div className="w-full h-full flex flex-col rounded-t-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '40%' }}
                      transition={{ duration: 1, delay: 0.7 }}
                      style={{ background: '#4B9169' }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '35%' }}
                      transition={{ duration: 1, delay: 0.9 }}
                      style={{ background: '#E69745' }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '25%' }}
                      transition={{ duration: 1, delay: 1.1 }}
                      style={{ background: '#CC893E' }}
                    />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-white/50">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4B9169]" />
                  <span>ممتثل</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40">امتثال جزئي</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#E69745]" />
                  <span>امتثالي</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {topStats.map((stat, i) => (
          <GlassCard key={stat.label} delay={i + 8} tilt>
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-[#4B9169]' : 'text-[#CC893E]'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.value}</p>
            <p className="text-xs text-white/40">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Sector Compliance + Gauge */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <GlassCard variant="neutral" delay={12}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F2A44E]" />
                امتثال القطاعات
              </h3>
              <span className="text-[10px] text-white/30">آخر تحديث: اليوم</span>
            </div>
            <div className="space-y-4">
              {sectors.map((sector) => (
                <div key={sector.name} className="flex items-center gap-4">
                  <span className="text-sm text-white/80 w-32 flex-shrink-0">{sector.name}</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.compliance}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to left, ${sector.color}, ${sector.color}80)` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-12 text-left" style={{ fontFamily: 'Inter' }}>{sector.compliance}%</span>
                  <div className="flex items-center gap-1 text-[10px] text-white/40 w-20">
                    <AlertTriangle className="w-3 h-3" />
                    {sector.incidents} حوادث
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard variant="neutral" delay={13}>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#F2A44E]" />
            <h3 className="text-base font-bold text-white">مؤشر الامتثال الوطني</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" stroke="#F2A44E" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${78.5 * 3.267} ${326.7 - 78.5 * 3.267}`}
                  initial={{ strokeDasharray: '0 326.7' }}
                  animate={{ strokeDasharray: `${78.5 * 3.267} ${326.7 - 78.5 * 3.267}` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Inter' }}>78.5%</span>
                <span className="text-[10px] text-[#F2A44E]">ممتاز</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-lg font-bold text-white" style={{ fontFamily: 'Inter' }}>156</p>
                <p className="text-[10px] text-white/40">جهة ممتثلة</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-lg font-bold text-white" style={{ fontFamily: 'Inter' }}>44</p>
                <p className="text-[10px] text-white/40">جهة غير ممتثلة</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Incidents */}
      <GlassCard variant="neutral" delay={14}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E69745]" />
            آخر الحوادث
          </h3>
          <button className="text-xs text-[#F2A44E] hover:underline">عرض الكل</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-right py-3 px-2 text-[10px] text-white/40 font-medium">رقم الحادثة</th>
                <th className="text-right py-3 px-2 text-[10px] text-white/40 font-medium">الوصف</th>
                <th className="text-right py-3 px-2 text-[10px] text-white/40 font-medium">الخطورة</th>
                <th className="text-right py-3 px-2 text-[10px] text-white/40 font-medium">القطاع</th>
                <th className="text-right py-3 px-2 text-[10px] text-white/40 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((incident) => {
                const sev = severityConfig[incident.severity];
                return (
                  <tr key={incident.id} className="border-b border-white/4 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-[#F2A44E]">{incident.id}</td>
                    <td className="py-3 px-2 text-white/80">{incident.title}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium" style={{ color: sev.color, background: sev.bg }}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white/50">{incident.sector}</td>
                    <td className="py-3 px-2 text-white/40 text-xs">{incident.date}</td>
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
