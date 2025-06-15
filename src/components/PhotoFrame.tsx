import {useEffect, useState} from "react";
import type {Photo} from "../types/Photo";


type PhotoFrameProps = {
    photo: Photo,
    className?: string;
    fitType?: "both" | "width" | "height";
    width: number;
}
export const PhotoFrame = (props: PhotoFrameProps) => {
    const { photo, className, width } = props;
    const [originalWidth, setOriginalWidth] = useState<number>(0);
    const [originalHeight, setOriginalHeight] = useState<number>(0);


    useEffect(() => {
        const img = new Image();
        img.src = photo.url;
        img.onload = () => {
            setOriginalWidth(img.naturalWidth);
            setOriginalHeight(img.naturalHeight);
        };
    },[])

    const isHorizontalPicture = originalWidth >= originalHeight;
    const height = width / 16 * 9;

    return (
        <div
            key={photo.id}
            className={`shadow-md w-full h-full
                d-flex items-center justify-center
                ${className || ''}`}
            style={{ 
                aspectRatio: '1 / 1',
                width: isHorizontalPicture ? width + 'px' : height/originalHeight* originalWidth + 'px',
                height: width/16*9 + 'px',
                overflow: 'hidden',
                border: '1px solid white',
             }}
        >
            <img
                src={photo.url}
                alt={photo.title}
                className={`
                w-full h-full 
                ${isHorizontalPicture ? 'object-cover' : 'object-contain'}`    }
                style={{ aspectRatio: 'auto' }}
            />
        </div>
    );
}