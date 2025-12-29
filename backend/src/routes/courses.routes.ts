import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import coursesController from '../controllers/courses.controller';

const router = Router();

/**
 * @route   GET /courses
 * @desc    Get all courses for the current user
 * @access  Private
 */
router.get('/', authenticate, (req, res) =>
    coursesController.getCourses(req, res)
);

/**
 * @route   GET /courses/:id
 * @desc    Get a specific course by ID
 * @access  Private
 */
router.get('/:id', authenticate, (req, res) =>
    coursesController.getCourse(req, res)
);

/**
 * @route   POST /courses
 * @desc    Create a new course
 * @access  Private
 */
router.post('/', authenticate, (req, res) =>
    coursesController.createCourse(req, res)
);

/**
 * @route   PUT /courses/:id
 * @desc    Update a course
 * @access  Private
 */
router.put('/:id', authenticate, (req, res) =>
    coursesController.updateCourse(req, res)
);

/**
 * @route   DELETE /courses/:id
 * @desc    Delete a course
 * @access  Private
 */
router.delete('/:id', authenticate, (req, res) =>
    coursesController.deleteCourse(req, res)
);

export default router;
