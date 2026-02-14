import { motion } from 'framer-motion';
import { Merge, TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Globe } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const trends = [
  { period: 'يناير 2026', compliance: 75.2, incidents: 18, requests: 2340 },
  { period: 'فبراير 2026', compliance: 78.5, incidents: 12, requests: 2847 },
];

const sectorComparison = [
  { sector: 'القطاع الصحي', current: 82, previous: 78, change: 4 },
  { sector: 'القطاع المالي', current: 91, previous: 89, change: 2 },
  { sector: 'القطاع التعليمي', current: 74, previous: 70, change: 4 },
  { sector: 'القطاع الحكومي', current: 88, previous: 85, change: 3 },
  { sector: 'قطاع الاتصالات', current: 85, previous: 80, change: 5 },
  { sector: 'قطاع التجزئة', current: 69, previous: 65, change: 4 },
];

export default function SmartMergePage() {
  const latestTrend = trends[trends.length - 1];
  const prevTrend = trends[trends.length - 2];

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Merge className="w-6 h-6 text-[#F2A44E]" />
            الاتجاهات والمقارنات
          </h2>
        </div>

        {/* Trend Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <GlassCard delay={0} tilt>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">الامتثال الوطني</span>
              <span className="flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="w-3 h-3" />
                +{(latestTrend.compliance - prevTrend.compliance).toFixed(1)}%
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{latestTrend.compliance}%</p>
            <p className="text-[10px] text-white/30 mt-1">{latestTrend.period}</p>
          </GlassCard>
          <GlassCard delay={1} tilt>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">الحوادث</span>
              <span className="flex items-center gap-1 text-xs text-green-500">
                <TrendingDown className="w-3 h-3" />
                -{prevTrend.incidents - latestTrend.incidents}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{latestTrend.incidents}</p>
            <p className="text-[10px] text-white/30 mt-1">انخفاض ملحوظ</p>
          </GlassCard>
          <GlassCard delay={2} tilt>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">طلبات أصحاب البيانات</span>
              <span className="flex items-center gap-1 text-xs text-blue-500">
                <ArrowUpRight className="w-3 h-3" />
                +{latestTrend.requests - prevTrend.requests}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{latestTrend.requests.toLocaleString()}</p>
            <p className="text-[10px] text-white/30 mt-1">ارتفاع في الوعي</p>
          </GlassCard>
        </div>

        {/* Sector Comparison */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#F2A44E]" />
            <h3 className="text-base font-bold text-white">مقارنة القطاعات (شهري)</h3>
          </div>
          <div className="space-y-4">
            {sectorComparison.map((sector, i) => (
              <motion.div
                key={sector.sector}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-white w-36 flex-shrink-0">{sector.sector}</span>
                <div className="flex-1 relative h-8">
                  <div className="absolute inset-0 bg-white/3 rounded-lg" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sector.previous}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-0 h-4 rounded-t-lg bg-white/10"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sector.current}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute bottom-0 h-4 rounded-b-lg"
                    style={{ background: sector.current > 80 ? '#22C55E' : sector.current > 60 ? '#EAB308' : '#EF4444' }}
                  />
                </div>
                <div className="w-20 text-left">
                  <span className="text-sm font-bold text-white">{sector.current}%</span>
                  <span className="text-[10px] text-green-500 mr-1">+{sector.change}%</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="w-3 h-2 rounded bg-white/10" />
              الشهر السابق
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="w-3 h-2 rounded bg-green-500" />
              الشهر الحالي
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
