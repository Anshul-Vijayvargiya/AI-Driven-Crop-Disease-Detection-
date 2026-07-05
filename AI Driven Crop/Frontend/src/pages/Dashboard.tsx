import {
  Scan,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Cloud,
  DollarSign,
  Calendar,
  Eye,
  Leaf,
  LogOut,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  stats: {
    totalScans: number;
    diseasesDetected: number;
    healthyCrops: number;
    accuracyRate: number;
  };
  recentDetections: any[];
  diseaseData: any[];
  monthlyData: any[];
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setUser(null); // guest mode
      setLoading(false);
      return;
    }
    
    // Fetch user and stats
    Promise.all([
      apiClient.get("/auth/me"),
      apiClient.get("/dashboard/stats")
    ])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data.user || userRes.data);
        setDashboardData(statsRes.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onNavigate("login");
  };

  const tips = [
    "Regular monitoring helps detect diseases early",
    "Ensure proper drainage to prevent fungal infections",
    "Rotate crops every season to reduce disease risk",
    "Apply organic fertilizers for stronger plant immunity",
  ];

  const defaultStats = [
    {
      label: "Total Scans",
      value: dashboardData?.stats.totalScans.toString() || "0",
      change: "+0%",
      icon: Scan,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Diseases Detected",
      value: dashboardData?.stats.diseasesDetected.toString() || "0",
      change: "-0%",
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      label: "Healthy Crops",
      value: dashboardData?.stats.healthyCrops.toString() || "0",
      change: "+0%",
      icon: CheckCircle,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Accuracy Rate",
      value: `${dashboardData?.stats.accuracyRate || 0}%`,
      change: "+0%",
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const recentDetections = dashboardData?.recentDetections || [];
  const diseaseData = dashboardData?.diseaseData || [];
  const monthlyData = dashboardData?.monthlyData || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">
                {user ? `Welcome, ${user.name} 👩‍🌾` : "Dashboard"}
              </h1>
              <p className="text-xl text-gray-600">
                {user
                  ? `Role: ${user.role} • Here are your agricultural insights`
                  : "Welcome back! Here's your agricultural insights overview"}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="size-5" />
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {defaultStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`size-6 ${stat.textColor}`} />
                    </div>
                    <span
                      className={`text-sm ${
                        stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-xl p-8 mb-8 text-white">
            <h2 className="mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onNavigate("detect")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all text-left group"
              >
                <Scan className="size-8 mb-3 group-hover:scale-110 transition-transform" />
                <div className="mb-2">New Detection</div>
                <div className="text-sm text-green-100">Upload crop image for analysis</div>
              </button>
              <button
                onClick={() => onNavigate("weather")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all text-left group"
              >
                <Cloud className="size-8 mb-3 group-hover:scale-110 transition-transform" />
                <div className="mb-2">Check Weather</div>
                <div className="text-sm text-green-100">View forecast and alerts</div>
              </button>
              <button
                onClick={() => onNavigate("mandi")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all text-left group"
              >
                <DollarSign className="size-8 mb-3 group-hover:scale-110 transition-transform" />
                <div className="mb-2">Market Prices</div>
                <div className="text-sm text-green-100">View latest Mandi rates</div>
              </button>
            </div>
          </div>

          {/* Recent Detections */}
<div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 mb-8">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-gray-900">Recent Detections</h2>
    <button
      onClick={() => onNavigate("detect")}
      className="text-sm text-green-600 hover:text-green-700"
    >
      View All
    </button>
  </div>
  <div className="space-y-4">
    {recentDetections.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        No recent detections found. Start scanning your crops!
      </div>
    ) : (
      recentDetections.map((detection) => (
      <div
        key={detection.id}
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf className="size-6 text-green-600" />
        </div>

        {/* Disease + Crop Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-900">{detection.disease}</span>
            {detection.severity !== "None" && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${getSeverityColor(
                  detection.severity
                )}`}
              >
                {detection.severity}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {detection.crop} • {detection.confidence}% confidence
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="size-4" />
          <span>
            {(() => {
              const d = new Date(detection.date);
              return isNaN(d.getTime()) 
                ? detection.date 
                : d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            })()}
          </span>
        </div>

        {/* Action button */}
        <button className="p-2 hover:bg-white rounded-lg transition-colors">
          <Eye className="size-5 text-gray-600" />
        </button>
      </div>
    )))}
  </div>
</div>
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="size-5" />
              <h3>Current Weather</h3>
            </div>
            <div className="text-5xl mb-2">28°</div>
            <div className="text-blue-100 mb-4">Partly Cloudy</div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Humidity</span>
                <span>65%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">Wind</span>
                <span>12 km/h</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate("weather")}
              className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              View Full Forecast
            </button>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Disease Frequency Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-900 mb-6">Disease Distribution</h2>
              {diseaseData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available yet
                </div>
              ) : (
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              )}
            </div>

            {/* Monthly Scans Line Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-gray-900 mb-6">Monthly Scan Activity</h2>
              {monthlyData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available yet
                </div>
              ) : (
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 5 }}
                      name="Scans"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              )}
            </div>
          </div>

          {/* Tips of the Day */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-8 border border-amber-200">
            <h2 className="text-gray-900 mb-6">Farming Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-lg p-4"
                >
                  <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="size-5 text-amber-600" />
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}