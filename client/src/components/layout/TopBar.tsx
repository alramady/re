import { motion } from 'framer-motion';
import { Search, User, ChevronLeft, Sun, Moon, Bell } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { useState } from 'react';

const viewLabels: Record<string, string> = {
  welcome: 'الرئيسية',
  dashboard: 'النظرة الوطنية',
  dataviewer: 'أطلس البيانات الشخصية',
  search: 'راصد الذكي',
  reports: 'مركز التقارير',
  workflow: 'سير العمل',
  marketplace: 'سوق الإضافات',
  settings: 'الإعدادات',
  profile: 'الملف الشخصي',
  history: 'سجل الحوادث',
  studio: 'استوديو اللوحات',
  quickanalyze: 'مختبر الأنماط',
  smartmerge: 'الاتجاهات والمقارنات',
  comparediff: 'عدسة الأثر والحقوق',
  controlcenter: 'مركز التحكم',
  observability: 'لوحة المراقبة',
};

export default function TopBar() {
  const { currentView, setCurrentView, currentProject, setCurrentProject } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const { admin } = useLocalAuth();
  const isDark = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'تم اكتشاف 3 حوادث جديدة في قطاع الصحة', time: 'منذ 5 دقائق', type: 'warning' },
    { id: 2, text: 'تحديث نظام حماية البيانات الشخصية v2.1', time: 'منذ ساعة', type: 'info' },
    { id: 3, text: 'اكتمل تحليل الامتثال للربع الأول', time: 'منذ 3 ساعات', type: 'success' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-14 flex items-center justify-between px-6 border-b border-[#0A192F]/8 bg-white/70 backdrop-blur-xl dark:bg-[#0A192F]/70 dark:border-white/5"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {currentProject && currentView !== 'welcome' && (
          <>
            <button
              onClick={() => { setCurrentProject(null); setCurrentView('welcome'); }}
              className="text-[#0A192F]/40 hover:text-[#0A192F]/70 transition-colors dark:text-white/40 dark:hover:text-white/70"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-[#0A192F]/20 dark:text-white/20" />
            <span className="text-[#0A192F]/40 dark:text-white/40">{currentProject.name}</span>
            <ChevronLeft className="w-3.5 h-3.5 text-[#0A192F]/20 dark:text-white/20" />
          </>
        )}
        <span className="text-[#0A192F] font-semibold dark:text-white">{viewLabels[currentView] || 'الرئيسية'}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A192F]/5 hover:bg-[#0A192F]/8 text-[#0A192F]/40 hover:text-[#0A192F]/60 transition-all text-xs dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/40 dark:hover:text-white/60"
        >
          <Search className="w-3.5 h-3.5" />
          <span>بحث...</span>
          <div className="flex items-center gap-0.5 mr-2">
            <kbd className="px-1 py-0.5 rounded bg-[#0A192F]/8 text-[9px] dark:bg-white/10">⌘</kbd>
            <kbd className="px-1 py-0.5 rounded bg-[#0A192F]/8 text-[9px] dark:bg-white/10">K</kbd>
          </div>
        </button>

        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="relative p-2 rounded-xl hover:bg-[#0A192F]/5 text-[#0A192F]/40 hover:text-[#0A192F]/60 transition-colors dark:hover:bg-white/5 dark:text-white/40 dark:hover:text-white/60"
          title={isDark ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#C5A55A]" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-[#0A192F]/5 text-[#0A192F]/40 hover:text-[#0A192F]/60 transition-colors dark:hover:bg-white/5 dark:text-white/40 dark:hover:text-white/60"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-[#112240] rounded-xl shadow-xl border border-[#0A192F]/10 dark:border-white/10 overflow-hidden z-50"
            >
              <div className="p-3 border-b border-[#0A192F]/5 dark:border-white/5">
                <h3 className="text-sm font-bold text-[#0A192F] dark:text-white">الإشعارات</h3>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="p-3 hover:bg-[#0A192F]/3 dark:hover:bg-white/5 transition-colors border-b border-[#0A192F]/3 dark:border-white/3 last:border-0">
                  <p className="text-xs text-[#0A192F] dark:text-white/80">{n.text}</p>
                  <p className="text-[10px] text-[#0A192F]/40 dark:text-white/30 mt-1">{n.time}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={() => setCurrentView('profile')}
          className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-[#0A192F]/5 dark:hover:bg-white/5 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A192F] to-[#1a2744] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {admin && (
            <span className="text-xs font-medium text-[#0A192F]/60 dark:text-white/60 hidden lg:block">{admin.name?.split(' ')[0]}</span>
          )}
        </button>
      </div>
    </motion.header>
  );
}
