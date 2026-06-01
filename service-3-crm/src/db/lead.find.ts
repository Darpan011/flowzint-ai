import supabase from "./supabase";

export const findLeadByDomain = async (
    domain: string
) => {

    const {
        data,
        error
    } = await supabase

        .from("leads")

        .select("*")

        .eq(
            "domain",
            domain
        )

        .limit(1)

        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;

};