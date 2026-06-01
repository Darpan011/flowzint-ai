import { searchLead } from "../db/lead.search";

export const findLead = async (
    company: string
) => {

    return searchLead(
        company
    );

};