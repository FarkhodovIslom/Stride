import { Router } from 'express';
import notesController from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', notesController.createNote.bind(notesController));
router.get('/', notesController.getNotes.bind(notesController));
router.get('/:id', notesController.getNote.bind(notesController));
router.put('/:id', notesController.updateNote.bind(notesController));
router.delete('/:id', notesController.deleteNote.bind(notesController));

export default router;
