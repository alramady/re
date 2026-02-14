import { motion } from 'framer-motion';
import { History, AlertTriangle, Shield, Clock, ChevronLeft, Filter, Download, Eye } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const incidents = [
  { id: 'INC-2026-0142', title: 'تسريب بيانات مرضى - مستشفى المملكة', severity: 'critical', status: 'investigating', sector: 'صحي', date: '14 فبراير 2026', assignee: 'م. محمد الرحيلي' },
  { id: 'INC-2026-0141', title: 'وصول غير مصرح لقاعدة بيانات العملاء', severity: 'high', status: 'contained', sector: 'مالي', date: '13 فبراير 2026', assignee: 'أ. عبدالله الربدي' },
  { id: 'INC-2026-0140', title: 'مشاركة بيانات طلاب بدون موافقة', severity: 'medium', status: 'resolved', sector: 'تعليمي', date: '12 فبراير 2026', assignee: 'أ. محمد سرحان' },
  { id: 'INC-2026-0139', title: 'خلل في نظام إدارة الموافقات', severity: 'low', status: 'resolved', sector: 'حكومي', date: '11 فبراير 2026', assignee: 'أ. محمد المعتز' },
  { id: 'INC-2026-0138', title: 'محاولة اختراق نظام الهوية الرقمية', severity: 'critical', status: 'resolved', sector: 'حكومي', date: '10 فبراير 2026', assignee: 'م. محمد الرحيلي' },
  { id: 'INC-2026-0137', title: 'تسريب بيانات عملاء عبر واجهة API', severity: 'high', status: 'resolved', sector: 'اتصالات', date: '9 فبراير 2026', assignee: 'أ. عبدالله الربدي' },
];

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: 'حرج', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  high: { label: 'عالي', color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' },
  medium: { label: 'متوسط', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)' },
  low: { label: 'منخفض', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  investigating: { label: 'قيد التحقيق', color: '#F97316' },
  contained: { label: 'تم الاحتواء', color: '#3B82F6' },
  resolved: { label: 'تم الحل', color: '#22C55E' },
};

export default function HistoryPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#F2A44E]" />
            سجل الحوادث
          </h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/8 text-white/60 text-xs transition-all">
              <Filter className="w-3.5 h-3.5" />
              تصفية
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/8 text-white/60 text-xs transition-all">
              <Download className="w-3.5 h-3.5" />
              تصدير
            </button>
          </div>
        </div>

        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">رقم الحادثة</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">الوصف</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">الخطورة</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">الحالة</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">القطاع</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">المسؤول</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">التاريخ</th>
                  <th className="text-right py-3 px-3 text-[10px] text-white/40 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => {
                  const sev = severityConfig[inc.severity];
                  const stat = statusConfig[inc.status];
                  return (
                    <tr key={inc.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs text-[#F2A44E]">{inc.id}</td>
                      <td className="py-3 px-3 text-white text-xs">{inc.title}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 rounded-full text-[10px] font-medium" style={{ color: sev.color, background: sev.bg }}>{sev.label}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: stat.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
                          {stat.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/60 text-xs">{inc.sector}</td>
                      <td className="py-3 px-3 text-white/60 text-xs">{inc.assignee}</td>
                      <td className="py-3 px-3 text-white/40 text-xs">{inc.date}</td>
                      <td className="py-3 px-3">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                          <Eye className="w-4 h-4 text-white/40" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
