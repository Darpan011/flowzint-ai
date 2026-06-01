import {
    getAllLeads
}
from "../db/lead.list";

export const listLeads =
async () => {

    return await getAllLeads();

};