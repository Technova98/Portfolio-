import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, Star, Calendar, Users, Eye } from 'lucide-react';

// Import images from assets folder
import ecommerceImage from '../assets/warka-furniture.jpg';
import restaurantImage from '../assets/restaurant-project.png';
import portfolioImage from '../assets/portfolio-project.jpg';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  
  const projects = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      category: 'fullstack',
      description: 'Full-featured e-commerce solution with user authentication, product catalog, shopping cart, and secure payment integration.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Stripe API', 'Node.js'],
      liveUrl: 'https://warkafurniture.vercel.app/',
      githubUrl: '#',
      featured: true,
      year: '2024',
      status: 'Completed',
      image: ecommerceImage 
    },
    {
      id: 2,
      title: 'Restaurant Web Application',
      category: 'frontend',
      description: 'Responsive frontend web application for authentic Ethiopian cuisine with online ordering and interactive menu features.',
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'Responsive Design', 'UI/UX Design'],
      liveUrl: 'https://ourflavor.netlify.app/',
      githubUrl: '#',
      featured: false,
      year: '2023',
      status: 'Completed',
      image: restaurantImage
    },
    {
      id: 3,
      title: 'Portfolio Website',
      category: 'frontend',
      description: 'Modern developer portfolio with smooth animations, dark mode support, and optimized performance.',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Responsive Design'],
      liveUrl: 'https://nahom-portfolio-iota.vercel.app/',
      githubUrl: 'https://github.com/Technova98/Portfolio-',
      featured: false,
      year: '2024',
      status: 'Completed',
      image: portfolioImage
    }
  ];

  return (
    <section 
      id="portfolio" 
      className="py-12 bg-white dark:bg-dark-400" // reduced vertical padding for tighter layout
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8" // CHANGED mb-16 to mb-8
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-full px-4 py-2 mb-4 border border-primary-500/20"> {/* Reduced px/py and mb */}
            <Star className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">
              Featured Work
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"> {/* Reduced text size and mb */}
            My Work
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"> {/* Reduced text size */}
            A showcase of my projects in fullstack web development and modern digital applications.
          </p>
        </motion.div>

        {/* Enhanced Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-full"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-gradient-to-br from-white to-gray-50 dark:from-dark-300 dark:to-dark-400 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer h-full flex flex-col justify-between"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Header with Actual Image */}
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${
                        project.category === 'fullstack' 
                          ? 'from-primary-600/30 to-primary-700/10' 
                          : 'from-blue-500/20 to-blue-600/10'
                      }`} />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Eye className="w-6 h-6 mx-auto mb-1" />
                          <span className="font-semibold text-sm">View Project</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {project.featured && (
                          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Featured</span>
                          </div>
                        )}
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-lg ${
                          project.category === 'fullstack' 
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm' 
                            : 'bg-blue-500/90 text-white shadow-sm'
                        }`}>
                          {project.category === 'fullstack' ? 'Fullstack' : 'Frontend'}
                        </div>
                      </div>

                      {/* Year */}
                      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-dark-400/90 backdrop-blur-lg text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        {project.year}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Links */}
                  <div className="px-5 pb-5 pt-1 flex items-center gap-3">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-300 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  selectedProject.category === 'fullstack'
                    ? 'from-primary-600/50 to-primary-700/30'
                    : 'from-blue-500/50 to-blue-600/30'
                }`} />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-lg rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs font-semibold bg-white/20 backdrop-blur-lg rounded-full px-3 py-1">
                    {selectedProject.category === 'fullstack' ? 'Fullstack Project' : 'Frontend Project'}
                  </span>
                  <h2 className="text-2xl font-bold mt-2">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Project Meta */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-400 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">Year</div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{selectedProject.year}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-400 rounded-lg">
                    <div className="w-5 h-5 mx-auto mb-1">
                      {selectedProject.status === 'Completed' ? '✅' : '🔄'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Status</div>
                    <div className={`font-semibold text-sm ${
                      selectedProject.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedProject.status}
                    </div>
                  </div>
                  {selectedProject.featured && (
                    <div className="text-center p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white">
                      <Star className="w-5 h-5 mx-auto mb-1 fill-current" />
                      <div className="text-xs">Featured</div>
                      <div className="font-semibold text-sm">Project</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Overview</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Technologies & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg font-medium text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-primary-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors hover:bg-primary-600 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </motion.a>
                  )}
                  {selectedProject.githubUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-dark-400 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-semibold transition-colors hover:bg-gray-300 dark:hover:bg-dark-300 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Code</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;