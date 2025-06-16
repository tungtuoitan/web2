import { useEffect, useLayoutEffect, useState} from "react";
import {photoData} from "../data/data";
import type {Photo} from "../types/Photo";
import {PhotoFrame} from "./PhotoFrame";
import FisheyeLensCanvas from "./FishEye";
import GlassMouse from "./GlassMouse";
import EraserCanvas from "./EraserCanvas";
import ImageMagnifier from "./MagnifierMouse";



export default function Homepage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    // const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        setPhotos(photoData);
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

    const itemWidth = 132 *10
    const itemHeight = itemWidth/16*9;
    const itemsEachRow = 8;
    const itemTotal = photos.length;

    const gapX = itemWidth/16;
    const containerWidth = itemWidth * itemsEachRow + gapX * (itemsEachRow - 1);
    const containerHeight = Math.ceil(itemTotal / itemsEachRow) * itemHeight + gapX * (Math.ceil(itemTotal / itemsEachRow) - 1);


    // const preloadImage = (url: string): Promise<void> => {
    //     return new Promise((resolve, reject) => {
    //         const img = new Image();
    //         img.src = url;
    //         const resolveIn2Frames = () => {
    //             requestAnimationFrame(() => {
    //                 requestAnimationFrame(() => resolve());
    //             })
    //         };
    //         // console.log(1)

    //         img.onload = () => {
    //             if ('decode' in img) {
    //                 img.decode()
    //                     .then(() => {
    //                         // console.log(2)
    //                         resolveIn2Frames();
    //                     })
    //                     .catch(() => {
    //                         // console.log(3)
    //                         resolveIn2Frames();
    //                     }); 
    //             } 
    //         };

    //         img.onerror = () => {
    //             // console.log(4)
    //             resolveIn2Frames();
    //         };
    //     });
    // };

    // useEffect(() => {
    //     if(photos.length>0) {
    //         const urls = photos.map(p => p.url ?? '').filter(url => url !== '');
        
    //         Promise.all(urls.map(preloadImage))
    //             .then(() => {
    //                 setTimeout(() => {
    //                     setIsLoaded(false);
    //                 }, 500); // Delay to ensure the UI is stable
    //             });
    //     }
        
    // }, [photos]);


    return (

        <div className="h-screen overflow-hidden bg-black text-white
            relative"
            >
                {/* <PhotoFrame
                    key={photos[0].id}
                    photo={photos[0]}
                    fitType="both"
                    width={itemWidth}
                /> */}
                {/* <FisheyeLensCanvas/> */}
                <ImageMagnifier
                    src="/bg3.jpg"
                    className="w-full h-full object-cover"
                    width={itemWidth}
                    height={itemHeight}
                    magnifierHeight={100}
                    magnifierWidth={100}
                    zoomLevel={2}
                />
                {/* <EraserCanvas/> */}
                {/* <img src="/bg1.png"/> */}
        </div>
    );
}