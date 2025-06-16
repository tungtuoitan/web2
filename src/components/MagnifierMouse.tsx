// ImageMagnifier.js
import { useState } from 'react';

type ImageMagnifierProps = {
    src: string;
    className?: string;
    width: number;
    height: number;
    alt?: string;
    magnifierHeight?: number;
    magnifierWidth?: number;
    zoomLevel?: number;
};
const ImageMagnifier = (props: ImageMagnifierProps) => {
    const {
        src,
        className = '',
        width = 300,
        height = 200,
        alt = 'Image Magnifier',
        magnifierHeight = 100,
        magnifierWidth = 100,
        zoomLevel = 2,
    } = props;
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [[x, y], setXY] = useState([0, 0]);

    const mouseEnter = (e: any) => {
        const el = e.currentTarget;

        const { width, height } = el.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
    }

    const mouseLeave = (e: any) => {
        e.preventDefault();
        setShowMagnifier(false);
    }

    const mouseMove = (e: any) => {
        const el = e.currentTarget;
        const { top, left } = el.getBoundingClientRect();

        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;

        setXY([x, y]);
    };

    return <div className="relative inline-block">
        <img
            src={src}
            className={className}
            width={width}
            height={height}
            alt={alt}
            onMouseEnter={(e) => mouseEnter(e)}
            onMouseLeave={(e) => mouseLeave(e)}
            onMouseMove={(e) => mouseMove(e)}
        />
        <div
            style={{
                display: showMagnifier ? '' : 'none',
                position: 'absolute',
                pointerEvents: 'none',
                height: `${magnifierHeight}px`,
                width: `${magnifierWidth}px`,
                opacity: '1',
                // border: '1px solid white',
                backgroundColor: 'white',
                borderRadius: '100%',
                backgroundImage: `url('${src}')`,
                backgroundRepeat: 'no-repeat',
                top: `${y - magnifierHeight / 2}px`,
                left: `${x - magnifierWidth / 2}px`,
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,

                boxShadow: '5px 15px 16px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* <img src="/circle-test1.svg" width={magnifierWidth} height={magnifierHeight}/> */}
        </div>
    </div>
};

export default ImageMagnifier;