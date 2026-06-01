import { Request, Response } from "express";

import { removeLead } from "../services/lead.delete.service";

export const deleteLeadController = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const id =
            String(
                req.params.id
            );

        await removeLead(
            id
        );

        res.json({

            success: true,

            message:
                "Lead deleted"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                (error as Error)
                    .message

        });

    }

};