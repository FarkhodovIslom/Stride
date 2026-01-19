import { Router } from 'express';
import categoriesController from '../controllers/categories.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', categoriesController.createCategory.bind(categoriesController));
router.get('/', categoriesController.getCategories.bind(categoriesController));
router.put('/:id', categoriesController.updateCategory.bind(categoriesController));
router.delete('/:id', categoriesController.deleteCategory.bind(categoriesController));

export default router;
