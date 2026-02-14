import { create } from 'zustand';

// ===== TYPES =====
export interface ExcelFile {
  id: string;
  name: string;
  path: string;
  size: number;
  sheets: ExcelSheet[];
  lastModified: string;
  addedAt: string;
}

export interface ExcelSheet {
  name: string;
  rowCount: number;
  colCount: number;
  columns: ColumnInfo[];
  data: any[][];
}

export interface ColumnInfo {
  name: string;
  index: number;
  type: 'number' | 'string' | 'date' | 'boolean' | 'mixed';
  fileId: string;
  sheetName: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ExcelFile[];
  dashboards: Dashboard[];
  workflows: Workflow[];
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  layout: any[];
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table';
  title: string;
  config: any;
  dataSource: {
    fileId: string;
    sheetName: string;
    columns: string[];
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    groupBy?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isRecording: boolean;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  chartData?: any;
}

export type AppView = 'welcome' | 'dashboard' | 'search' | 'dataviewer' | 'reports' | 'workflow' | 'marketplace' | 'settings' | 'profile' | 'history' | 'studio' | 'quickanalyze' | 'smartmerge' | 'comparediff' | 'controlcenter' | 'observability';

// ===== STORE =====
interface AppState {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addFileToProject: (projectId: string, file: ExcelFile) => void;
  removeFileFromProject: (projectId: string, fileId: string) => void;
  currentDashboard: Dashboard | null;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  addWidgetToDashboard: (dashboardId: string, widget: DashboardWidget) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  currentWorkflow: Workflow | null;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  contextSidebarOpen: boolean;
  contextSidebarContent: any;
  setContextSidebar: (open: boolean, content?: any) => void;
  widgetDialogOpen: boolean;
  widgetDialogData: any;
  setWidgetDialog: (open: boolean, data?: any) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const createDemoProjects = (): Project[] => [
  {
    id: generateId(),
    name: 'تحليل المبيعات السنوي',
    description: 'تحليل شامل لبيانات المبيعات للعام 2025',
    files: [],
    dashboards: [{ id: generateId(), name: 'لوحة المبيعات الرئيسية', widgets: [], layout: [] }],
    workflows: [],
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
    color: '#64FFDA'
  },
  {
    id: generateId(),
    name: 'تقرير الموارد البشرية',
    description: 'بيانات الموظفين والأداء الوظيفي',
    files: [],
    dashboards: [{ id: generateId(), name: 'مؤشرات الأداء', widgets: [], layout: [] }],
    workflows: [],
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-02-12T09:15:00Z',
    color: '#7C4DFF'
  },
  {
    id: generateId(),
    name: 'ميزانية المشاريع',
    description: 'متابعة ميزانيات المشاريع الجارية',
    files: [],
    dashboards: [],
    workflows: [],
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-02-11T16:45:00Z',
    color: '#FF6B6B'
  },
  {
    id: generateId(),
    name: 'تحليل رضا العملاء',
    description: 'استبيانات ونتائج رضا العملاء',
    files: [],
    dashboards: [],
    workflows: [],
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-13T11:00:00Z',
    color: '#FFC107'
  }
];

export const useAppStore = create<AppState>((set) => ({
  currentView: 'welcome',
  setCurrentView: (view) => set({ currentView: view }),
  sidebarCollapsed: true,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  projects: createDemoProjects(),
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  addFileToProject: (projectId, file) => set((s) => ({
    projects: s.projects.map(p =>
      p.id === projectId ? { ...p, files: [...p.files, file] } : p
    ),
    currentProject: s.currentProject?.id === projectId
      ? { ...s.currentProject, files: [...s.currentProject.files, file] }
      : s.currentProject
  })),
  removeFileFromProject: (projectId, fileId) => set((s) => ({
    projects: s.projects.map(p =>
      p.id === projectId ? { ...p, files: p.files.filter(f => f.id !== fileId) } : p
    )
  })),
  currentDashboard: null,
  setCurrentDashboard: (dashboard) => set({ currentDashboard: dashboard }),
  addWidgetToDashboard: (dashboardId, widget) => set((s) => {
    const updateDashboards = (dashboards: Dashboard[]) =>
      dashboards.map(d => d.id === dashboardId
        ? { ...d, widgets: [...d.widgets, widget] }
        : d
      );
    return {
      currentProject: s.currentProject ? {
        ...s.currentProject,
        dashboards: updateDashboards(s.currentProject.dashboards)
      } : null,
      currentDashboard: s.currentDashboard?.id === dashboardId
        ? { ...s.currentDashboard, widgets: [...s.currentDashboard.widgets, widget] }
        : s.currentDashboard
    };
  }),
  updateWidget: (dashboardId, widgetId, updates) => set((s) => {
    const updateWidgets = (dashboards: Dashboard[]) =>
      dashboards.map(d => d.id === dashboardId
        ? { ...d, widgets: d.widgets.map(w => w.id === widgetId ? { ...w, ...updates } : w) }
        : d
      );
    return {
      currentProject: s.currentProject ? {
        ...s.currentProject,
        dashboards: updateWidgets(s.currentProject.dashboards)
      } : null
    };
  }),
  removeWidget: (dashboardId, widgetId) => set((s) => {
    const removeFromDashboards = (dashboards: Dashboard[]) =>
      dashboards.map(d => d.id === dashboardId
        ? { ...d, widgets: d.widgets.filter(w => w.id !== widgetId) }
        : d
      );
    return {
      currentProject: s.currentProject ? {
        ...s.currentProject,
        dashboards: removeFromDashboards(s.currentProject.dashboards)
      } : null
    };
  }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  chatMessages: [],
  addChatMessage: (message) => set((s) => ({ chatMessages: [...s.chatMessages, message] })),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  currentWorkflow: null,
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  contextSidebarOpen: false,
  contextSidebarContent: null,
  setContextSidebar: (open, content) => set({ contextSidebarOpen: open, contextSidebarContent: content }),
  widgetDialogOpen: false,
  widgetDialogData: null,
  setWidgetDialog: (open, data) => set({ widgetDialogOpen: open, widgetDialogData: data }),
}));
