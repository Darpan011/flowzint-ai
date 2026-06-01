import { Request, Response } from "express";

import { findLead } from "../services/lead.search.service";

export const searchLeads = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const company =
            String(
                req.query.company
            );

        const data =
            await findLead(
                company
            );

        res.json({

            success: true,

            count:
                data.length,

            data

        });

    }

    catch (
        error
    ) {

        res.status(500)
            .json({

                success: false,

                message:
                    (error as Error)
                        .message

            });

    }

};