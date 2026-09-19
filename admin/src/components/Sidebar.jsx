import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Mail, Code, User, LogOut, Settings as SettingsIcon, X, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ admin, onLogout, onClose }) => {
  const links = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: FolderKanban, 
      label: 'Projects', 
      path: '/projects',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Mail, 
      label: 'Contacts', 
      path: '/contacts',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Code, 
      label: 'Skills', 
      path: '/skills',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      icon: User, 
      label: 'About', 
      path: '/about',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      icon: SettingsIcon, 
      label: 'Settings', 
      path: '/settings',
      gradient: 'from-gray-600 to-gray-400'
    }
  ];

  const displayName = admin?.fullName || admin?.username || 'Admin User';
  const avatarUrl = admin?.avatarUrl;

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col h-full relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Portfolio
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Profile Mini */}
      <div className="px-4 py-3 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full rounded-lg object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=32`;
              }}
            />
          ) : (
            <span className="text-xs">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
            {displayName}
            </p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/25"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 relative z-10">
        {links.map((link, index) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-lg`
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <link.icon className="w-4 h-4 relative z-10" />
              <span className="font-medium text-sm relative z-10">{link.label}</span>
              
              {/* Active indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white opacity-0 group-hover:opacity-100 ${
                  link.gradient.includes('blue') ? 'bg-blue-400' :
                  link.gradient.includes('green') ? 'bg-green-400' :
                  link.gradient.includes('purple') ? 'bg-purple-400' :
                  link.gradient.includes('orange') ? 'bg-orange-400' :
                  link.gradient.includes('indigo') ? 'bg-indigo-400' :
                  'bg-gray-400'
                }`}
              />
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 relative z-10 space-y-2">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:text-red-400 rounded-lg transition-all group hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="w-1.5 h-1.5 bg-red-400 rounded-full ml-auto"
          />
        </motion.button>

        {/* Version info */}
        <div className="px-3 text-center">
          <p className="text-xs text-gray-500">v2.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;