import supabase from "../db/supabase";

export const createActivityService = async (
    lead_id: string,
    type: string,
    message: string
) => {

    const { data, error } = await supabase
        .from("activities")
        .insert([
            {
                lead_id,
                type,
                message
            }
        ]);

    if (error) {
        throw error;
    }

    return data;
};