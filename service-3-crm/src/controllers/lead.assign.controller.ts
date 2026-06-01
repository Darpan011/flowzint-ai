import { Request, Response } from "express";

import { assignLeadService } from "../services/lead.assign.service";

import { createActivityService } from "../services/activity.create.service";

export const assignLeadController = async (
    req: Request,
    res: Response
) => {

    try {

        const id = req.params.id as string;

        const { assigned_to } = req.body;

        const updatedLead = await assignLeadService(
            id,
            assigned_to
        );

        await createActivityService(
            id,
            "ASSIGNMENT",
            `Lead assigned to ${assigned_to}`
        );

        res.json({
            success: true,
            message: "Lead assigned successfully",
            data: updatedLead
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to assign lead",
            error
        });
    }
};