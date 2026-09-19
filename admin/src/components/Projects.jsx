import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
  FolderKanban,
  Globe,
  Github,
  Youtube,
  Star,
  Search,
  Filter,
  Image as ImageIcon,
  Calendar,
  Tag,
  Award,
  Eye,
} from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "frontend",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    youtubeUrl: "",
    featured: false,
    year: new Date().getFullYear().toString(),
    status: "Completed",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const onRefresh = () => load();
    window.addEventListener("app:refresh", onRefresh);
    return () => window.removeEventListener("app:refresh", onRefresh);
  }, []);

  const startCreate = () => {
    setEditing("new");
    setForm({
      title: "",
      category: "frontend",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      youtubeUrl: "",
      featured: false,
      year: new Date().getFullYear().toString(),
      status: "Completed",
      image: "",
    });
  };
  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || "",
      category: p.category || "frontend",
      description: p.description || "",
      technologies: (p.technologies || []).join(", "),
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      youtubeUrl: p.youtubeUrl || "",
      featured: p.featured || false,
      year: p.year || new Date().getFullYear().toString(),
      status: p.status || "Completed",
      image: p.image || "",
    });
  };

  const save = async () => {
    try {
      const technologies = form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (editing === "new") {
        const res = await axios.post("/projects", { ...form, technologies });
        setProjects((s) => [res.data, ...s]);
        alert("Project created successfully!");
      } else {
        const res = await axios.put(`/projects/${editing}`, {
          ...form,
          technologies,
        });
        setProjects((s) => s.map((p) => (p._id === editing ? res.data : p)));
        alert("Project updated successfully!");
      }
      setEditing(null);
    } catch (err) {
      console.error("Save project error", err);
      alert(err.response?.data?.message || "Failed to save project. Please try again.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/projects/${id}`);
      setProjects((s) => s.filter((p) => p._id !== id));
      alert("Project deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete project. Please try again.");
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "frontend", "content", "fullstack", "mobile"];

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
            <FolderKanban className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading your projects...
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Projects
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your portfolio projects
                </p>
              </div>
            </div>
            <motion.button
              onClick={startCreate}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="text-center md:text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredProjects.length}
                  </p>
                  <p className="text-sm text-gray-600">Projects found</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                }}
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 overflow-hidden"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </div>
                  </div>
                )}

                {/* Project Image */}
                <div className="h-48 relative overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                        >
                          <Globe className="w-5 h-5 text-gray-700" />
                        </motion.a>
                      )}
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                        >
                          <Github className="w-5 h-5 text-gray-700" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span className="capitalize">{project.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.year}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {project.status}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => startEdit(project)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm hover:shadow-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      onClick={() => remove(project._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm hover:shadow-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first project"}
            </p>
            {!searchTerm && filterCategory === "all" && (
              <motion.button
                onClick={startCreate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Project</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(editing === "new" || editing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/60"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-r ${
                        editing === "new"
                          ? "from-blue-500 to-cyan-500"
                          : "from-green-500 to-emerald-500"
                      }`}
                    >
                      {editing === "new" ? (
                        <Plus className="w-6 h-6 text-white" />
                      ) : (
                        <Edit className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editing === "new"
                          ? "Create New Project"
                          : "Edit Project"}
                      </h2>
                      <p className="text-gray-600">
                        {editing === "new"
                          ? "Add a new project to your portfolio"
                          : "Update your project details"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setEditing(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>Project Title</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        required
                        placeholder="Enter project title..."
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="content">Content</option>
                          <option value="fullstack">Full Stack</option>
                          <option value="mobile">Mobile</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={form.status}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Upcoming">Upcoming</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        value={form.year}
                        onChange={(e) =>
                          setForm({ ...form, year: e.target.value })
                        }
                        required
                        placeholder="2024"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm({ ...form, featured: e.target.checked })
                        }
                        className="w-5 h-5 text-yellow-600 focus:ring-yellow-500 rounded"
                      />
                      <label
                        htmlFor="featured"
                        className="flex items-center space-x-2 text-sm font-semibold text-gray-700"
                      >
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span>Feature this project</span>
                      </label>
                    </div>
                  </div>

                  {/* URLs and Image */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Image URL</span>
                      </label>
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        required
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Live URL</span>
                      </label>
                      <input
                        type="url"
                        value={form.liveUrl}
                        onChange={(e) =>
                          setForm({ ...form, liveUrl: e.target.value })
                        }
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Github className="w-4 h-4" />
                        <span>GitHub URL</span>
                      </label>
                      <input
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) =>
                          setForm({ ...form, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/username/repo"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Description and Technologies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      required
                      rows="4"
                      placeholder="Describe your project..."
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Technologies (comma separated)
                    </label>
                    <textarea
                      value={form.technologies}
                      onChange={(e) =>
                        setForm({ ...form, technologies: e.target.value })
                      }
                      rows="4"
                      placeholder="React, Node.js, MongoDB..."
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {editing === "new" ? "Create Project" : "Update Project"}
                    </span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditing(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
