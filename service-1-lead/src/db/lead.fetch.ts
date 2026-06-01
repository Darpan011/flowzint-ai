import supabase from "./supabase";

export const getLeadById = async (
    id: string
) => {

    const { data, error } =
        await supabase
            .from("leads")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {
        throw error;
    }

    return data;

};