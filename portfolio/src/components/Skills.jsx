import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiGithub,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
} from "react-icons/si";
import {
  Zap,
  Cloud,
  Sparkles,
  Atom,
  Cpu,
  TrendingUp,
  Share2,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView) {
      let start = 0;
      const end = typeof value === 'number' ? value : 0;
      const incrementTime = (duration * 1000) / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {typeof value === 'number' ? count : value}
    </motion.span>
  );
};

/* Circular progress — pure SVG with animate */
const CircularProgress = ({ level = 0 }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-20 h-20 flex items-center justify-center"
    >
      <svg viewBox="0 0 80 80" className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashoffset }}
          initial={{ strokeDashoffset: circumference }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="text-cyan-500"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {level}%
        </span>
        <Sparkles className="w-3 h-3 text-cyan-400 mt-1" />
      </div>
    </motion.div>
  );
};

/* animation variants */
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.18 } },
};

const EnhancedSkillCard = ({ skill }) => {
  const Card = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="relative group rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-transform duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-cyan-400 to-purple-500" />
      <div className="relative z-10 p-6 flex items-start gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-md shadow-md bg-gradient-to-br ${skill.gradient}`}
            >
              {React.createElement(skill.icon, {
                className: "w-5 h-5 text-white",
              })}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {skill.name}
              </h4>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {skill.desc}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r ${skill.gradient}`}
                style={{ minWidth: 6 }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex flex-wrap gap-1">
                {skill.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded-full text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                {skill.level}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <CircularProgress level={skill.level} />
        </div>
      </div>

      <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-10 bg-cyan-400/20" />
    </motion.div>
  );

  // If a URL is provided for the skill (e.g., social/channel links), wrap the card
  // in an anchor so clicking the card redirects to the external page.
  if (skill.url) {
    return (
      <a
        href={skill.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${skill.name} in new tab`}
        className="block"
      >
        {Card}
      </a>
    );
  }

  return Card;
};

const SkillsModern = () => {
  const [activeTab, setActiveTab] = useState("frontend");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const tabs = [
    { id: "frontend", label: "Frontend", icon: Atom },
    { id: "backend", label: "Backend", icon: Cpu },
    { id: "tools", label: "Tools", icon: Cloud },
  ];

  const skillsData = {
    frontend: [
      {
        name: "React.js",
        level: 95,
        icon: SiReact,
        gradient: "from-cyan-400 to-blue-500",
        url: "https://warkafurniture.vercel.app/",
        desc: "Advanced Hooks & Performance",
        tags: ["Hooks", "Context", "SSR"],
      },
      {
        name: "Next.js",
        level: 90,
        icon: SiNextdotjs,
        gradient: "from-slate-400 to-slate-200",
        desc: "App Router & Server Actions",
        tags: ["App Router", "SSR"],
      },
      {
        name: "Tailwind CSS",
        level: 98,
        icon: SiTailwindcss,
        gradient: "from-cyan-400 to-teal-500",
        desc: "Design systems & utility-first",
        tags: ["JIT", "Plugins"],
      },
      {
        name: "JavaScript",
        level: 90,
        icon: SiJavascript,
        gradient: "from-yellow-400 to-orange-500",
        desc: "Modern JS & patterns",
        tags: ["ES6+", "Async"],
      },
    ],
    backend: [
      {
        name: "Node.js",
        level: 85,
        icon: SiNodedotjs,
        gradient: "from-green-500 to-emerald-500",
        desc: "Scalable API architecture",
        tags: ["APIs", "Security"],
      },
      {
        name: "MongoDB",
        level: 88,
        icon: SiMongodb,
        gradient: "from-green-400 to-lime-500",
        desc: "Indexing & aggregation",
        tags: ["Aggregation", "Indexing"],
      },
      {
        name: "REST APIs",
        level: 87,
        icon: Cloud,
        gradient: "from-blue-500 to-indigo-500",
        desc: "Design & integration",
        tags: ["REST", "OpenAPI"],
      },
    ],
    tools: [
      {
        name: "Git & GitHub",
        level: 95,
        icon: SiGithub,
        gradient: "from-zinc-700 to-zinc-900",
        desc: "Version control & collaboration",
        tags: ["Git", "GitHub", "CI/CD"],
      },
      {
        name: "Docker & Cloud",
        level: 82,
        icon: Cloud,
        gradient: "from-blue-600 to-cyan-600",
        desc: "Containerization & deployment",
        tags: ["Docker", "Deployments"],
      },
      {
        name: "Postman & APIs",
        level: 90,
        icon: Zap,
        gradient: "from-orange-500 to-amber-500",
        desc: "API testing & documentation",
        tags: ["Postman", "REST", "Testing"],
      },
    ],
  };

  const activeSkills = skillsData[activeTab] || [];

  return (
    <section
      id="skills"
      ref={ref}
      className="py-16 -mt-20 md:-mt-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-zinc-900 dark:via-blue-950/10 dark:to-purple-950/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4"
        >
          <div className="max-w-2xl mx-auto text-center md:mx-0 md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Technical Excellence
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.12,
                duration: 0.7,
                type: "spring",
                stiffness: 110,
              }}
              className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-3 leading-tight text-center md:text-left"
            >
              My Tech <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
                Stacks
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-light text-center md:text-left"
            >
              Building digital experiences with cutting-edge technologies and
              sharing knowledge through content.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-2 bg-white/80 dark:bg-black/40 backdrop-blur-xl p-1.5 rounded-lg border border-white/20 shadow">
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `text-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow`
                    : "text-gray-600 dark:text-gray-300 bg-transparent hover:bg-white/50 dark:hover:bg-white/5"
                }`}
                aria-pressed={activeTab === tab.id}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeSkills.map((skill) => (
            <EnhancedSkillCard key={skill.name} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsModern;