import supabase from "../db/supabase";

export const assignLeadService = async (
    id: string,
    assigned_to: string
) => {

    const { data, error } = await supabase
        .from("leads")
        .update({
            assigned_to
        })
        .eq("id", id)
        .select();

    if (error) {
        throw error;
    }

    return data;
};