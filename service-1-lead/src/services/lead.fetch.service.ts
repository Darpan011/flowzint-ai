import { getLeadById }
from "../db/lead.fetch";

export const fetchLead =
async (
id: string
) => {

    return await getLeadById(
        id
    );

};