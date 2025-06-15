

export interface Photo {
    id: number | string; // Unique identifier for the photo
    title: string;
    url: string;
    name?: string; // Optional field for the name of the photo
    description?: string; // Optional field for additional information
    dateTaken?: Date; // Optional field for the date the photo was taken
    contentType: "landscape" | "portrait" | "webding"; // Optional field for the type of photo
}