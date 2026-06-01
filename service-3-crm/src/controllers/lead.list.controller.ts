import { Request, Response } from "express";

import { listLeads } from "../services/lead.list.service";

export const getAllLeads = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const leads = await listLeads();

        res.json({
            success: true,
            count: leads.length,
            data: leads
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: (error as Error).message
        });

    }

};