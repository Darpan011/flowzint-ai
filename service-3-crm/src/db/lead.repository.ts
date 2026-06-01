import supabase from "./supabase";

export const saveLead = async (
    data: any
): Promise<void> => {

    const { error } =
        await supabase
            .from("leads")
            .insert([
                data
            ]);

    if (error) {
        throw error;
    }

};