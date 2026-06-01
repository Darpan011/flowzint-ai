import supabase from "./supabase";

export const deleteLead = async (
    id: string
) => {

    const {
        error
    } = await supabase

        .from("leads")

        .delete()

        .eq(
            "id",
            id
        );

    if (error) {
        throw error;
    }

};