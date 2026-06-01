import supabase from "./supabase";

export const getAllLeads = async () => {

    const {
        data,
        error
    } = await supabase

        .from("leads")

        .select("*")

        .order(
            "score",
            {
                ascending: false
            }
        );

    if (error) {
        throw error;
    }

    return data;

};