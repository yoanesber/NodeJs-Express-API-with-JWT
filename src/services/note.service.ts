import { DatabaseError } from 'sequelize';

import AppError from "../exceptions/appError.exception";
import Note from "../models/notes.model";
import Sequelize from '../config/db.config';
import { JwtPayload } from "../types/jwtPayload.interface";
import { NoteRequest, NoteRequestSchema } from "../dtos/noteRequest.dto";
import { NoteResponse } from "../dtos/noteResponse.dto";

class NoteService {
    async createNote(authUser: JwtPayload, noteRequest: NoteRequest): Promise<NoteResponse> {
        // Validate the note request
        const validationResult = NoteRequestSchema.safeParse(noteRequest);
        if (!validationResult.success) {
            throw AppError.BadRequest("Invalid note request", validationResult.error.errors);
        }

        // Destructure the validated data
        const { title, content } = validationResult.data;

        // Start a transaction
        const t = await Sequelize.transaction();

        try {
            // Check if the title already exists
            const existingNote = await Note.findOne({
                where: { title },
                transaction: t,
            });
            if (existingNote) {
                throw AppError.Conflict("Duplicate note title", "A note with this title already exists");
            }

            // Create a new note
            const note = await Note.create({
                title,
                content,
                createdBy: authUser.id,
                updatedBy: authUser.id,
            }, { transaction: t });

            // Commit the transaction
            t.commit();

            return {
                id: note.id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            };
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while creating the note in the database due to: ${error.message}`);
            }

            throw AppError.InternalServerError("An unexpected error occurred while creating the note", error);
        }
    }

    async getAllNotes(limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'desc'): Promise<NoteResponse[]> {
        try {
            // Fetch all notes
            const notes = await Note.findAll({
                attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
                order: [[sortBy, sortOrder.toUpperCase()]],
                limit: limit,
                offset: offset,
            });

            return notes.map(note => ({
                id: note.id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            }));
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while fetching notes from the database due to: ${error.message}`);
            }

            throw AppError.InternalServerError("An unexpected error occurred while fetching notes", error);
        }
    }

    async getNoteById(noteId: string): Promise<NoteResponse> {
        // Validate the note ID
        if (!noteId) {
            throw AppError.BadRequest("Invalid note ID", "Note ID is required");
        }

        // Check if the note ID is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(noteId)) {
            throw AppError.BadRequest("Invalid note ID format", "Note ID must be a valid UUID");
        }

        try {
            // Fetch the note by ID
            const note = await Note.findByPk(noteId, {
                attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
            });

            if (!note) {
                throw AppError.NotFound("Note not found", `No note found with ID ${noteId}`);
            }

            return {
                id: note.id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while fetching the note from the database due to: ${error.message}`);
            }

            throw AppError.InternalServerError("An unexpected error occurred while fetching the note", error);
        }
    }
}

export default new NoteService();
