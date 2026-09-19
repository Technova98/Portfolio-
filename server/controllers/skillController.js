import Skill from '../models/Skill.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

