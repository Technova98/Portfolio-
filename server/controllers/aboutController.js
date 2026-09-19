import About from '../models/About.js';

// @desc    Get about section
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no about data exists, return default
    if (!about) {
      about = {
        bio: "With over 3 years in the digital space, I specialize in creating compelling visual narratives and interactive experiences.",
        expertise: [
          {
            title: 'Frontend Development',
            description: 'Modern web technologies and responsive design',
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Content Creation',
            description: 'Engaging multimedia content and storytelling',
            color: 'from-purple-500 to-purple-600'
          }
        ],
        stats: [
          { number: '50+', label: 'Projects Completed' },
          { number: '25+', label: 'Happy Clients' },
          { number: '3+', label: 'Years Experience' }
        ]
      };
    }
    
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update about
// @route   POST /api/about
// @route   PUT /api/about
// @access  Private
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (about) {
      // Update existing
      about = await About.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      about = new About(req.body);
      await about.save();
    }
    
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

