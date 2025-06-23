import {useState} from "react";
import {photoData} from "../data/data";


const imageUrls = photoData.map((photo) => photo.url);

export const ImgsUsingTag = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({w: 1920, h: 1080 });

    return <>
        <div
            style={{
                position: 'absolute',
                top: position.y + 'px',
                left: position.x + 'px',
                transition: 'top 0.5s, left 0.5s, width 0.5s, height 0.5s',
                width: `${imgSize.w*4+ 3*10}px`,
                height: `${imgSize.h*4+ 2*10}px`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                 flexWrap: 'wrap',
                justifyContent: 'center',
                margin: "0 !important",
                gap: '10px',
            }}
        >
            {imageUrls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-[1320px] h-[740px] object-cover"
                    style={{ width: `${imgSize.w}px`,
                        height: `${imgSize.h}px`,
                        objectFit: 'cover',
                        transition: 'width 0.5s, height 0.5s',
                        margin: '0 !important',
                    }}
                
                />))
            }

        </div>
        <div>
            <button
                onClick={() => {
                    // setPosition({ x: position.x + 100, y: position.y + 100 });
                    setImgSize({w: imgSize.w * 2, h: imgSize.h * 2 });

                }}
                className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
            >ZOOM IN</button>

            <button
                onClick={() => {
                    // setPosition({ x: position.x - 100, y: position.y - 100 });
                    setImgSize({w: imgSize.w / 2, h: imgSize.h / 2 });

                }}
                className="absolute top-4 left-24 bg-red-500 text-white px-4 py-2 rounded"
            >ZOOM OUT</button>
        </div>
    </>
}