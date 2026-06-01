import { Request, Response } from "express";

import { validateLead } from "../validators/lead.validator";

import { processLead } from "../services/lead.service";

export const analyzeLead = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const {
            lead,
            product
        } = req.body;

        validateLead(lead);

        const result =
            await processLead(
                lead,
                product
            );

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: (error as Error).message
        });

    }

};