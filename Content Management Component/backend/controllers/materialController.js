const Material = require('../models/Material');
const path = require('path');
const fs = require('fs');

// @desc    Upload new material
// @route   POST /api/materials/upload
// @access  Private (Teacher)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, subject, grade, topic } = req.body;

    // Convert absolute path to relative for the static middleware
    // We expect req.file.path to contain 'uploads' followed by the rest
    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadsIndex = fullPath.indexOf('uploads/');
    const relativePath = uploadsIndex !== -1 ? fullPath.substring(uploadsIndex) : fullPath;

    const material = new Material({
      title,
      description,
      subject,
      grade,
      topic,
      fileUrl: relativePath,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    await material.save();

    res.status(201).json({
      message: 'Material uploaded successfully',
      material,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during file upload', error: error.message });
  }
};

// @desc    Get all materials with filtering
// @route   GET /api/materials
// @access  Public (Students/Teachers)
exports.getAllMaterials = async (req, res) => {
  try {
    const { subject, grade, topic, teacher, page = 1, limit = 10, sort = '-uploadDate' } = req.query;

    const query = { isDeleted: { $ne: true } };

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (topic) query.topic = topic;
    if (teacher) query.uploadedBy = teacher;

    console.log('Fetching materials with query:', query);

    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email') // Assuming User model has name and email
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort)
      .exec();

    const count = await Material.countDocuments(query);

    res.json({
      materials,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalMaterials: count,
    });
  } catch (error) {
    console.error('FETCH_MATERIALS_ERROR:', error);
    res.status(500).json({ message: 'Server Error fetching materials', error: error.message });
  }
};

// @desc    Get material by ID
// @route   GET /api/materials/:id
// @access  Public
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('uploadedBy', 'name email');
    
    if (!material || material.isDeleted) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    console.error('GET_MATERIAL_BY_ID_ERROR:', error);
    res.status(500).json({ message: 'Server Error fetching material', error: error.message });
  }
};

// @desc    Update material metadata
// @route   PUT /api/materials/:id
// @access  Private (Teacher - Owner only)
exports.updateMaterialMetadata = async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check ownership
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this material' });
    }

    const { title, description, subject, grade, topic } = req.body;

    material.title = title || material.title;
    material.description = description || material.description;
    material.subject = subject || material.subject;
    material.grade = grade || material.grade;
    material.topic = topic || material.topic;
    material.lastModified = Date.now();

    await material.save();

    res.json({ message: 'Material metadata updated', material });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating metadata', error: error.message });
  }
};

// @desc    Replace file
// @route   PUT /api/materials/:id/file
// @access  Private (Teacher - Owner only)
exports.replaceFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    let material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check ownership
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to replace this file' });
    }

    // Delete old file if exists
    const oldPath = path.join(__dirname, '..', material.fileUrl);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    const fullPath = req.file.path.replace(/\\/g, '/');
    const uploadsIndex = fullPath.indexOf('uploads/');
    const relativePath = uploadsIndex !== -1 ? fullPath.substring(uploadsIndex) : fullPath;

    material.fileUrl = relativePath;
    material.fileType = req.file.mimetype;
    material.fileSize = req.file.size;
    material.lastModified = Date.now();

    await material.save();

    res.json({ message: 'File replaced successfully', material });
  } catch (error) {
    res.status(500).json({ message: 'Server Error replacing file', error: error.message });
  }
};

// @desc    Soft delete material
// @route   DELETE /api/materials/:id
// @access  Private (Teacher - Owner only)
exports.softDeleteMaterial = async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check ownership
    if (material.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this material' });
    }

    material.isDeleted = true;
    material.lastModified = Date.now();

    await material.save();

    res.json({ message: 'Material deleted successfully (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting material', error: error.message });
  }
};
