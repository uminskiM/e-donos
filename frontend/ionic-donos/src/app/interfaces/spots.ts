export interface SpotRequestBody {
    latitude: number,
    longitude: number,
    category: string,
    comment: string,
    photo?: string
}