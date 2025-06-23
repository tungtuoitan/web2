import { useEffect, useState} from "react";
import {photoData} from "../data/data";
import Zoombable3JS from "./ZoombableCanvas3";
import {useGeneralStore} from "./Provider";


export default function Homepage() {
    const {photoTypes, setPhotoTypes, setPhotos} = useGeneralStore();

    useEffect(() => {
        setPhotos(photoData);
        setPhotoTypes(Array.from(new Set(photoData.map(photo => photo.contentType))));
    }, []);

    // const photosByContentType = Array.from(
    //     photos.reduce((acc, photo) => {
    //         if (!acc.has(photo.contentType)) {
    //             acc.set(photo.contentType, []);
    //         }
    //         acc.get(photo.contentType)!.push(photo);
    //         return acc;
    //     }, new Map<string, Photo[]>())
    // ).map(([_, arr]) => arr);


    return (

        <div className="h-screen overflow-hidden bg-black text-white relative"
            >
                <Zoombable3JS />
        </div>
    );
}