import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  RefreshCw,
  X,
  Save,
} from "lucide-react";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    level: 50,
    category: "development",
    icon: "💻",
    color: "blue",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("level-desc");
  const [saving, setSaving] = useState(false);

  const categories = [
    { value: "development", label: "Development", gradient: "from-blue-500 to-cyan-500" },
    { value: "content", label: "Content", gradient: "from-purple-500 to-pink-500" },
  ];

  const colors = [
    { value: "blue", label: "Blue", class: "from-blue-500 to-cyan-500" },
    { value: "purple", label: "Purple", class: "from-purple-500 to-pink-500" },
    { value: "green", label: "Green", class: "from-green-500 to-emerald-500" },
    { value: "orange", label: "Orange", class: "from-orange-500 to-red-500" },
    { value: "indigo", label: "Indigo", class: "from-indigo-500 to-purple-500" },
  ];

  const icons = ["💻", "⚛️", "🔧", "🎨", "📱", "🌐", "🛠️", "⚡", "🚀", "📊", "🎬", "✍️"];

  useEffect(() => {
    loadSkills();
    const onRefresh = () => loadSkills();
    window.addEventListener("app:refresh", onRefresh);
    return () => window.removeEventListener("app:refresh", onRefresh);
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/skills");
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error loading skills:", error);
      alert("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedSkills = skills
    .filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || skill.category === categoryFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "level-desc":
          return b.level - a.level;
        case "level-asc":
          return a.level - b.level;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const startEdit = (skill) => {
    setEditing(skill._id);
    setForm({
      name: skill.name || "",
      level: skill.level || 50,
      category: skill.category || "development",
      icon: skill.icon || "💻",
      color: skill.color || "blue",
    });
  };

  const startNew = () => {
    setEditing("new");
    setForm({
      name: "",
      level: 50,
      category: "development",
      icon: "💻",
      color: "blue",
    });
  };

  const saveSkill = async () => {
    if (!form.name.trim()) {
      alert("Please enter a skill name");
      return;
    }

    setSaving(true);
    try {
      if (editing === "new") {
        await axios.post("/skills", form);
      } else {
        await axios.put(`/skills/${editing}`, form);
      }
      await loadSkills();
      setEditing(null);
      alert(editing === "new" ? "Skill created successfully!" : "Skill updated successfully!");
    } catch (error) {
      console.error("Error saving skill:", error);
      alert(error.response?.data?.message || "Failed to save skill. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      await axios.delete(`/skills/${id}`);
      await loadSkills();
      alert("Skill deleted successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert(error.response?.data?.message || "Failed to delete skill. Please try again.");
    }
  };

  const getProficiency = (level) => {
    if (level >= 90) return { label: "Expert", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" };
    if (level >= 75) return { label: "Advanced", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" };
    if (level >= 60) return { label: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" };
    return { label: "Beginner", color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-700" };
  };

  const SkillCard = ({ skill }) => {
    const proficiency = getProficiency(skill.level);
    const colorClass = colors.find((c) => c.value === skill.color)?.class || colors[0].class;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl p-3 bg-gradient-to-r ${colorClass} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
              {skill.icon || "💻"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {skill.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${proficiency.bg} ${proficiency.color}`}>
                  {proficiency.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {skill.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <motion.button
              onClick={() => startEdit(skill)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => deleteSkill(skill._id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Proficiency</span>
            <span className="font-bold text-gray-900 dark:text-white">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${colorClass} shadow-lg`}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading && skills.length === 0) {
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
            <Code className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading skills...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Animated background */}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Skills Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Manage your technical skills and expertise
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={loadSkills}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                onClick={startNew}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-5 h-5" />
                <span>Add Skill</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Skills",
              value: skills.length,
              icon: Code,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              label: "Advanced Skills",
              value: skills.filter((s) => s.level >= 75).length,
              icon: TrendingUp,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              label: "Categories",
              value: categories.length,
              icon: Award,
              gradient: "from-purple-500 to-pink-500",
            },
            {
              label: "Avg. Proficiency",
              value: skills.length > 0
                ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)
                : 0,
              icon: Zap,
              gradient: "from-orange-500 to-red-500",
              suffix: "%",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 dark:border-gray-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="level-desc">Level: High to Low</option>
              <option value="level-asc">Level: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </motion.div>

        {/* Skills Grid */}
        {filteredAndSortedSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-gray-700/50 shadow-lg"
          >
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
              {searchTerm || categoryFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Start building your skills portfolio by adding your first skill."}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <motion.button
                onClick={startNew}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-lg font-medium shadow-lg shadow-blue-500/25"
              >
                Add Your First Skill
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSkills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editing === "new" ? "Add New Skill" : "Edit Skill"}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., React.js, Node.js"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {icons.map((icon) => (
                      <motion.button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-xl text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all ${
                          form.icon === icon
                            ? "bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-500"
                            : "border border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {icon}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        onClick={() => setForm({ ...form, color: color.value })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`h-10 rounded-xl bg-gradient-to-r ${color.class} ${
                          form.color === color.value
                            ? "ring-4 ring-blue-500 ring-offset-2"
                            : ""
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Proficiency Level: {form.level}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                <motion.button
                  onClick={saveSkill}
                  disabled={saving || !form.name.trim()}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editing === "new" ? "Create Skill" : "Update Skill"}</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setEditing(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
