import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Filter, Plus, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const reports = [
  { id: 1, title: 'تقرير الامتثال الوطني - الربع الأول 2026', type: 'compliance', date: '15 يناير 2026', status: 'published', pages: 45 },
  { id: 2, title: 'تحليل حوادث تسريب البيانات', type: 'incident', date: '10 فبراير 2026', status: 'published', pages: 28 },
  { id: 3, title: 'تقرير أداء الجهات الحكومية', type: 'performance', date: '1 فبراير 2026', status: 'draft', pages: 32 },
  { id: 4, title: 'مراجعة سياسات حماية البيانات', type: 'policy', date: '20 يناير 2026', status: 'published', pages: 18 },
  { id: 5, title: 'تقرير طلبات أصحاب البيانات', type: 'requests', date: '5 فبراير 2026', status: 'review', pages: 22 },
  { id: 6, title: 'تقييم المخاطر السنوي', type: 'risk', date: '12 فبراير 2026', status: 'draft', pages: 56 },
];

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  compliance: { label: 'امتثال', color: '#4CAF50', icon: BarChart3 },
  incident: { label: 'حوادث', color: '#F97316', icon: TrendingUp },
  performance: { label: 'أداء', color: '#3B82F6', icon: PieChart },
  policy: { label: 'سياسات', color: '#8B5CF6', icon: FileText },
  requests: { label: 'طلبات', color: '#C5A55A', icon: FileText },
  risk: { label: 'مخاطر', color: '#EF4444', icon: TrendingUp },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  published: { label: 'منشور', color: '#22C55E' },
  draft: { label: 'مسودة', color: '#94A3B8' },
  review: { label: 'قيد المراجعة', color: '#F97316' },
};

export default function ReportsPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#C5A55A]" />
            مركز التقارير
          </h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A192F]/5 hover:bg-[#0A192F]/8 text-[#0A192F]/60 text-xs transition-all dark:bg-white/5 dark:text-white/60">
              <Filter className="w-3.5 h-3.5" />
              تصفية
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#0A192F] hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #C5A55A, #D4AF37)' }}>
              <Plus className="w-4 h-4" />
              تقرير جديد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {reports.map((report, i) => {
            const type = typeConfig[report.type];
            const status = statusConfig[report.status];
            const TypeIcon = type.icon;
            return (
              <GlassCard key={report.id} delay={i} tilt className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${type.color}15`, border: `1px solid ${type.color}25` }}>
                    <TypeIcon className="w-5 h-5" style={{ color: type.color }} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: status.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                    {status.label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0A192F] dark:text-white mb-2 group-hover:text-[#C5A55A] transition-colors line-clamp-2">{report.title}</h3>
                <div className="flex items-center gap-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                  <span>{report.pages} صفحة</span>
                  <span className="px-1.5 py-0.5 rounded-full" style={{ color: type.color, background: `${type.color}15` }}>{type.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0A192F]/5 dark:bg-white/5 text-[#0A192F]/60 dark:text-white/60 text-xs hover:bg-[#0A192F]/8 dark:hover:bg-white/8 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    عرض
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0A192F]/5 dark:bg-white/5 text-[#0A192F]/60 dark:text-white/60 text-xs hover:bg-[#0A192F]/8 dark:hover:bg-white/8 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    تحميل
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
