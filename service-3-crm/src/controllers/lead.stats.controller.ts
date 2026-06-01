import { Request, Response } from "express";

import { calculateStats } from "../services/lead.stats.service";

export const getStats = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {

        const stats = await calculateStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: (error as Error).message
        });

    }

};