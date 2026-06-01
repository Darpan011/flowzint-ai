import supabase from "../db/supabase";

export const createLeadService = async (
    leadData: any
) => {

    const { data, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};