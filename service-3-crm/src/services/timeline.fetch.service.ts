import supabase from "../db/supabase";

export const fetchTimelineService = async (
    lead_id: string
) => {

    const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("lead_id", lead_id)
        .order("created_at", {
            ascending: false
        });

    if (error) {
        throw error;
    }

    return data;
};