import { useEffect, useLayoutEffect, useState} from "react";
import {photoData} from "../data/data";
import type {Photo} from "../types/Photo";
import {PhotoFrame} from "./PhotoFrame";



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

    const itemWidth = 132 *2
    const itemHeight = itemWidth/16*9;
    const itemsEachRow = 8;
    const itemTotal = photos.length;

    const gapX = itemWidth/16;
    const containerWidth = itemWidth * itemsEachRow + gapX * (itemsEachRow - 1);
    const containerHeight = Math.ceil(itemTotal / itemsEachRow) * itemHeight + gapX * (Math.ceil(itemTotal / itemsEachRow) - 1);
    console.log(containerWidth, containerHeight, itemTotal, itemsEachRow, itemWidth, itemHeight);


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

        <div className="h-screen overflow-hidden bg-black text-white border-red-500 border-2
            relative"
            >
            {/* {photosByContentType.map((photos: Photo[]) => (
                <div className="border-green-500 border-2 " 
                style={{ width: '100%', height: '300px' }} 
                key={photos[0].contentType}>
                    {photos.map((photo: Photo) => (
                        <PhotoFrame
                            key={photo.id}
                            photo={photo}
                            fitType="both"
                            width={600}
                        />
                    ))}
                </div>
            ))} */}
            <div
                className="border-green-500 border-2 p-4 absolute flex-wrap"
                style={{
                    width: containerWidth + 'px',
                    height: containerHeight + 'px',
                    // display: 'grid',
                    // gridTemplateColumns: `repeat(${itemsEachRow}, ${itemWidth}px)`,
                    // gap: `${gapX}px ${gapX}px`,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: `${gapX}px`,
                }}
            >
                {photos.map((photo: Photo) => (
                    <PhotoFrame
                        key={photo.id}
                        photo={photo}
                        fitType="both"
                        width={itemWidth}
                    />
                ))}
            </div>
        </div>
    );
}