import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  MessageSquare,
  Calendar,
  Trash2,
  CheckCircle,
  Search,
  Filter,
  Archive,
  RefreshCw,
  Eye,
  EyeOff,
  Reply,
  Star,
  Sparkles,
  MailOpen,
  MailWarning,
  Send,
} from "lucide-react";

export default function Contacts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchTerm, filter, contacts]);

  // read search param on mount / when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchTerm(q);
  }, [location.search]);

  // push search to URL (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      const qs = params.toString();
      navigate(
        { pathname: "/contacts", search: qs ? `?${qs}` : "" },
        { replace: true }
      );
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
    // remove search param from URL
    const params = new URLSearchParams(location.search);
    params.delete("search");
    const qs = params.toString();
    navigate(
      { pathname: "/contacts", search: qs ? `?${qs}` : "" },
      { replace: true }
    );
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get("/contacts");
      setContacts(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  // Listen for global refresh events
  useEffect(() => {
    const onRefresh = () => {
      setLoading(true);
      fetchContacts();
    };
    window.addEventListener("app:refresh", onRefresh);
    return () => window.removeEventListener("app:refresh", onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterContacts = () => {
    let filtered = contacts;

    if (filter === "unread") {
      filtered = filtered.filter((contact) => !contact.read);
    } else if (filter === "read") {
      filtered = filtered.filter((contact) => contact.read);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/contacts/${id}`, { read: true });
      fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
      alert(error.response?.data?.message || "Failed to mark as read. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`/contacts/${id}`);
        fetchContacts();
        alert("Contact deleted successfully!");
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert(error.response?.data?.message || "Failed to delete contact. Please try again.");
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (window.confirm("Mark all as read?")) {
      try {
        const unreadContacts = contacts.filter((c) => !c.read);
        if (unreadContacts.length === 0) {
          alert("No unread messages to mark.");
          return;
        }
        await Promise.all(
          unreadContacts.map((contact) =>
            axios.put(`/contacts/${contact._id}`, { read: true })
          )
        );
        fetchContacts();
        alert(`${unreadContacts.length} message(s) marked as read!`);
      } catch (error) {
        console.error("Error marking all as read:", error);
        alert(error.response?.data?.message || "Failed to mark all as read. Please try again.");
      }
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestResult(null);
    try {
      const response = await axios.post("/contacts/test-email");
      setEmailTestResult({
        success: true,
        message: response.data.message || "Test email sent successfully!",
        details: response.data,
      });
      setTimeout(() => setEmailTestResult(null), 5000);
    } catch (error) {
      setEmailTestResult({
        success: false,
        message: error.response?.data?.message || "Failed to send test email",
        error: error.response?.data?.error,
        tip: error.response?.data?.tip,
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = contacts.filter((c) => !c.read).length;
  const stats = [
    {
      label: "Total Messages",
      value: contacts.length,
      color: "from-blue-500 to-cyan-500",
      icon: Mail,
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      label: "Unread Messages",
      value: unreadCount,
      color: "from-orange-500 to-red-500",
      icon: MailWarning,
      bgColor: "from-orange-500/10 to-red-500/10",
      highlight: unreadCount > 0,
    },
    {
      label: "Read Messages",
      value: contacts.length - unreadCount,
      color: "from-green-500 to-emerald-500",
      icon: MailOpen,
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
  ];

  const filterTabs = [
    {
      key: "all",
      label: "All Messages",
      icon: Archive,
      count: contacts.length,
    },
    { key: "unread", label: "Unread", icon: Eye, count: unreadCount },
    {
      key: "read",
      label: "Read",
      icon: CheckCircle,
      count: contacts.length - unreadCount,
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
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading your messages...
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Contact Messages
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and respond to incoming messages
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleTestEmail}
                disabled={testingEmail}
                whileHover={{ scale: testingEmail ? 1 : 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testingEmail ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Test Email</span>
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={fetchContacts}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 text-gray-700 px-4 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Email Test Result */}
          {emailTestResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-4 rounded-xl ${
                emailTestResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start space-x-3">
                {emailTestResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <MailWarning className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      emailTestResult.success
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {emailTestResult.message}
                  </p>
                  {emailTestResult.error && (
                    <p className="text-sm text-red-600 mt-1">
                      {emailTestResult.error}
                    </p>
                  )}
                  {emailTestResult.tip && (
                    <p className="text-sm text-gray-600 mt-2">
                      {emailTestResult.tip}
                    </p>
                  )}
                  {emailTestResult.success &&
                    emailTestResult.details?.messageId && (
                      <p className="text-sm text-gray-600 mt-1">
                        Check your inbox ({emailTestResult.details.config?.to})
                        for the test email.
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 relative overflow-hidden group ${
                  stat.highlight ? "ring-2 ring-orange-500/50" : ""
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Progress indicator for unread */}
                  {stat.highlight && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(stat.value / contacts.length) * 100}%`,
                        }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search Messages</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter Messages</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterTabs.map((item) => (
                    <motion.button
                      key={item.key}
                      onClick={() => setFilter(item.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all relative overflow-hidden group ${
                        filter === item.key
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-white/50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          filter === item.key
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex justify-end"
              >
                <motion.button
                  onClick={handleMarkAllAsRead}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark All as Read ({unreadCount})</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredContacts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-12 text-center"
              >
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {contacts.length === 0
                    ? "No Messages Yet"
                    : "No Messages Found"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {contacts.length === 0
                    ? "You haven't received any contact messages yet. They will appear here once people start reaching out."
                    : "No messages match your current search or filter criteria. Try adjusting your filters."}
                </p>
              </motion.div>
            ) : (
              filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/60 overflow-hidden group ${
                    !contact.read ? "ring-2 ring-blue-500/30" : ""
                  }`}
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex flex-wrap items-start gap-4 mb-4">
                          {/* Avatar and Sender Info */}
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-3 rounded-xl ${
                                !contact.read
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                              }`}
                            >
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-bold text-gray-900 text-lg">
                                  {contact.name}
                                </p>
                                {!contact.read && (
                                  <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>New</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600">{contact.email}</p>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(contact.createdAt)}</span>
                          </div>
                        </div>

                        {/* Subject and Message Preview */}
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {contact.subject}
                          </h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-3">
                            {contact.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      {!contact.read && (
                        <motion.button
                          onClick={() => handleMarkAsRead(contact._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Read</span>
                        </motion.button>
                      )}

                      <motion.a
                        href={`mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hi ${contact.name},%0D%0A%0D%0AThanks for reaching out!%0D%0A%0D%0A`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all text-sm"
                      >
                        <Reply className="w-4 h-4" />
                        <span>Reply</span>
                      </motion.a>

                      <motion.button
                        onClick={() => handleDelete(contact._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
