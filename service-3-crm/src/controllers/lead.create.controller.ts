import { Request, Response } from "express";

import { createLeadService } from "../services/lead.create.service";

export const createLeadController = async (
    req: Request,
    res: Response
) => {

    try {

        const lead = await createLeadService(
            req.body
        );

        res.status(201).json({
            success: true,
            data: lead
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create lead",
            error
        });
    }
};