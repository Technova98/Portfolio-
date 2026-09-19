import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Shield,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Moon,
  Sun,
  Monitor,
  Camera,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  BellRing,
  PaintBucket,
  Cpu,
  Server,
  Download,
  Upload,
  Trash2,
  Edit,
  Calendar,
  FileText,
} from "lucide-react";

const Settings = ({ admin, onAdminUpdated }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    contactMessages: true,
    projectUpdates: false,
    securityAlerts: true,
    weeklyReports: false,
  });
  const [theme, setTheme] = useState("system");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://ui-avatars.com/api/?name=Admin%20User&background=6366f1&color=fff&size=120"
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvInfo, setCvInfo] = useState(null);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [advanced, setAdvanced] = useState({
    apiKey: "sk_live_...",
    webhookUrl: "https://api.yoursite.com/webhook",
    cacheEnabled: true,
    analytics: true,
    backupFrequency: "daily",
  });
  const [form, setForm] = useState({ siteTitle: "", notifyEmail: "" });
  const [loading, setLoading] = useState(true);

  const resolveAssetUrl = useCallback((value) => {
    if (!value) return "";
    return value.startsWith("http")
      ? value
      : `${(axios.defaults.baseURL || "").replace(/\/api$/i, "")}${value}`;
  }, []);

  const applyAdminToProfile = useCallback(
    (adminData) => {
      if (!adminData) return;

      const normalizedAvatar = resolveAssetUrl(adminData.avatarUrl);
      const fallbackAvatar =
        normalizedAvatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          adminData.fullName || adminData.username || "Admin User"
        )}&background=6366f1&color=fff&size=120`;

      setProfile({
        fullName: adminData.fullName || adminData.username || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        location: adminData.location || "",
        website: adminData.website || "",
        bio: adminData.bio || "",
        avatarUrl: normalizedAvatar,
      });

      setAvatarPreview(fallbackAvatar);
    },
    [resolveAssetUrl]
  );

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: BellRing,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: PaintBucket,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: Cpu,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Load settings from backend on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/admin/settings');
        if (response.data) {
          if (response.data.notifications) {
            setNotifications(response.data.notifications);
          }
          if (response.data.theme) {
            setTheme(response.data.theme);
          }
          if (response.data.advanced) {
            setAdvanced(response.data.advanced);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to localStorage if backend fails
        const savedSettings = localStorage.getItem("adminSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setNotifications(settings.notifications || notifications);
          setTheme(settings.theme || theme);
          setAdvanced(settings.advanced || advanced);
          if (settings.profile?.avatar) {
            setAvatarPreview(settings.profile.avatar);
          }
        }
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (admin) {
      applyAdminToProfile(admin);
    }
  }, [admin, applyAdminToProfile]);

  // Load CV info on mount and on refresh
  useEffect(() => {
    const loadCVInfo = async () => {
      try {
        const response = await axios.get('/cv/admin');
        setCvInfo(response.data);
      } catch (error) {
        // CV might not exist yet, that's okay
        if (error.response?.status !== 404) {
          console.error('Error loading CV info:', error);
        }
        setCvInfo(null);
      }
    };
    loadCVInfo();
    
    // Listen for refresh events
    const onRefresh = () => loadCVInfo();
    window.addEventListener('app:refresh', onRefresh);
    return () => window.removeEventListener('app:refresh', onRefresh);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save profile information
      const profilePayload = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        website: profile.website,
        bio: profile.bio,
      };

      const profileResponse = await axios.put("/auth/profile", profilePayload);
      const updatedAdmin = profileResponse.data;

      applyAdminToProfile(updatedAdmin);
      onAdminUpdated?.(updatedAdmin);

      // Save settings (notifications, theme, advanced)
      await axios.put("/admin/settings", {
        notifications,
        theme,
        advanced
      });

      const normalizedAvatar = resolveAssetUrl(updatedAdmin.avatarUrl);
      const displayName =
        updatedAdmin.fullName ||
        updatedAdmin.username ||
        profile.fullName ||
        "Admin User";

      const settingsToSave = {
        profile: {
          name: displayName,
          fullName: displayName,
          email: updatedAdmin.email || profilePayload.email,
          phone: updatedAdmin.phone || profilePayload.phone,
          location: updatedAdmin.location || profilePayload.location,
          website: updatedAdmin.website || profilePayload.website,
          bio: updatedAdmin.bio || profilePayload.bio,
          avatar: normalizedAvatar,
        },
        notifications,
        theme,
        advanced,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem("adminSettings", JSON.stringify(settingsToSave));

      const sidebarData = {
        userName: displayName,
        userAvatar: normalizedAvatar,
        lastUpdate: new Date().toISOString(),
      };
      localStorage.setItem("adminSidebar", JSON.stringify(sidebarData));

      const button = document.getElementById("save-button");
      if (button) {
        button.classList.add("bg-green-600");
        setTimeout(() => {
          button.classList.remove("bg-green-600");
        }, 2000);
      }

      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setCvFile(file);
    }
  };

  const handleCVUpload = async () => {
    if (!cvFile) {
      alert('Please select a PDF file first.');
      return;
    }

    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);

      const response = await axios.post('/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const hadExistingCV = !!cvInfo;
      setCvFile(null);
      // Reset file input
      document.getElementById('cv-upload').value = '';
      // Reload CV info to get the latest data
      const cvResponse = await axios.get('/cv/admin');
      setCvInfo(cvResponse.data);
      alert(hadExistingCV ? 'CV updated successfully!' : 'CV uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload CV:', err);
      alert(
        err.response?.data?.message ||
          'Failed to upload CV. Please try again.'
      );
    } finally {
      setCvUploading(false);
    }
  };

  const handleCVDelete = async () => {
    if (!cvInfo) {
      alert('No CV to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${cvInfo.originalName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      if (cvInfo._id) {
        await axios.delete(`/cv/${cvInfo._id}`);
      } else {
        await axios.delete('/cv');
      }
      setCvInfo(null);
      setCvFile(null);
      // Reset file input
      const fileInput = document.getElementById('cv-upload');
      if (fileInput) fileInput.value = '';
      alert('CV deleted successfully!');
    } catch (err) {
      console.error('Failed to delete CV:', err);
      alert(
        err.response?.data?.message ||
          'Failed to delete CV. Please try again.'
      );
    }
  };

  const handleCVUpdate = () => {
    // Update is done by uploading a new file, which replaces the old one
    // Just trigger the file input
    document.getElementById('cv-upload').click();
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert("Please select an image file first.");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      alert("Invalid file type. Please select a JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (avatarFile.size > maxSize) {
      alert("File size too large. Maximum size is 2MB.");
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await axios.put("/admin/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle both response.data.admin and response.data (in case structure differs)
      const updatedAdmin = response.data?.admin || response.data;

      if (!updatedAdmin) {
        throw new Error("Invalid response from server");
      }

      applyAdminToProfile(updatedAdmin);
      onAdminUpdated?.(updatedAdmin);

      const normalizedAvatar = resolveAssetUrl(updatedAdmin.avatarUrl);
      setAvatarPreview(normalizedAvatar || avatarPreview);

      const displayName =
        updatedAdmin.fullName ||
        updatedAdmin.username ||
        profile.fullName ||
        "Admin User";
      const savedSettings = JSON.parse(
        localStorage.getItem("adminSettings") || "{}"
      );
      const updatedSettings = {
        ...savedSettings,
        profile: {
          ...(savedSettings.profile || {}),
          name: displayName,
          fullName: displayName,
          email:
            updatedAdmin.email ||
            savedSettings.profile?.email ||
            profile.email,
          phone:
            updatedAdmin.phone ||
            savedSettings.profile?.phone ||
            profile.phone,
          location:
            updatedAdmin.location ||
            savedSettings.profile?.location ||
            profile.location,
          website:
            updatedAdmin.website ||
            savedSettings.profile?.website ||
            profile.website,
          bio: updatedAdmin.bio || savedSettings.profile?.bio || profile.bio,
          avatar: normalizedAvatar,
        },
        notifications: savedSettings.notifications || notifications,
        theme: savedSettings.theme || theme,
        advanced: savedSettings.advanced || advanced,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem("adminSettings", JSON.stringify(updatedSettings));
      localStorage.setItem(
        "adminSidebar",
        JSON.stringify({
          userName: displayName,
          userAvatar: normalizedAvatar,
          lastUpdate: new Date().toISOString(),
        })
      );

      alert("Profile photo updated successfully!");
      setAvatarFile(null);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      const errorMessage = 
        err.response?.data?.message ||
        err.message ||
        "Failed to upload avatar. Please check your connection and try again.";
      alert(errorMessage);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSecurityChange = (field, value) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdvancedChange = (field, value) => {
    setAdvanced((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (security.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    try {
      const response = await axios.put("/auth/password", {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      alert(response.data?.message || "Password updated successfully!");
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    }
  };

  const handleEnable2FA = async () => {
    try {
      // Simulate 2FA setup
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Two-factor authentication has been enabled!");
    } catch (error) {
      alert("Failed to enable 2FA. Please try again.");
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      settings: { notifications, theme, advanced },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Settings exported successfully!");
  };

  const handleRegenerateApiKey = async () => {
    if (!window.confirm("Are you sure you want to regenerate your API key? The old key will no longer work.")) {
      return;
    }

    try {
      const response = await axios.post("/admin/settings/regenerate-api-key");
      setAdvanced(prev => ({
        ...prev,
        apiKey: response.data.apiKey
      }));
      alert("API key regenerated successfully!");
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      alert(
        error.response?.data?.message ||
          "Failed to regenerate API key. Please try again."
      );
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm("Are you sure you want to clear the cache? This may temporarily slow down the application.")) {
      return;
    }

    try {
      await axios.post("/admin/settings/clear-cache");
      alert("Cache cleared successfully!");
    } catch (error) {
      console.error("Failed to clear cache:", error);
      alert(
        error.response?.data?.message ||
          "Failed to clear cache. Please try again."
      );
    }
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin"); // adjust to actual endpoint returning settings
      setForm({
        siteTitle: res.data.siteTitle || "",
        notifyEmail: res.data.notifyEmail || "",
      });
    } catch (err) {
      console.error("Load settings", err);
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

  const save = async () => {
    try {
      await axios.put("/admin", form); // adjust endpoint as needed
      alert("Settings saved");
    } catch (err) {
      console.error("Save settings", err);
      alert("Save failed");
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Enhanced Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl mb-2 transition-all relative overflow-hidden group ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "text-gray-700 hover:bg-gray-50/80"
                  }`}
                >
                  {/* Animated background for active state */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <tab.icon className="w-5 h-5 relative z-10" />
                  <span className="font-semibold relative z-10">
                    {tab.label}
                  </span>

                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced Settings Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden"
              >
                {/* Content Header */}
                <div
                  className={`p-6 bg-gradient-to-r ${currentTab?.color} bg-opacity-5 border-b border-white/20`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${currentTab?.color}`}
                    >
                      <currentTab.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentTab?.label} Settings
                      </h2>
                      <p className="text-gray-600">
                        Manage your {currentTab?.label.toLowerCase()}{" "}
                        preferences
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Profile Settings */}
                  {activeTab === "profile" && (
                    <div className="space-y-8">
                      {/* Avatar Upload Section */}
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                              <img
                                src={avatarPreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    profile.fullName || "Admin User"
                                  )}&background=6366f1&color=fff&size=120`;
                                }}
                              />
                            </div>
                          </div>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Camera className="w-4 h-4 text-gray-600" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Profile Picture
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Upload a new profile picture. Recommended size:
                            256x256px
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleAvatarUpload}
                              disabled={avatarUploading || !avatarFile}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                              {avatarUploading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>Upload Photo</span>
                                </>
                              )}
                            </button>
                            {avatarFile && (
                              <button
                                onClick={() => {
                                  setAvatarFile(null);
                                  const fallback = profile.avatarUrl
                                    ? resolveAssetUrl(profile.avatarUrl)
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        profile.fullName || "Admin User"
                                      )}&background=6366f1&color=fff&size=120`;
                                  setAvatarPreview(fallback);
                                }}
                                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CV Upload Section */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                        <div className="flex items-start space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                              <Download className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                CV / Resume
                              </h3>
                              {cvInfo && (
                                <div className="flex items-center space-x-2">
                                  <motion.button
                                    onClick={handleCVUpdate}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Update</span>
                                  </motion.button>
                                  <motion.button
                                    onClick={handleCVDelete}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm flex items-center space-x-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </motion.button>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                              {cvInfo 
                                ? 'Upload a new PDF to replace the current CV, or delete it to remove from your portfolio.'
                                : 'Upload your CV in PDF format. This will be available for download on your portfolio.'}
                            </p>
                            
                            {cvInfo && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                      Current CV: {cvInfo.originalName}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2">
                                      <span className="flex items-center space-x-1">
                                        <Download className="w-3 h-3" />
                                        <span>{cvInfo.downloadCount || 0} downloads</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Uploaded: {new Date(cvInfo.uploadedAt || cvInfo.createdAt).toLocaleDateString()}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <FileText className="w-3 h-3" />
                                        <span>{(cvInfo.fileSize / 1024).toFixed(2)} KB</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              <label
                                htmlFor="cv-upload"
                                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center space-x-2"
                              >
                                <Upload className="w-4 h-4" />
                                <span>{cvFile ? cvFile.name : (cvInfo ? 'Replace CV' : 'Select PDF File')}</span>
                              </label>
                              <input
                                id="cv-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleCVChange}
                                className="hidden"
                              />
                              {cvFile && (
                                <>
                                  <motion.button
                                    onClick={handleCVUpload}
                                    disabled={cvUploading}
                                    whileHover={{ scale: cvUploading ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg"
                                  >
                                    {cvUploading ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Save className="w-4 h-4" />
                                        <span>{cvInfo ? 'Update CV' : 'Upload CV'}</span>
                                      </>
                                    )}
                                  </motion.button>
                                  <motion.button
                                    onClick={() => {
                                      setCvFile(null);
                                      document.getElementById('cv-upload').value = '';
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </motion.button>
                                </>
                              )}
                            </div>
                            {cvFile && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-1"
                              >
                                <span>Selected:</span>
                                <span className="font-medium">{cvFile.name}</span>
                                <span>({(cvFile.size / 1024).toFixed(2)} KB)</span>
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Profile Form */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            label: "Full Name",
                            key: "fullName",
                            icon: User,
                            required: true,
                          },
                          {
                            label: "Email Address",
                            key: "email",
                            icon: Mail,
                            type: "email",
                            required: true,
                          },
                          {
                            label: "Phone Number",
                            key: "phone",
                            icon: Phone,
                            type: "tel",
                          },
                          { label: "Location", key: "location", icon: MapPin },
                          {
                            label: "Website",
                            key: "website",
                            icon: Globe,
                            type: "url",
                            fullWidth: true,
                          },
                        ].map((field) => (
                          <div
                            key={field.key}
                            className={field.fullWidth ? "md:col-span-2" : ""}
                          >
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                              <field.icon className="w-4 h-4" />
                              <span>
                                {field.label}{" "}
                                {field.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </span>
                            </label>
                            <input
                              type={field.type || "text"}
                              value={profile[field.key]}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  [field.key]: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              required={field.required}
                            />
                          </div>
                        ))}

                        {/* Bio Field */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Bio</span>
                          </label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) =>
                              setProfile({ ...profile, bio: e.target.value })
                            }
                            rows="4"
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-green-100 rounded-xl">
                            <Lock className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              Change Password
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Update your password to keep your account secure
                            </p>

                            <div className="space-y-4">
                              {[
                                {
                                  label: "Current Password",
                                  key: "currentPassword",
                                },
                                { label: "New Password", key: "newPassword" },
                                {
                                  label: "Confirm New Password",
                                  key: "confirmPassword",
                                },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                  </label>
                                  <input
                                    type="password"
                                    value={security[field.key]}
                                    onChange={(e) =>
                                      handleSecurityChange(
                                        field.key,
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <motion.button
                              onClick={handlePasswordUpdate}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              <span>Update Password</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Add an extra layer of security to your account
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-700">
                                  Status:{" "}
                                  <span className="text-orange-600">
                                    Disabled
                                  </span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Enable 2FA for enhanced security
                                </p>
                              </div>
                              <motion.button
                                onClick={handleEnable2FA}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              >
                                <Shield className="w-5 h-5" />
                                <span>Enable 2FA</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeTab === "notifications" && (
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <motion.div
                          key={key}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between p-6 bg-white/50 border border-gray-200 rounded-2xl hover:border-purple-200 transition-colors"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Receive notifications for{" "}
                              {key
                                .toLowerCase()
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                [key]: !value,
                              })
                            }
                            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                              value ? "bg-purple-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                                value ? "translate-x-9" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeTab === "appearance" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-6">
                          Theme Preference
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              id: "light",
                              label: "Light",
                              icon: Sun,
                              description: "Clean and bright",
                              color: "from-yellow-400 to-orange-500",
                            },
                            {
                              id: "dark",
                              label: "Dark",
                              icon: Moon,
                              description: "Easy on the eyes",
                              color: "from-indigo-600 to-purple-700",
                            },
                            {
                              id: "system",
                              label: "System",
                              icon: Monitor,
                              description: "Match your device",
                              color: "from-gray-600 to-gray-400",
                            },
                          ].map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={() => setTheme(item.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-6 border-2 rounded-2xl text-left transition-all ${
                                theme === item.id
                                  ? "border-blue-600 bg-blue-50 shadow-lg"
                                  : "border-gray-200 hover:border-gray-300 bg-white/50"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-r ${item.color} w-12 h-12 flex items-center justify-center mb-3`}
                              >
                                <item.icon className="w-6 h-6 text-white" />
                              </div>
                              <p className="font-semibold text-gray-900 mb-1">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>

                              {theme === item.id && (
                                <div className="mt-3 flex items-center space-x-1 text-blue-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Selected
                                  </span>
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Additional Appearance Options */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">
                          Interface Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                            <div>
                              <p className="font-semibold text-gray-900">
                                Compact Mode
                              </p>
                              <p className="text-sm text-gray-600">
                                Reduce padding and spacing
                              </p>
                            </div>
                            <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                              <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                            <div>
                              <p className="font-semibold text-gray-900">
                                Animations
                              </p>
                              <p className="text-sm text-gray-600">
                                Enable interface animations
                              </p>
                            </div>
                            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                              <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Settings */}
                  {activeTab === "advanced" && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-orange-100 rounded-xl">
                            <Cpu className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              API Configuration
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Manage your API keys and endpoints
                            </p>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  API Key
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={advanced.apiKey}
                                    onChange={(e) =>
                                      handleAdvancedChange(
                                        "apiKey",
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                                    placeholder="Your API key..."
                                  />
                                  <motion.button
                                    onClick={handleRegenerateApiKey}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
                                  >
                                    Regenerate
                                  </motion.button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Webhook URL
                                </label>
                                <input
                                  type="url"
                                  value={advanced.webhookUrl}
                                  onChange={(e) =>
                                    handleAdvancedChange(
                                      "webhookUrl",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder="https://api.yoursite.com/webhook"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-purple-100 rounded-xl">
                            <Server className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              System Preferences
                            </h3>

                            <div className="space-y-4">
                              {[
                                {
                                  label: "Enable Caching",
                                  key: "cacheEnabled",
                                  description:
                                    "Improve performance with caching",
                                },
                                {
                                  label: "Usage Analytics",
                                  key: "analytics",
                                  description: "Help improve the platform",
                                },
                              ].map((item) => (
                                <div
                                  key={item.key}
                                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
                                >
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {item.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {item.description}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleAdvancedChange(
                                        item.key,
                                        !advanced[item.key]
                                      )
                                    }
                                    className={`w-12 h-6 rounded-full transition-colors relative ${
                                      advanced[item.key]
                                        ? "bg-purple-600"
                                        : "bg-gray-300"
                                    }`}
                                  >
                                    <span
                                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform ${
                                        advanced[item.key]
                                          ? "translate-x-7"
                                          : "translate-x-1"
                                      }`}
                                    />
                                  </button>
                                </div>
                              ))}

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Backup Frequency
                                </label>
                                <select
                                  value={advanced.backupFrequency}
                                  onChange={(e) =>
                                    handleAdvancedChange(
                                      "backupFrequency",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Data Management */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                        <h3 className="font-bold text-gray-900 text-lg mb-4">
                          Data Management
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.button
                            onClick={handleExportData}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-white border border-blue-200 rounded-xl hover:border-blue-300 transition-colors flex items-center space-x-3"
                          >
                            <Download className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">
                                Export Data
                              </p>
                              <p className="text-sm text-gray-600">
                                Download your settings backup
                              </p>
                            </div>
                          </motion.button>

                          <motion.button
                            onClick={handleClearCache}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-white border border-red-200 rounded-xl hover:border-red-300 transition-colors flex items-center space-x-3"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                            <div className="text-left">
                              <p className="font-semibold text-gray-900">
                                Clear Cache
                              </p>
                              <p className="text-sm text-gray-600">
                                Remove temporary files
                              </p>
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <motion.button
                    id="save-button"
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 hover:shadow-lg transition-all disabled:opacity-50 w-full justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save All Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
