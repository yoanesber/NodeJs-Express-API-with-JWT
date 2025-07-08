import { Request, Response } from "express";

import AppError from "../exceptions/appError.exception";
import FormatResponse from "../utils/response.util";
import NoteService from "../services/note.service";
import { NoteRequestSchema } from "../dtos/noteRequest.dto";
import { NoteResponse } from "../dtos/noteResponse.dto";

class NoteController {
    async createNote(req: Request, res: Response): Promise<void> {
        // Validate the request body against the NoteRequestSchema
        // This will throw a ZodError if validation fails
        const noteRequest = NoteRequestSchema.parse(req.body);

        // Check if the user is authenticated
        if (!req.user || !req.user.id) {
            throw AppError.Unauthorized("User not authenticated", "You must be logged in to create a note.");
        }

        // Call the NoteService to handle the note creation logic
        // This will throw an error if the creation fails for any reason
        const note: NoteResponse = await NoteService.createNote(req.user, noteRequest);

        res.status(201).json(
            FormatResponse({
                message: "Note created successfully",
                data: note,
                req,
            })
        );
    }

    async getAllNotes(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'desc';
        
        const notes: NoteResponse[] = await NoteService.getAllNotes(limit, offset, sortBy, sortOrder);
        if (!notes || notes.length === 0) {
            throw AppError.NotFound("No notes found", "There are no notes available at the moment.");
        }

        res.status(200).json(
            FormatResponse({
                message: "Notes fetched successfully",
                data: notes,
                req,
            })
        );
    }

    async getNoteById(req: Request, res: Response): Promise<void> {
        const noteId = req.params.id;
        if (!noteId) {
            throw AppError.BadRequest("Invalid note ID", "Note ID is required to fetch a note.");
        }

        const note: NoteResponse | null = await NoteService.getNoteById(noteId);
        if (!note) {
            throw AppError.NotFound("Note not found", `No note found with ID ${noteId}.`);
        }

        res.status(200).json(
            FormatResponse({
                message: "Note fetched successfully",
                data: note,
                req,
            })
        );
    }
}

export default new NoteController();
