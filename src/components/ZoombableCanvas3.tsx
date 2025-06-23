import React, { useRef, useState, useEffect } from "react";
import { photoData } from "../data/data";

const imageUrls = photoData.map((photo) => photo.url);

const TILE_SIZE = 200;
const GAP = 20;
const COLS = 5;
const PADDING = 20;

// vẫn còn hơi lag khi zoom lâu
const ZoomableCanvasGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(5);
    const [currentScale, setCurrentScale] = useState<number>(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const tileCache = useRef<Map<string, HTMLCanvasElement>>(new Map());
    const [reDraw, setReDraw] = useState<boolean>(false); // Force re-render on state change

    // 1 draw
    const draw = () => {
        console.log(currentScale)
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1); // Support high-DPI
        ctx.imageSmoothingEnabled = true; 
        const visibleStartX = -offset.x / currentScale;
        const visibleStartY = -offset.y / currentScale;
        const visibleEndX =
            visibleStartX + canvas.width / currentScale / (window.devicePixelRatio || 1);
        const visibleEndY =
            visibleStartY + canvas.height / currentScale / (window.devicePixelRatio || 1);

        for (let i = 0; i < imagesRef.current.length; i++) {
            const img = imagesRef.current[i];
            if (!img.complete) continue; // Skip unloaded images

            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const x = col * (TILE_SIZE + GAP) + PADDING;
            const y = row * (TILE_SIZE + GAP) + PADDING;

            if (
                x + TILE_SIZE < visibleStartX ||
                x > visibleEndX ||
                y + TILE_SIZE < visibleStartY ||
                y > visibleEndY
            ) {
                continue;
            }

            const cacheKey = `${i}-${Math.round(currentScale * 100)}`;
            let tile = undefined;

            if (!tile) {
                tile = document.createElement("canvas");
                tile.width = TILE_SIZE * currentScale;
                tile.height = TILE_SIZE * currentScale;
                const tileCtx = tile.getContext("2d");
                if (tileCtx) {
                    tileCtx.drawImage(img, 0, 0, tile.width, tile.height);
                    tileCache.current.set(cacheKey, tile);

                    // Limit cache size (e.g., 100 entries)
                    if (tileCache.current.size > 100) {
                        const oldestKey = tileCache.current.keys().next().value;
                        tileCache.current.delete(oldestKey ?? "");
                    }
                }
            }

            ctx.drawImage(tile, x * currentScale + offset.x, y * currentScale + offset.y);
        }

        ctx.resetTransform(); // Reset for next draw
        
        if(currentScale < 5 && currentScale > 0.5) {
            console.log("zooming in")
            if(scale === 5) {
                setCurrentScale(c => c + 0.001);
            }
            else if(scale === 0.5) {
                setCurrentScale(c => c - 0.001);
            }
        }
        else {
            console.log("resetting zoom::::::::::::::", currentScale)
            setReDraw(false); // Reset reDraw state
        }
    };


    


    // 3. Load images and wait for them to be ready
    useEffect(() => {
        const loadImages = async () => {
            imagesRef.current = await Promise.all(
                imageUrls.map(
                    (url) =>
                        new Promise<HTMLImageElement>((resolve) => {
                            const img = new Image();
                            img.src = url;
                            img.crossOrigin = "anonymous";
                            img.onload = () => resolve(img);
                            img.onerror = () => resolve(img); // Handle errors gracefully
                        })
                )
            );
            setReDraw(true); // Trigger redraw after images are loaded
        };
        loadImages();
    }, []);

    // 4. Resize canvas to match container and handle high-DPI displays
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            canvas.style.width = `${container.clientWidth}px`;
            canvas.style.height = `${container.clientHeight}px`;
            setReDraw(false); // Trigger redraw on resize
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    

    // 5. redraw when necessary
    useEffect(() => {
        console.log("Redrawing canvas with scale:", currentScale,scale, reDraw);
        let animationFrameId: number;
        const render = () => {
            if (reDraw) {
                draw();
                // setReDraw(false); // Reset reDraw state
                animationFrameId = requestAnimationFrame(render);
            }
        };
        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [currentScale, reDraw]);
    


    return (
        <div>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "800px",
                    overflow: "hidden",
                    border: "1px solid gray",
                    position: "relative",
                    // cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <canvas ref={canvasRef} />
            </div>
            <div></div>
            <div
                style={{
                    marginTop: 10,
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    gap: 10,
                }}
            >
                <button
                    onClick={() => {
                        // console.log(currentScale, scale)
                        setCurrentScale(c=>c + 0.001);
                        setScale(5);
                        setReDraw(true)
                    }}
                >
                    Zoom In
                </button>
                <button
                    onClick={() => {
                        // console.log(currentScale, scale)
                        setCurrentScale(c=>c - 0.001);
                        setScale(0.5);
                        setReDraw(true)
                    }}
                >
                    Zoom Out
                </button>
                <button
                    onClick={() => {
                        // setScale(1);
                        setOffset({ x: 0, y: 0 });
                        setReDraw(true);
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ZoomableCanvasGrid;
