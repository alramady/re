import { useI18n } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingUp, Users, Building2, Calendar, CreditCard,
  Loader2, Shield, ArrowLeft, Activity, PieChart as PieChartIcon,
  Home, Wrench, AlertTriangle, DollarSign, Eye, Clock
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import { useMemo, useState } from "react";

const COLORS = ["#3ECFC0", "#C9A96E", "#0B1E2D", "#6366f1", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#3ECFC0",
  active: "#10b981",
  completed: "#6366f1",
  cancelled: "#f43f5e",
  rejected: "#ef4444",
};

export default function AdminAnalytics() {
  const { t, lang } = useI18n();
  const { user, isAuthenticated, loading } = useAuth();
  const [timeRange, setTimeRange] = useState(12);

  const analytics = trpc.admin.analytics.useQuery(
    { months: timeRange },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const stats = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const isRtl = lang === "ar";

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (!isAuthenticated) { window.location.href = getLoginUrl(); return null; }
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-20 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-heading font-bold mb-2">{lang === "ar" ? "غير مصرح" : "Unauthorized"}</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const data = analytics.data;

  // Format month labels
  const formatMonth = (month: string) => {
    if (!month) return "";
    const [y, m] = month.split("-");
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { month: "short", year: "2-digit" });
  };

  // Property type labels
  const typeLabels: Record<string, { ar: string; en: string }> = {
    apartment: { ar: "شقة", en: "Apartment" },
    villa: { ar: "فيلا", en: "Villa" },
    studio: { ar: "استوديو", en: "Studio" },
    duplex: { ar: "دوبلكس", en: "Duplex" },
    furnished_room: { ar: "غرفة مفروشة", en: "Furnished Room" },
    compound: { ar: "مجمع سكني", en: "Compound" },
    hotel_apartment: { ar: "شقة فندقية", en: "Hotel Apartment" },
  };

  const statusLabels: Record<string, { ar: string; en: string }> = {
    pending: { ar: "قيد الانتظار", en: "Pending" },
    approved: { ar: "معتمد", en: "Approved" },
    active: { ar: "نشط", en: "Active" },
    completed: { ar: "مكتمل", en: "Completed" },
    cancelled: { ar: "ملغي", en: "Cancelled" },
    rejected: { ar: "مرفوض", en: "Rejected" },
    open: { ar: "مفتوح", en: "Open" },
    assigned: { ar: "معين", en: "Assigned" },
    in_progress: { ar: "قيد التنفيذ", en: "In Progress" },
    resolved: { ar: "تم الحل", en: "Resolved" },
    closed: { ar: "مغلق", en: "Closed" },
  };

  const urgencyLabels: Record<string, { ar: string; en: string }> = {
    low: { ar: "منخفض", en: "Low" },
    medium: { ar: "متوسط", en: "Medium" },
    high: { ar: "عالي", en: "High" },
    critical: { ar: "حرج", en: "Critical" },
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SEOHead title="Analytics" titleAr="التحليلات" path="/admin/analytics" noindex />
      <Navbar />
      <div className="container py-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                {lang === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {lang === "ar" ? "تحليلات شاملة للمنصة" : "Comprehensive platform analytics"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[3, 6, 12].map((m) => (
              <Button
                key={m}
                variant={timeRange === m ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(m)}
              >
                {m} {lang === "ar" ? "شهر" : "mo"}
              </Button>
            ))}
          </div>
        </div>

        {analytics.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-[#3ECFC0]/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#3ECFC0]/20">
                      <Users className="h-5 w-5 text-[#3ECFC0]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.data?.userCount ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي المستخدمين" : "Total Users"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-[#C9A96E]/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#C9A96E]/20">
                      <Building2 className="h-5 w-5 text-[#C9A96E]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.data?.activeProperties ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? "عقارات نشطة" : "Active Properties"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-[#6366f1]/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#6366f1]/20">
                      <Calendar className="h-5 w-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.data?.activeBookings ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? "حجوزات نشطة" : "Active Bookings"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-[#10b981]/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#10b981]/20">
                      <DollarSign className="h-5 w-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{Number(stats.data?.totalRevenue ?? 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي الإيرادات (ر.س)" : "Total Revenue (SAR)"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Occupancy Rate + Pending */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Activity className="h-5 w-5 text-[#3ECFC0] mx-auto mb-1" />
                  <p className="text-3xl font-bold text-[#3ECFC0]">{data?.occupancy?.occupancyRate ?? 0}%</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "نسبة الإشغال" : "Occupancy Rate"}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Clock className="h-5 w-5 text-[#f59e0b] mx-auto mb-1" />
                  <p className="text-3xl font-bold text-[#f59e0b]">{stats.data?.pendingProperties ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "بانتظار الموافقة" : "Pending Approval"}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Eye className="h-5 w-5 text-[#6366f1] mx-auto mb-1" />
                  <p className="text-3xl font-bold text-[#6366f1]">{stats.data?.bookingCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي الحجوزات" : "Total Bookings"}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <Home className="h-5 w-5 text-[#C9A96E] mx-auto mb-1" />
                  <p className="text-3xl font-bold text-[#C9A96E]">{stats.data?.propertyCount ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{lang === "ar" ? "إجمالي العقارات" : "Total Properties"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1: Bookings & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bookings Over Time */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#3ECFC0]" />
                    {lang === "ar" ? "الحجوزات الشهرية" : "Monthly Bookings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.bookingsByMonth) && data.bookingsByMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data.bookingsByMonth.map((d: any) => ({ ...d, monthLabel: formatMonth(d.month) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="activeCount" name={lang === "ar" ? "نشط" : "Active"} fill="#10b981" radius={[4,4,0,0]} />
                        <Bar dataKey="completedCount" name={lang === "ar" ? "مكتمل" : "Completed"} fill="#6366f1" radius={[4,4,0,0]} />
                        <Bar dataKey="pendingCount" name={lang === "ar" ? "قيد الانتظار" : "Pending"} fill="#f59e0b" radius={[4,4,0,0]} />
                        <Bar dataKey="cancelledCount" name={lang === "ar" ? "ملغي" : "Cancelled"} fill="#f43f5e" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات حجوزات" : "No booking data"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Over Time */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#C9A96E]" />
                    {lang === "ar" ? "الإيرادات الشهرية (ر.س)" : "Monthly Revenue (SAR)"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.revenueByMonth) && data.revenueByMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={data.revenueByMonth.map((d: any) => ({ ...d, monthLabel: formatMonth(d.month), revenue: Number(d.revenue) }))}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name={lang === "ar" ? "الإيرادات" : "Revenue"} stroke="#C9A96E" fill="url(#revenueGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات إيرادات" : "No revenue data"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2: Users & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Registrations */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#6366f1]" />
                    {lang === "ar" ? "تسجيلات المستخدمين" : "User Registrations"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.userRegistrations) && data.userRegistrations.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={data.userRegistrations.map((d: any) => ({ ...d, monthLabel: formatMonth(d.month) }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Line type="monotone" dataKey="count" name={lang === "ar" ? "الإجمالي" : "Total"} stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="tenantCount" name={lang === "ar" ? "مستأجرين" : "Tenants"} stroke="#3ECFC0" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="landlordCount" name={lang === "ar" ? "ملاك" : "Landlords"} stroke="#C9A96E" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات تسجيل" : "No registration data"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Status Distribution */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-[#f59e0b]" />
                    {lang === "ar" ? "توزيع حالات الحجوزات" : "Booking Status Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.bookingStatusDist) && data.bookingStatusDist.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={data.bookingStatusDist.map((d: any) => ({
                            name: statusLabels[d.status]?.[lang] ?? d.status,
                            value: Number(d.count),
                            fill: STATUS_COLORS[d.status] ?? "#94a3b8",
                          }))}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.bookingStatusDist.map((_: any, i: number) => (
                            <Cell key={i} fill={STATUS_COLORS[data.bookingStatusDist[i].status] ?? COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات" : "No data"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 3: Properties by Type & City */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Properties by Type */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#3ECFC0]" />
                    {lang === "ar" ? "العقارات حسب النوع" : "Properties by Type"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.propertiesByType) && data.propertiesByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data.propertiesByType.map((d: any) => ({
                        name: typeLabels[d.propertyType]?.[lang] ?? d.propertyType,
                        count: Number(d.count),
                      }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name={lang === "ar" ? "العدد" : "Count"} fill="#3ECFC0" radius={[0,4,4,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات" : "No data"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Properties by City */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-4 w-4 text-[#C9A96E]" />
                    {lang === "ar" ? "العقارات حسب المدينة" : "Properties by City"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.propertiesByCity) && data.propertiesByCity.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={data.propertiesByCity.map((d: any) => ({
                            name: lang === "ar" ? (d.cityAr || d.city) : d.city,
                            value: Number(d.count),
                          }))}
                          cx="50%" cy="50%"
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.propertiesByCity.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بيانات" : "No data"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 4: Services & Maintenance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Service Requests */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-[#6366f1]" />
                    {lang === "ar" ? "طلبات الخدمات" : "Service Requests"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.serviceRequests) && data.serviceRequests.length > 0 ? (
                    <div className="space-y-3">
                      {data.serviceRequests.map((sr: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Badge variant={sr.status === "completed" ? "default" : sr.status === "pending" ? "secondary" : "outline"}>
                              {statusLabels[sr.status]?.[lang] ?? sr.status}
                            </Badge>
                          </div>
                          <div className="text-end">
                            <p className="font-bold">{Number(sr.count)}</p>
                            <p className="text-xs text-muted-foreground">{Number(sr.totalValue).toLocaleString()} {lang === "ar" ? "ر.س" : "SAR"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد طلبات خدمات" : "No service requests"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency Maintenance */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#f43f5e]" />
                    {lang === "ar" ? "طوارئ الصيانة" : "Emergency Maintenance"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(data?.maintenanceSummary) && data.maintenanceSummary.length > 0 ? (
                    <div className="space-y-3">
                      {data.maintenanceSummary.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Badge variant={m.status === "resolved" || m.status === "closed" ? "default" : m.urgency === "critical" ? "destructive" : "secondary"}>
                              {statusLabels[m.status]?.[lang] ?? m.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {urgencyLabels[m.urgency]?.[lang] ?? m.urgency}
                            </span>
                          </div>
                          <p className="font-bold">{Number(m.count)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      {lang === "ar" ? "لا توجد بلاغات صيانة" : "No maintenance reports"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top Properties Table */}
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#10b981]" />
                  {lang === "ar" ? "أفضل العقارات أداءً" : "Top Performing Properties"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(data?.topProperties) && data.topProperties.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-start p-2 font-medium text-muted-foreground">{lang === "ar" ? "العقار" : "Property"}</th>
                          <th className="text-start p-2 font-medium text-muted-foreground">{lang === "ar" ? "المدينة" : "City"}</th>
                          <th className="text-center p-2 font-medium text-muted-foreground">{lang === "ar" ? "الإيجار" : "Rent"}</th>
                          <th className="text-center p-2 font-medium text-muted-foreground">{lang === "ar" ? "الحجوزات" : "Bookings"}</th>
                          <th className="text-center p-2 font-medium text-muted-foreground">{lang === "ar" ? "المشاهدات" : "Views"}</th>
                          <th className="text-end p-2 font-medium text-muted-foreground">{lang === "ar" ? "الإيرادات" : "Revenue"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topProperties.map((p: any, i: number) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="p-2 font-medium">
                              <Link href={`/property/${p.id}`} className="text-primary hover:underline">
                                {lang === "ar" ? p.titleAr : p.titleEn}
                              </Link>
                            </td>
                            <td className="p-2 text-muted-foreground">{lang === "ar" ? (p.cityAr || p.city) : p.city}</td>
                            <td className="p-2 text-center">{Number(p.monthlyRent).toLocaleString()} {lang === "ar" ? "ر.س" : "SAR"}</td>
                            <td className="p-2 text-center">{Number(p.bookingCount)}</td>
                            <td className="p-2 text-center">{Number(p.viewCount ?? 0).toLocaleString()}</td>
                            <td className="p-2 text-end font-bold text-[#10b981]">{Number(p.totalRevenue).toLocaleString()} {lang === "ar" ? "ر.س" : "SAR"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    {lang === "ar" ? "لا توجد بيانات عقارات" : "No property data"}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#8b5cf6]" />
                  {lang === "ar" ? "النشاط الأخير" : "Recent Activity"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(data?.recentActivity) && data.recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {data.recentActivity.map((a: any, i: number) => {
                      const typeIcons: Record<string, any> = {
                        booking: <Calendar className="h-4 w-4 text-[#3ECFC0]" />,
                        payment: <CreditCard className="h-4 w-4 text-[#C9A96E]" />,
                        user: <Users className="h-4 w-4 text-[#6366f1]" />,
                        property: <Building2 className="h-4 w-4 text-[#10b981]" />,
                      };
                      const typeNames: Record<string, { ar: string; en: string }> = {
                        booking: { ar: "حجز", en: "Booking" },
                        payment: { ar: "دفعة", en: "Payment" },
                        user: { ar: "مستخدم", en: "User" },
                        property: { ar: "عقار", en: "Property" },
                      };
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          {typeIcons[a.type] ?? <Activity className="h-4 w-4" />}
                          <div className="flex-1">
                            <span className="font-medium text-sm">
                              {typeNames[a.type]?.[lang] ?? a.type} #{a.id}
                            </span>
                            <Badge variant="outline" className="ms-2 text-xs">
                              {statusLabels[a.detail]?.[lang] ?? a.detail}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(a.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    {lang === "ar" ? "لا يوجد نشاط حديث" : "No recent activity"}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
