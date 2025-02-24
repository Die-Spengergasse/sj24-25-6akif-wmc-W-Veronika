export interface MovieDetail {
    Title: string,
    Year: number,
    Plot: string,
    Ratings: { Source: string; Value: string }[];
}