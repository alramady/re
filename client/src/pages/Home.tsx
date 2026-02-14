import { useState, useCallback } from 'react';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { useAppStore } from '@/lib/store';
import ParticleBackground from '@/components/ParticleBackground';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import SplashScreen from '@/components/layout/SplashScreen';
import LoginPage from './LoginPage';
import WelcomeScreen from './WelcomeScreen';
import DashboardPage from './DashboardPage';
import SearchPage from './SearchPage';
import DataViewerPage from './DataViewerPage';
import ReportsPage from './ReportsPage';
import HistoryPage from './HistoryPage';
import QuickAnalyzePage from './QuickAnalyzePage';
import SmartMergePage from './SmartMergePage';
import CompareDiffPage from './CompareDiffPage';
import ControlCenterPage from './ControlCenterPage';
import ObservabilityPage from './ObservabilityPage';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';

export default function Home() {
  const { isAuthenticated, isLoading } = useLocalAuth();
  const { currentView, sidebarCollapsed } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A192F 0%, #112240 100%)' }}>
        <div className="w-8 h-8 border-2 border-[#C5A55A]/30 border-t-[#C5A55A] rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'welcome': return <WelcomeScreen />;
      case 'dashboard': return <DashboardPage />;
      case 'search': return <SearchPage />;
      case 'dataviewer': return <DataViewerPage />;
      case 'reports': return <ReportsPage />;
      case 'history': return <HistoryPage />;
      case 'quickanalyze': return <QuickAnalyzePage />;
      case 'smartmerge': return <SmartMergePage />;
      case 'comparediff': return <CompareDiffPage />;
      case 'controlcenter': return <ControlCenterPage />;
      case 'observability': return <ObservabilityPage />;
      case 'settings': return <SettingsPage />;
      case 'profile': return <ProfilePage />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden rased-bg">
      <ParticleBackground />
      <div className="relative z-10 h-full flex">
        <Sidebar />
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{ marginRight: sidebarCollapsed ? '72px' : '240px' }}
        >
          <TopBar />
          <main className="flex-1 overflow-hidden">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}
