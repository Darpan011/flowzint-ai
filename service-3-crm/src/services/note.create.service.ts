import supabase from "../db/supabase";

export const createNoteService = async (
    lead_id: string,
    note: string
) => {

    const { data, error } = await supabase
        .from("notes")
        .insert([
            {
                lead_id,
                note
            }
        ])
        .select();

    if (error) {
        throw error;
    }

    return data;
};