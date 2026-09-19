import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Mail,
  Code,
  MessageSquare,
  Users,
  Award,
  TrendingUp,
  Eye,
  Sparkles,
  Zap,
  Clock,
  CheckCircle,
  ArrowUpRight,
  BarChart3,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    contacts: 0,
    unreadContacts: 0,
    skills: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    fetchStats();
    setTimeOfDay(getTimeOfDay());
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const fetchStats = async () => {
    try {
      const [projects, contacts, unread, skills] = await Promise.all([
        axios.get("/projects"),
        axios.get("/contacts"),
        axios.get("/contacts/unread/count"),
        axios.get("/skills"),
      ]);

      // Simulate some growth for demo
      setStats({
        projects: projects.data.length,
        contacts: contacts.data.length,
        unreadContacts: unread.data.count,
        skills: skills.data.length,
        recentActivity: [
          {
            type: "message",
            message: "New contact message from John Doe",
            time: "2 min ago",
          },
          {
            type: "project",
            message: 'Project "Portfolio v2" was updated',
            time: "1 hour ago",
          },
          {
            type: "system",
            message: "System backup completed",
            time: "3 hours ago",
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FolderKanban,
      label: "Total Projects",
      value: stats.projects,
      change: "+12%",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      description: "Active portfolio projects",
    },
    {
      icon: Mail,
      label: "Total Messages",
      value: stats.contacts,
      change: "+8%",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      description: "All-time messages received",
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: stats.unreadContacts,
      change: stats.unreadContacts > 0 ? "Attention needed" : "All clear",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      description: "Require your attention",
      highlight: stats.unreadContacts > 0,
    },
    {
      icon: Code,
      label: "Skills",
      value: stats.skills,
      change: "+5%",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      description: "Technical skills listed",
    },
  ];

  const quickActions = [
    {
      icon: MessageSquare,
      label: "View Messages",
      description: "Manage contact messages",
      href: "/contacts",
      gradient: "from-blue-500 to-cyan-500",
      stats: `${stats.unreadContacts} unread`,
    },
    {
      icon: FolderKanban,
      label: "Manage Projects",
      description: "Add or edit projects",
      href: "/projects",
      gradient: "from-green-500 to-emerald-500",
      stats: `${stats.projects} active`,
    },
    {
      icon: Award,
      label: "Settings",
      description: "Configure preferences",
      href: "/settings",
      gradient: "from-purple-500 to-pink-500",
      stats: "Customize",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Good {timeOfDay}!
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Welcome to your portfolio dashboard
                  </p>
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden lg:flex items-center space-x-2 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-lg border border-white/60"
            >
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Live</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                y: -5,
              }}
              className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 overflow-hidden group ${
                stat.highlight ? "ring-2 ring-orange-500/50" : ""
              }`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-right"
                  >
                    <p
                      className={`text-sm font-semibold ${
                        stat.change.includes("+")
                          ? "text-green-600"
                          : stat.change.includes("Attention")
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">this month</p>
                  </motion.div>
                </div>

                <p className="text-gray-600 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.description}</p>

                {/* Progress bar for demo */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (stat.value / 20) * 100)}%`,
                    }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className={`h-1 rounded-full bg-gradient-to-r ${stat.gradient}`}
                  />
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.href)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative p-6 bg-gradient-to-br from-white to-gray-50/80 border-2 border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Background on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {action.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                          {action.stats}
                        </span>
                        <div className="text-xs font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">
                          Explore →
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 h-full">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors group"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "message"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "project"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {activity.type === "message" && (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      {activity.type === "project" && (
                        <FolderKanban className="w-4 h-4" />
                      )}
                      {activity.type === "system" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-gray-800 transition-colors">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contacts")}
                className="w-full mt-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-300 border border-gray-300/50"
              >
                View All Activity
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/20"
        >
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              System Performance
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/80 rounded-xl">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="p-4 bg-white/80 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">128ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="p-4 bg-white/80 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">2.4K</div>
              <div className="text-sm text-gray-600">Visits Today</div>
            </div>
            <div className="p-4 bg-white/80 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">94%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
