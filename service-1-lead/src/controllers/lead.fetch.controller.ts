import { Request, Response } from "express";

import { fetchLead } from "../services/lead.fetch.service";

export const getLead = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id = String(
            req.params.id
        );

        const result =
            await fetchLead(
                id
            );

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: (error as Error).message
        });

    }

};