import supabase from "../db/supabase";

export const getAnalyticsSummaryService = async () => {

    // Total Leads
    const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

    // Qualified Leads
    const { count: qualifiedLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "QUALIFIED");

    // Assigned Leads
    const { count: assignedLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .not("assigned_to", "is", null);

    // Hot Leads
    const { count: hotLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("segment", "HOT");

    // Recent Activities
    const { count: recentActivities } = await supabase
        .from("activities")
        .select("*", { count: "exact", head: true });

    return {
        totalLeads,
        qualifiedLeads,
        assignedLeads,
        hotLeads,
        recentActivities
    };
};