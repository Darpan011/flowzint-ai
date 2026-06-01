type ProductInput = {

    industry: string;

    minEmployees: number;

};

type MatchResult = {

    fit: string;

    fitScore: number;

};

export const matchICP = (

    industry: string,

    employees: number,

    product: ProductInput

): MatchResult => {

    let score = 0;

    if (
        industry
            .toLowerCase()
            .includes(
                product
                    .industry
                    .toLowerCase()
            )
    ) {

        score += 50;

    }

    if (
        employees >=
        product.minEmployees
    ) {

        score += 50;

    }

    return {

        fit:
            score >= 80
                ? "Excellent"
                : "Poor",

        fitScore:
            score

    };

};