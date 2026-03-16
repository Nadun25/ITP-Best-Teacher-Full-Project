const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticateUser, authorizeTeacher } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterialById);

// Protected routes (Teacher only)
router.post(
  '/upload',
  authenticateUser,
  authorizeTeacher,
  upload.single('file'),
  materialController.uploadMaterial
);

router.put(
  '/:id',
  authenticateUser,
  authorizeTeacher,
  materialController.updateMaterialMetadata
);

router.put(
  '/:id/file',
  authenticateUser,
  authorizeTeacher,
  upload.single('file'),
  materialController.replaceFile
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeTeacher,
  materialController.softDeleteMaterial
);

module.exports = router;
