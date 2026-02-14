import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, Sparkles, Upload, LayoutDashboard, GitBranch, Shield, Activity, FileText, Search, Zap, Table2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAppStore, type AppView } from '@/lib/store';
import { IMAGES } from '@/lib/images';
import { useLocalAuth } from '@/contexts/LocalAuthContext';

const LOGO_DARK = IMAGES.logoDark;
const CHAR_LAPTOP = IMAGES.charLaptop;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `منذ ${days} أيام`;
  return d.toLocaleDateString('ar-SA');
}

const quickActions: { id: AppView; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'dashboard', label: 'النظرة الوطنية', icon: LayoutDashboard, color: '#0A192F', desc: 'مؤشرات الامتثال الوطني' },
  { id: 'dataviewer', label: 'أطلس البيانات', icon: Table2, color: '#1a5276', desc: 'خريطة البيانات الشخصية' },
  { id: 'quickanalyze', label: 'مختبر الأنماط', icon: Zap, color: '#C5A55A', desc: 'تحليل ذكي للبيانات' },
  { id: 'reports', label: 'التقارير', icon: FileText, color: '#2c3e50', desc: 'تقارير الامتثال والحوادث' },
  { id: 'search', label: 'راصد الذكي', icon: Search, color: '#0f4c75', desc: 'مساعد ذكي بالذكاء الاصطناعي' },
  { id: 'controlcenter', label: 'مركز التحكم', icon: Shield, color: '#1b4332', desc: 'إدارة النظام والصلاحيات' },
];

export default function WelcomeScreen() {
  const { projects, setCurrentProject, setCurrentView, addProject, addFileToProject } = useAppStore();
  const { admin } = useLocalAuth();

  const openProject = (project: typeof projects[0]) => {
    setCurrentProject(project);
    setCurrentView('dashboard');
  };

  const createNewProject = () => {
    const newProject = {
      id: Math.random().toString(36).substring(2, 15),
      name: 'مشروع جديد',
      description: 'مشروع تحليل بيانات جديد',
      files: [],
      dashboards: [{
        id: Math.random().toString(36).substring(2, 15),
        name: 'لوحة رئيسية',
        widgets: [],
        layout: []
      }],
      workflows: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: ['#0A192F', '#C5A55A', '#1a5276', '#2c3e50', '#0f4c75'][Math.floor(Math.random() * 5)]
    };
    addProject(newProject);
  };

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-10 rounded-2xl overflow-hidden"
        style={{
          minHeight: '300px',
          background: 'linear-gradient(135deg, #0A192F 0%, #112240 40%, #1a2744 100%)',
        }}
      >
        <div className="absolute top-0 right-0 left-0 h-[3px]" style={{ background: 'linear-gradient(to left, #C5A55A, #D4AF37, #C5A55A)' }} />
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C5A55A, transparent)' }} />
        <div className="absolute bottom-5 right-1/3 w-60 h-60 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C5A55A, transparent)' }} />

        <div className="relative z-10 p-10 flex items-center justify-between h-full" style={{ minHeight: '300px' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_DARK} alt="راصد" className="h-14" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C5A55A]" />
              <span className="text-[#C5A55A] text-sm font-medium">مكتب إدارة البيانات الوطنية</span>
            </div>
            <p className="text-white/60 text-base max-w-lg leading-relaxed mb-6">
              منصة راصد الذكية لإدارة البيانات الوطنية والامتثال لنظام حماية البيانات الشخصية. حوّل بياناتك إلى رؤى استراتيجية تفاعلية.
            </p>
            <div className="flex gap-3">
              <button
                onClick={createNewProject}
                className="ripple-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#0A192F] font-bold text-sm hover:opacity-90 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #C5A55A, #D4AF37)' }}
              >
                <Plus className="w-4 h-4" />
                مشروع جديد
              </button>
              <button
                className="ripple-btn flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/80 text-sm hover:text-white hover:border-white/40 transition-all active:scale-95"
              >
                <Upload className="w-4 h-4" />
                رفع ملف Excel
              </button>
            </div>
            {admin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2 mt-4 text-[11px] text-white/30"
              >
                <Shield className="w-3.5 h-3.5 text-[#C5A55A]" />
                <span>مرحباً {admin.name} · {admin.displayName}</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="hidden lg:block"
          >
            <img
              src={CHAR_LAPTOP}
              alt="شخصية راصد"
              className="h-[280px] w-auto object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#0A192F] dark:text-white flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-[#C5A55A]" />
          الوصول السريع
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <GlassCard
              key={action.id}
              tilt
              delay={i}
              onClick={() => setCurrentView(action.id)}
              className="text-center group"
            >
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${action.color}12`, border: `1px solid ${action.color}25` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <h3 className="text-sm font-bold text-[#0A192F] dark:text-white mb-1 group-hover:text-[#C5A55A] transition-colors">{action.label}</h3>
              <p className="text-[10px] text-[#0A192F]/40 dark:text-white/40">{action.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C5A55A]" />
            المشاريع الأخيرة
          </h2>
          <span className="text-xs text-[#0A192F]/30 dark:text-white/30">{projects.length} مشاريع</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {projects.map((project, i) => (
            <GlassCard
              key={project.id}
              tilt
              delay={i}
              onClick={() => openProject(project)}
              className="group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${project.color}12`, border: `1px solid ${project.color}25` }}
                >
                  <FolderOpen className="w-5 h-5" style={{ color: project.color }} />
                </div>
                <span className="text-[10px] text-[#0A192F]/30 dark:text-white/30">{formatDate(project.updatedAt)}</span>
              </div>
              <h3 className="text-[#0A192F] dark:text-white font-bold text-base mb-1 group-hover:text-[#C5A55A] transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-[#0A192F]/40 dark:text-white/40 mb-4">{project.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-[#0A192F]/30 dark:text-white/30">
                <span className="flex items-center gap-1">
                  <LayoutDashboard className="w-3 h-3" />
                  {project.dashboards.length} لوحات
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  {project.workflows.length} عمليات
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
