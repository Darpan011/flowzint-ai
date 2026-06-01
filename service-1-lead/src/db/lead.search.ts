import supabase from "./supabase";

export const searchLead = async (
    company: string
) => {

    const {
        data,
        error
    } = await supabase

        .from("leads")

        .select("*")

        .ilike(
            "company",
            `%${company}%`
        );

    if (error) {
        throw error;
    }

    return data;

};