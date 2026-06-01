import validator from "validator";

export const validateLead = (
    lead: string
): boolean => {

    if (!lead) {
        throw new Error(
            "Lead required"
        );
    }

    const formatted =
        lead.startsWith("http")
            ? lead
            : `https://${lead}`;

    if (
        !validator.isURL(
            formatted
        )
    ) {

        throw new Error(
            "Invalid lead URL"
        );

    }

    return true;

};