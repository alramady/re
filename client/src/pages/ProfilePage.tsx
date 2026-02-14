import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Calendar, Clock, Key, Edit, Camera } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { IMAGES } from '@/lib/images';

export default function ProfilePage() {
  const { admin } = useLocalAuth();

  if (!admin) return null;

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <GlassCard className="mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={IMAGES.charProfile}
                alt={admin.displayName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C5A55A]/30"
              />
              <button className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-[#C5A55A] flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-[#0A192F]" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A192F] dark:text-white">{admin.displayName}</h2>
              <p className="text-sm text-[#C5A55A] mb-1">{admin.role === 'root' ? 'مدير تنفيذي - Root Admin' : 'مدير نظام - System Admin'}</p>
              <p className="text-xs text-[#0A192F]/40 dark:text-white/40">@{admin.username}</p>
            </div>
            <div className="mr-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A192F]/5 dark:bg-white/5 text-[#0A192F]/60 dark:text-white/60 text-sm hover:bg-[#0A192F]/8 dark:hover:bg-white/8 transition-colors">
                <Edit className="w-4 h-4" />
                تعديل
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Personal Info */}
          <GlassCard>
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-[#C5A55A]" />
              المعلومات الشخصية
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <User className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">الاسم الكامل</p>
                  <p className="text-sm text-[#0A192F] dark:text-white">{admin.displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <Mail className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">البريد الإلكتروني</p>
                  <p className="text-sm text-[#0A192F] dark:text-white">{admin.email || 'غير محدد'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <Key className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">معرف المستخدم</p>
                  <p className="text-sm text-[#0A192F] dark:text-white font-mono">{admin.username}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security & Access */}
          <GlassCard>
            <h3 className="text-base font-bold text-[#0A192F] dark:text-white flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#C5A55A]" />
              الأمان والوصول
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <Shield className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">الدور</p>
                  <p className="text-sm text-[#0A192F] dark:text-white">{admin.role === 'root' ? 'Root & System Admin' : 'System Admin'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <Calendar className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">تاريخ الإنشاء</p>
                  <p className="text-sm text-[#0A192F] dark:text-white">1 يناير 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0A192F]/2 dark:bg-white/2">
                <Clock className="w-4 h-4 text-[#0A192F]/40 dark:text-white/40" />
                <div>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">آخر تسجيل دخول</p>
                  <p className="text-sm text-[#0A192F] dark:text-white">الآن</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
