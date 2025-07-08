import Router from 'express';

import NoteController from '../controllers/note.controller';
import CatchAsync from '../utils/catchAsync.util';
import Validate from '../middlewares/validator.middleware';
import { NoteRequestSchema } from "../dtos/noteRequest.dto";

const router = Router();

router.post('', Validate(NoteRequestSchema), CatchAsync(NoteController.createNote));
router.get('', CatchAsync(NoteController.getAllNotes));
router.get('/:id', CatchAsync(NoteController.getNoteById));

export default router;
