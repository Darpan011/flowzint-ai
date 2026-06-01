import { deleteLead } from "../db/lead.delete";

export const removeLead = async (
    id: string
) => {

    return deleteLead(
        id
    );

};