import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, GitBranch, Settings, Store,
  ChevronRight, ChevronLeft, Home, FileSpreadsheet, FolderOpen, Table2, FileText, User,
  ChevronDown, ChevronUp, History, Layout, Zap, Merge, GitCompareArrows, Shield, Activity, LogOut, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, type AppView } from '@/lib/store';
import { IMAGES } from '@/lib/images';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const LOGO_URL = IMAGES.logoMain;

const teamMembers = [
  { id: 'MRUHAILY', name: 'Muhammed ALRuhaily', displayName: 'Admin Rasid System', role: 'Root & System Admin', status: 'online' as const, avatar: '👨‍💻', color: '#F2A44E' },
  { id: 'aalrebdi', name: 'Alrebdi Fahad Alrebdi', displayName: "NDMO's president/director", role: 'System Admin', status: 'online' as const, avatar: '👨‍💼', color: '#4CAF50' },
  { id: 'msarhan', name: 'Mashal Abdullah Alsarhan', displayName: 'Vice President of NDMO', role: 'System Admin', status: 'away' as const, avatar: '👨‍🔬', color: '#FF9800' },
  { id: 'malmoutaz', name: 'Manal Mohammed Almoutaz', displayName: 'Manager of Smart Rasid Platform', role: 'System Admin', status: 'offline' as const, avatar: '🛡️', color: '#9E9E9E' },
  { id: 'system', name: 'راصد الذكي', displayName: 'راصد الذكي', role: 'مساعد ذكي', status: 'online' as const, avatar: '🤖', color: '#2196F3' },
];

const statusConfig = {
  online: { label: 'متصل', color: '#4CAF50', pulse: true },
  away: { label: 'بعيد', color: '#FF9800', pulse: false },
  offline: { label: 'غير متصل', color: '#9E9E9E', pulse: false },
};

const analysisItems: { id: AppView; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'النظرة الوطنية', icon: LayoutDashboard },
  { id: 'history', label: 'سجل الحوادث', icon: History },
  { id: 'dataviewer', label: 'أطلس البيانات الشخصية', icon: Table2 },
  { id: 'quickanalyze', label: 'مختبر الأنماط', icon: Zap },
  { id: 'comparediff', label: 'عدسة الأثر والحقوق', icon: GitCompareArrows },
  { id: 'smartmerge', label: 'الاتجاهات والمقارنات', icon: Merge },
  { id: 'reports', label: 'مركز التقارير', icon: FileText },
  { id: 'search', label: 'راصد الذكي', icon: Search },
];

const adminItems: { id: AppView; label: string; icon: any }[] = [
  { id: 'controlcenter', label: 'مركز التحكم', icon: Shield },
  { id: 'observability', label: 'لوحة المراقبة', icon: Activity },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarCollapsed, toggleSidebar, currentProject } = useAppStore();
  const { admin, logout } = useLocalAuth();
  const { theme, toggleTheme } = useTheme();
  const [teamExpanded, setTeamExpanded] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(true);
  const [adminExpanded, setAdminExpanded] = useState(false);

  const onlineCount = teamMembers.filter(m => m.status === 'online').length;

  const renderNavItem = (item: { id: AppView; label: string; icon: any }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    return (
      <motion.button
        key={item.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentView(item.id)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
          isActive
            ? 'bg-[#F2A44E]/15 text-[#F2A44E]'
            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#F2A44E] rounded-l-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
          <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(242,164,78,0.5)]')} />
        </motion.div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  const renderSection = (title: string, items: { id: AppView; label: string; icon: any }[], expanded: boolean, setExpanded: (v: boolean) => void) => (
    <div className="mb-1">
      {!sidebarCollapsed && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-[10px] text-white/30 uppercase tracking-wider hover:text-white/50 transition-colors"
        >
          <span>{title}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
      <AnimatePresence>
        {(expanded || sidebarCollapsed) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-0.5"
          >
            {items.map(renderNavItem)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed right-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
      style={{
        background: 'linear-gradient(180deg, #0A192F 0%, #112240 100%)',
        borderLeft: '1px solid rgba(242, 164, 78, 0.15)',
      }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-[#F2A44E]/10">
        <motion.div
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <img
            src={LOGO_URL}
            alt="راصد"
            className={cn(
              'object-contain transition-all duration-300',
              sidebarCollapsed ? 'h-8 w-8' : 'h-10'
            )}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </motion.div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold text-white whitespace-nowrap" style={{ fontFamily: 'Tajawal' }}>منصة راصد</h1>
              <p className="text-[10px] text-[#F2A44E] whitespace-nowrap">مكتب إدارة البيانات الوطنية</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {renderSection('التحليل', analysisItems, analysisExpanded, setAnalysisExpanded)}
        {renderSection('الإدارة', adminItems, adminExpanded, setAdminExpanded)}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-[#F2A44E]" /> : <Moon className="w-5 h-5" />}
          {!sidebarCollapsed && (
            <span className="text-sm">{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          {sidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          {!sidebarCollapsed && <span className="text-sm">طي القائمة</span>}
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
          {!sidebarCollapsed && <span className="text-sm">تسجيل الخروج</span>}
        </button>
      </div>

      {/* User Profile */}
      {admin && (
        <div className="p-3 border-t border-white/5">
          <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
            <div className="relative flex-shrink-0">
              <img
                src={IMAGES.charStanding}
                alt={admin.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#F2A44E]/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-[#0A192F]" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{admin.name}</p>
                <p className="text-[10px] text-[#F2A44E]/60 truncate">{admin.displayName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
