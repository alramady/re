import { motion } from 'framer-motion';
import { GitCompareArrows, Users, Shield, Eye, Scale, FileText, ArrowLeftRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const rightsAnalysis = [
  { right: 'حق الوصول', article: 'المادة 14', compliance: 82, gap: 'بعض الجهات لا توفر آلية إلكترونية', impact: 'high' },
  { right: 'حق التصحيح', article: 'المادة 15', compliance: 76, gap: 'تأخر في معالجة الطلبات (متوسط 15 يوم)', impact: 'medium' },
  { right: 'حق الحذف', article: 'المادة 16', compliance: 68, gap: 'عدم وضوح سياسات الاحتفاظ', impact: 'high' },
  { right: 'حق النقل', article: 'المادة 17', compliance: 55, gap: 'غياب معايير تبادل البيانات', impact: 'critical' },
  { right: 'حق الاعتراض', article: 'المادة 18', compliance: 71, gap: 'آلية الاعتراض غير واضحة', impact: 'medium' },
  { right: 'حق الإبلاغ', article: 'المادة 19', compliance: 88, gap: 'تحسن ملحوظ في قنوات الإبلاغ', impact: 'low' },
];

const impactColors: Record<string, { color: string; label: string }> = {
  critical: { color: '#EF4444', label: 'حرج' },
  high: { color: '#F97316', label: 'عالي' },
  medium: { color: '#EAB308', label: 'متوسط' },
  low: { color: '#22C55E', label: 'منخفض' },
};

export default function CompareDiffPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <GitCompareArrows className="w-6 h-6 text-[#C5A55A]" />
            عدسة الأثر والحقوق
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <GlassCard delay={0} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A55A]/10 flex items-center justify-center"><Scale className="w-5 h-5 text-[#C5A55A]" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">6</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">حقوق قيد التحليل</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={1} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Shield className="w-5 h-5 text-green-500" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">73%</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">متوسط الامتثال</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={2} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Eye className="w-5 h-5 text-red-500" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">2</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">فجوات حرجة</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Rights Analysis Table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C5A55A]" />
              تحليل حقوق أصحاب البيانات
            </h3>
          </div>
          <div className="space-y-4">
            {rightsAnalysis.map((item, i) => {
              const impact = impactColors[item.impact];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-[#0A192F]/2 dark:bg-white/2 hover:bg-[#0A192F]/4 dark:hover:bg-white/4 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-[#0A192F] dark:text-white">{item.right}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A55A]/10 text-[#C5A55A]">{item.article}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: impact.color, background: `${impact.color}15` }}>
                      أثر {impact.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 h-2 bg-[#0A192F]/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.compliance}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: item.compliance > 80 ? '#22C55E' : item.compliance > 60 ? '#EAB308' : '#EF4444' }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#0A192F] dark:text-white w-12 text-left">{item.compliance}%</span>
                  </div>
                  <p className="text-xs text-[#0A192F]/50 dark:text-white/50">{item.gap}</p>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
