import supabase from "./supabase";

export const getLeadStats = async () => {

    const {
        data,
        error
    } = await supabase

        .from("leads")

        .select(
            "score, segment"
        );

    if (error) {
        throw error;
    }

    return data;

};