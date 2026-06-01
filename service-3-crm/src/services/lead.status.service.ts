import supabase from "../db/supabase";

export const updateLeadStatusService = async (
    id: string,
    status: string
) => {

    const { data, error } = await supabase
        .from("leads")
        .update({
            status
        })
        .eq("id", id)
        .select();

    if (error) {
        throw error;
    }

    return data;
};