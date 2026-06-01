import { Request, Response } from "express";

import { updateLeadStatusService } from "../services/lead.status.service";

import { createActivityService } from "../services/activity.create.service";

export const updateLeadStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const id = req.params.id as string;

        const { status } = req.body;

        const updatedLead = await updateLeadStatusService(
            id,
            status
        );

        await createActivityService(
            id,
            "STATUS",
            `Lead moved to ${status}`
        );

        res.json({
            success: true,
            message: "Lead status updated successfully",
            data: updatedLead
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update lead status",
            error
        });
    }
};