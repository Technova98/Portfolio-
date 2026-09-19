import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Moon,
  Sun,
  LogOut,
  Search,
  User,
  Bell,
  Settings,
  ChevronDown,
  Sparkles,
  Zap,
  Mail,
  RefreshCw, // <--- added
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // added import

const Header = ({ admin, onMenuClick, onLogout }) => {
  const [dark, setDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // added

  const adminInfo = useMemo(
    () => ({
      username: admin?.username || "Admin User",
      fullName: admin?.fullName,
      email: admin?.email || "admin@example.com",
      avatarUrl: admin?.avatarUrl || null,
    }),
    [admin]
  );

  const displayName = adminInfo.fullName || adminInfo.username || "Admin User";

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock notifications - in real app, this would be an API call
    setNotifications([
      {
        id: 1,
        type: "message",
        title: "New contact message",
        time: "2 min ago",
        read: false,
      },
      {
        id: 2,
        type: "system",
        title: "System update available",
        time: "1 hour ago",
        read: true,
      },
      {
        id: 3,
        type: "project",
        title: "Project published",
        time: "3 hours ago",
        read: true,
      },
    ]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // navigate to contacts with search query so admin panel can react
    if (searchQuery && searchQuery.trim().length > 0) {
      navigate(`/contacts?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/contacts");
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Dispatch global refresh event so pages can reload data without full page reload
  const handleGlobalRefresh = () => {
    try {
      window.dispatchEvent(new CustomEvent("app:refresh"));
    } catch (e) {
      // fallback to hard reload if CustomEvent fails
      window.location.reload();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-sm">
      <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
          onClick={onMenuClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </motion.button>

        {/* Brand Logo */}
        <motion.div
          className="hidden lg:flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent text-sm">
              Admin Panel
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Portfolio Management
            </span>
          </div>
        </motion.div>

        <div className="flex-1" />

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/50 dark:bg-slate-800/50 rounded-xl px-3 py-2 w-full max-w-sm ring-1 ring-slate-200 dark:ring-slate-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, messages, settings..."
            className="bg-transparent outline-none px-2 text-sm w-full text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </motion.form>

        {/* Notifications */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              notification.type === "message"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : notification.type === "system"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            }`}
                          >
                            {notification.type === "message" && (
                              <Mail className="w-4 h-4" />
                            )}
                            {notification.type === "system" && (
                              <Settings className="w-4 h-4" />
                            )}
                            {notification.type === "project" && (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No notifications
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
          onClick={() => setDark((d) => !d)}
          title="Toggle theme"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {dark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
        </motion.button>

        {/* Admin Profile */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 overflow-hidden ring-2 ring-white/20 dark:ring-slate-700/50 shadow-lg">
              {adminInfo.avatarUrl ? (
                <img
                  src={adminInfo.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {adminInfo.email}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {adminInfo.avatarUrl ? (
                        <img
                          src={adminInfo.avatarUrl}
                          alt={displayName}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {displayName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {adminInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/settings"); // navigate to /settings
                      setShowProfileMenu(false); // close the dropdown
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      // optional: close the menu and navigate to profile edit if you have a route
                      // navigate('/settings/profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-slate-700 dark:text-slate-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Edit Profile</span>
                  </button>
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
