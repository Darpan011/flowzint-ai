import { getLeadStats } from "../db/lead.stats";

export const calculateStats = async () => {

    const leads = await getLeadStats();

    const total = leads.length;

    const hot = leads.filter(
        (lead) =>
            lead.segment === "HOT"
    ).length;

    const cold =
        total - hot;

    const averageScore = total
        ? Math.round(

            leads.reduce(

                (
                    sum,
                    lead
                ) =>

                    sum +
                    lead.score,

                0

            )

            /

            total

        )
        : 0;

    return {

        total,

        hot,

        cold,

        averageScore

    };

};