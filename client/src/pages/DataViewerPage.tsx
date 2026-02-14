import { motion } from 'framer-motion';
import { Table2, Database, Shield, Eye, Lock, Users, Building2, Globe, Filter, Download, Search } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const dataCategories = [
  { name: 'بيانات الهوية', count: 45200, sensitivity: 'عالي', icon: Users, color: '#EF4444' },
  { name: 'البيانات المالية', count: 32100, sensitivity: 'عالي', icon: Building2, color: '#F97316' },
  { name: 'البيانات الصحية', count: 28700, sensitivity: 'حرج', icon: Shield, color: '#DC2626' },
  { name: 'بيانات الاتصال', count: 67300, sensitivity: 'متوسط', icon: Globe, color: '#3B82F6' },
  { name: 'بيانات التوظيف', count: 18900, sensitivity: 'عالي', icon: Users, color: '#8B5CF6' },
  { name: 'البيانات البيومترية', count: 12400, sensitivity: 'حرج', icon: Eye, color: '#EC4899' },
];

const dataFlows = [
  { source: 'وزارة الصحة', destination: 'هيئة البيانات', type: 'بيانات مرضى', volume: '2.3M', status: 'active', encrypted: true },
  { source: 'البنك المركزي', destination: 'هيئة الرقابة', type: 'بيانات مالية', volume: '890K', status: 'active', encrypted: true },
  { source: 'وزارة التعليم', destination: 'مركز المعلومات', type: 'بيانات طلاب', volume: '5.1M', status: 'paused', encrypted: true },
  { source: 'شركة الاتصالات', destination: 'هيئة الاتصالات', type: 'بيانات مشتركين', volume: '12.7M', status: 'active', encrypted: false },
  { source: 'وزارة الموارد', destination: 'التأمينات', type: 'بيانات موظفين', volume: '3.4M', status: 'active', encrypted: true },
];

export default function DataViewerPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <Table2 className="w-6 h-6 text-[#C5A55A]" />
            أطلس البيانات الشخصية
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0A192F]/5 dark:bg-white/5">
              <Search className="w-3.5 h-3.5 text-[#0A192F]/40 dark:text-white/40" />
              <input placeholder="بحث في البيانات..." className="bg-transparent text-xs outline-none w-40 text-[#0A192F] dark:text-white placeholder:text-[#0A192F]/30 dark:placeholder:text-white/30" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A192F]/5 hover:bg-[#0A192F]/8 text-[#0A192F]/60 text-xs transition-all dark:bg-white/5 dark:text-white/60">
              <Filter className="w-3.5 h-3.5" />
              تصفية
            </button>
          </div>
        </div>

        {/* Data Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {dataCategories.map((cat, i) => (
            <GlassCard key={cat.name} delay={i} tilt className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
                <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <h4 className="text-xs font-bold text-[#0A192F] dark:text-white mb-1">{cat.name}</h4>
              <p className="text-lg font-bold text-[#0A192F] dark:text-white">{cat.count.toLocaleString()}</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: cat.color, background: `${cat.color}15` }}>{cat.sensitivity}</span>
            </GlassCard>
          ))}
        </div>

        {/* Data Flows */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#C5A55A]" />
              تدفقات البيانات النشطة
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] text-[#C5A55A] hover:bg-[#C5A55A]/10 transition-colors">
              <Download className="w-3 h-3" />
              تصدير
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0A192F]/5 dark:border-white/5">
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">المصدر</th>
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">الوجهة</th>
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">نوع البيانات</th>
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">الحجم</th>
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">الحالة</th>
                  <th className="text-right py-3 px-3 text-[10px] text-[#0A192F]/40 dark:text-white/40 font-medium">التشفير</th>
                </tr>
              </thead>
              <tbody>
                {dataFlows.map((flow, i) => (
                  <tr key={i} className="border-b border-[#0A192F]/3 dark:border-white/3 hover:bg-[#0A192F]/2 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3 text-[#0A192F] dark:text-white text-xs">{flow.source}</td>
                    <td className="py-3 px-3 text-[#0A192F] dark:text-white text-xs">{flow.destination}</td>
                    <td className="py-3 px-3 text-[#0A192F]/60 dark:text-white/60 text-xs">{flow.type}</td>
                    <td className="py-3 px-3 font-mono text-xs text-[#C5A55A]">{flow.volume}</td>
                    <td className="py-3 px-3">
                      <span className={`flex items-center gap-1 text-[10px] ${flow.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${flow.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {flow.status === 'active' ? 'نشط' : 'متوقف'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Lock className={`w-4 h-4 ${flow.encrypted ? 'text-green-500' : 'text-red-500'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
