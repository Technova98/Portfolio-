import React from "react";
import { motion } from "framer-motion";
import { Code, Server, Database, Layers, Rocket, Award, GraduationCap } from "lucide-react";

const About = () => {
  const expertise = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "Responsive interfaces, React, Next.js, and modern CSS architecture",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Server,
      title: "Backend Development",
      description: "Scalable REST APIs, Node.js, Express, and robust server architecture",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Database,
      title: "Database & Cloud",
      description: "MongoDB, SQL, data modeling, schema design, and secure cloud integration",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Layers,
      title: "System Design & Clean Code",
      description: "Scalable architecture, Git workflow, optimization, and software engineering standards",
      color: "from-amber-500 to-orange-600",
    },
  ];

  const stats = [
    { icon: GraduationCap, number: "4th Year", label: "SE @ Wachemo Univ" },
    { icon: Award, number: "10+", label: "Projects Completed" },
    { icon: Rocket, number: "3+", label: "Years Experience" },
  ];

  return (
    <section
      id="about"
      className="py-16 bg-gray-50 dark:bg-gray-900 font-sans relative overflow-hidden"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            <span className="text-gray-900 dark:text-white">About </span>
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fourth-year Software Engineering student at Wachemo University and passionate Fullstack Developer building impactful, scalable web applications.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Software Engineering & Fullstack Development
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-300 text-base">
              <p>
                I am Nahom Maru Shiferaw, a Fourth-year Software Engineering student at Wachemo University with a strong passion for fullstack web development. I specialize in building complete end-to-end digital solutions, from designing responsive, user-friendly frontend interfaces to architecting high-performance backend APIs and databases.
              </p>
              <p>
                Combining rigorous academic foundations in computer science and software engineering with hands-on development expertise, I focus on clean code, optimal performance, and scalable architecture using React, Next.js, Node.js, Express, and MongoDB.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-b-4 border-primary-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]"
                >
                  <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Expertise Cards - Glassmorphism style */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.15)",
                }}
                className="p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 transition-all duration-300 hover:ring-2 hover:ring-primary-500/50"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
