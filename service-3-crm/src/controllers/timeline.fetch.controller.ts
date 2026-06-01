import { Request, Response } from "express";

import { fetchTimelineService } from "../services/timeline.fetch.service";

export const fetchTimelineController = async (
    req: Request,
    res: Response
) => {

    try {

        const lead_id = req.params.id as string;

        const timeline = await fetchTimelineService(
            lead_id
        );

        res.json({
            success: true,
            data: timeline
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch timeline",
            error
        });
    }
};