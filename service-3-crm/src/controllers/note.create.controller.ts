import { Request, Response } from "express";

import { createNoteService } from "../services/note.create.service";

import { createActivityService } from "../services/activity.create.service";

export const createNoteController = async (
    req: Request,
    res: Response
) => {

    try {

        const lead_id = req.params.id as string;

        const { note } = req.body;

        const newNote = await createNoteService(
            lead_id,
            note
        );

        await createActivityService(
            lead_id,
            "NOTE",
            note
        );

        res.json({
            success: true,
            message: "Note added successfully",
            data: newNote
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create note",
            error
        });
    }
};