import { Router } from 'express';
import categoriesController from '../controllers/categories.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', categoriesController.createCategory.bind(categoriesController));
router.get('/', categoriesController.getCategories.bind(categoriesController));
router.put('/:id', categoriesController.updateCategory.bind(categoriesController));
router.delete('/:id', categoriesController.deleteCategory.bind(categoriesController));

export default router;
