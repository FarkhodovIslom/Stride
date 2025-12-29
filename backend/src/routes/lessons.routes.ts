import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import lessonsController from '../controllers/lessons.controller';

const router = Router();

/**
 * @route   POST /lessons
 * @desc    Create a new lesson
 * @access  Private
 */
router.post('/', authenticate, (req, res) =>
    lessonsController.createLesson(req, res)
);

/**
 * @route   GET /lessons/:id
 * @desc    Get a specific lesson by ID
 * @access  Private
 */
router.get('/:id', authenticate, (req, res) =>
    lessonsController.getLesson(req, res)
);

/**
 * @route   PUT /lessons/:id
 * @desc    Update a lesson
 * @access  Private
 */
router.put('/:id', authenticate, (req, res) =>
    lessonsController.updateLesson(req, res)
);

/**
 * @route   DELETE /lessons/:id
 * @desc    Delete a lesson
 * @access  Private
 */
router.delete('/:id', authenticate, (req, res) =>
    lessonsController.deleteLesson(req, res)
);

export default router;
