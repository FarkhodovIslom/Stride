import { Router } from 'express';
import notesController from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth';
import { validateDto } from '../middleware/validation';
import { CreateNoteDto, UpdateNoteDto } from '../dtos/notes.dto';

const router = Router();

router.use(authenticate);

router.post('/', validateDto(CreateNoteDto), notesController.createNote.bind(notesController));
router.get('/', notesController.getNotes.bind(notesController));
router.get('/:id', notesController.getNote.bind(notesController));
router.put('/:id', validateDto(UpdateNoteDto), notesController.updateNote.bind(notesController));
router.delete('/:id', notesController.deleteNote.bind(notesController));
router.get('/:id/versions', notesController.getVersions.bind(notesController));
router.post('/:id/versions/:versionId/restore', notesController.restoreVersion.bind(notesController));

export default router;
