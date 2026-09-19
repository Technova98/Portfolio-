import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Heart,
  Mail,
  Github,
  Linkedin,
  ArrowUp,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    { icon: SiTelegram, href: "https://t.me/Ab_nainem21", label: "Telegram" },
    { icon: Mail, href: "mailto:Nahummaru9@gmail.com", label: "Email" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#portfolio" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-6 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-6 w-72 h-72 bg-primary-400/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    Nahom Maru
                  </div>
                  <div className="text-sm text-primary-400 font-medium">Fullstack Developer</div>
                </div>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                Crafting robust fullstack web applications and interactive digital solutions with modern technology and clean architecture.
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/6 backdrop-blur-sm border border-white/10 hover:bg-primary-500/10 transition">
                    <s.icon className="w-4 h-4 text-gray-200" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} viewport={{ once: true }}>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((q) => (
                  <a key={q.name} href={q.href} className="text-gray-400 hover:text-white transition">
                    {q.name}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
              <h3 className="font-semibold text-lg mb-4">Let's Connect</h3>
              <p className="text-gray-400 mb-4 max-w-sm">Ready to start your next project? Let's talk about how we can build something great.</p>
              <a href="#contact" onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow">
                <Mail className="w-4 h-4" /> Get In Touch
              </a>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-gray-800/60 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Nahom • {currentYear}</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>

            <button onClick={scrollToTop} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 transition">
              <span className="text-sm">Back to Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center py-4 border-t border-gray-800/60">
          <p className="text-gray-500 text-sm">&copy; {currentYear} Nahom Maru Shiferaw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
