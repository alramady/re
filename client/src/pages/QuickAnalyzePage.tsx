import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Shield, BarChart3, PieChart, Activity } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const patterns = [
  { title: 'نمط تسريب متكرر', description: 'اكتشاف نمط تسريب بيانات مرضى عبر واجهات API غير مؤمنة في 3 جهات صحية', severity: 'critical', confidence: 94, trend: 'increasing' },
  { title: 'ضعف في إدارة الموافقات', description: 'عدم تحديث آلية الموافقات في 12 جهة حكومية خلال 6 أشهر', severity: 'high', confidence: 87, trend: 'stable' },
  { title: 'تحسن في التشفير', description: 'ارتفاع نسبة تشفير البيانات المنقولة بنسبة 15% في القطاع المالي', severity: 'positive', confidence: 91, trend: 'improving' },
  { title: 'مخاطر الطرف الثالث', description: 'زيادة مشاركة البيانات مع أطراف ثالثة بدون تقييم مخاطر كافٍ', severity: 'medium', confidence: 78, trend: 'increasing' },
];

const severityColors: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#EAB308', positive: '#22C55E',
};

export default function QuickAnalyzePage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#C5A55A]" />
            مختبر الأنماط
          </h2>
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#C5A55A]/10 text-[#C5A55A]">تحليل ذكي</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <GlassCard delay={0} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">7</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">أنماط خطرة مكتشفة</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={1} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Activity className="w-5 h-5 text-blue-500" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">23</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">تحليل نشط</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={2} tilt>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Shield className="w-5 h-5 text-green-500" /></div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] dark:text-white">89%</p>
                <p className="text-xs text-[#0A192F]/40 dark:text-white/40">دقة التنبؤ</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Patterns */}
        <div className="space-y-4">
          {patterns.map((pattern, i) => (
            <GlassCard key={i} delay={i + 3}>
              <div className="flex items-start gap-4">
                <div className="w-2 h-full min-h-[60px] rounded-full" style={{ background: severityColors[pattern.severity] }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#0A192F] dark:text-white">{pattern.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: severityColors[pattern.severity], background: `${severityColors[pattern.severity]}15` }}>
                        ثقة {pattern.confidence}%
                      </span>
                      <span className={`text-[10px] ${pattern.trend === 'increasing' ? 'text-red-500' : pattern.trend === 'improving' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {pattern.trend === 'increasing' ? '↑ متزايد' : pattern.trend === 'improving' ? '↑ تحسن' : '→ مستقر'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#0A192F]/60 dark:text-white/60">{pattern.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
