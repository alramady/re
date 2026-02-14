import { motion } from 'framer-motion';
import { Shield, Users, Key, Lock, Settings, Database, Server, Globe, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const systemModules = [
  { name: 'نظام المصادقة', status: 'operational', uptime: '99.99%', icon: Key, color: '#22C55E' },
  { name: 'قاعدة البيانات', status: 'operational', uptime: '99.97%', icon: Database, color: '#22C55E' },
  { name: 'خدمات API', status: 'degraded', uptime: '98.5%', icon: Server, color: '#F97316' },
  { name: 'نظام التشفير', status: 'operational', uptime: '100%', icon: Lock, color: '#22C55E' },
  { name: 'بوابة الإنترنت', status: 'operational', uptime: '99.95%', icon: Globe, color: '#22C55E' },
];

const users = [
  { name: 'م. محمد الرحيلي', role: 'Root Admin', lastLogin: 'الآن', status: 'active' },
  { name: 'أ. عبدالله الربدي', role: 'System Admin', lastLogin: 'منذ ساعة', status: 'active' },
  { name: 'أ. محمد سرحان', role: 'System Admin', lastLogin: 'منذ 3 ساعات', status: 'away' },
  { name: 'أ. محمد المعتز', role: 'System Admin', lastLogin: 'أمس', status: 'offline' },
];

const statusIcons: Record<string, any> = {
  operational: CheckCircle,
  degraded: AlertTriangle,
  down: XCircle,
};

const statusLabels: Record<string, { label: string; color: string }> = {
  operational: { label: 'يعمل', color: '#22C55E' },
  degraded: { label: 'متدهور', color: '#F97316' },
  down: { label: 'متوقف', color: '#EF4444' },
};

export default function ControlCenterPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#F2A44E]" />
            مركز التحكم
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* System Status */}
          <GlassCard>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6">
              <Server className="w-5 h-5 text-[#F2A44E]" />
              حالة الأنظمة
            </h3>
            <div className="space-y-3">
              {systemModules.map((mod, i) => {
                const StatusIcon = statusIcons[mod.status];
                const statusInfo = statusLabels[mod.status];
                return (
                  <motion.div
                    key={mod.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${mod.color}15` }}>
                        <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                      </div>
                      <span className="text-sm text-white">{mod.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40">{mod.uptime}</span>
                      <div className="flex items-center gap-1" style={{ color: statusInfo.color }}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-xs">{statusInfo.label}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>

          {/* User Management */}
          <GlassCard>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-[#F2A44E]" />
              إدارة المستخدمين
            </h3>
            <div className="space-y-3">
              {users.map((user, i) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/2 hover:bg-white/4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white/40" />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#112240] ${user.status === 'active' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-white">{user.name}</p>
                      <p className="text-[10px] text-white/40">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30">{user.lastLogin}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
