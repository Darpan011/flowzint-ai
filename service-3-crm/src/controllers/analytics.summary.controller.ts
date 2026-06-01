import { Request, Response } from "express";

import { getAnalyticsSummaryService } from "../services/analytics.summary.service";

export const getAnalyticsSummaryController = async (
    req: Request,
    res: Response
) => {

    try {

        const analytics = await getAnalyticsSummaryService();

        res.json({
            success: true,
            data: analytics
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics summary",
            error
        });
    }
};