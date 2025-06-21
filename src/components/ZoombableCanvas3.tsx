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
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const tileCache = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const needsRedraw = useRef(true); // Track when redraw is needed

  // Load images and wait for them to be ready
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
      needsRedraw.current = true; // Trigger redraw after images load
    };
    loadImages();
  }, []);

  // Resize canvas to match container and handle high-DPI displays
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
      needsRedraw.current = true; // Trigger redraw on resize
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1); // Support high-DPI

    const visibleStartX = -offset.x / scale;
    const visibleStartY = -offset.y / scale;
    const visibleEndX =
      visibleStartX + canvas.width / scale / (window.devicePixelRatio || 1);
    const visibleEndY =
      visibleStartY + canvas.height / scale / (window.devicePixelRatio || 1);

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

      const cacheKey = `${i}-${Math.round(scale * 100)}`;
      let tile = tileCache.current.get(cacheKey);

      if (!tile) {
        tile = document.createElement("canvas");
        tile.width = TILE_SIZE * scale;
        tile.height = TILE_SIZE * scale;
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

      ctx.drawImage(tile, x * scale + offset.x, y * scale + offset.y);
    }

    ctx.resetTransform(); // Reset for next draw
    needsRedraw.current = false; // Mark as drawn
  };

  // Only redraw when necessary
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
    if (needsRedraw.current) {
        draw();
        needsRedraw.current = false;
        animationFrameId = requestAnimationFrame(render);
    }
};
    render();
    console.log("run useEffect");
    return () => cancelAnimationFrame(animationFrameId);
  }, [scale, offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
    needsRedraw.current = true; // Trigger redraw on pan
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // e.preventDefault();
    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 0.9 : 1.1;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = (mouseX - offset.x) / scale;
    const y = (mouseY - offset.y) / scale;

    const newScale = Math.max(0.1, Math.min(15, scale * zoomFactor)); // Limit zoom range
    const newOffsetX = mouseX - x * newScale;
    const newOffsetY = mouseY - y * newScale;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
    needsRedraw.current = true; // Trigger redraw on zoom
  };

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "800px",
          overflow: "hidden",
          border: "1px solid gray",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => {
            setScale((s) => Math.min(5, s * 1.25));
            needsRedraw.current = true;
          }}
        >
          Zoom In
        </button>
        <button
          onClick={() => {
            setScale((s) => Math.max(0.5, s / 1.25));
            needsRedraw.current = true;
          }}
        >
          Zoom Out
        </button>
        <button
          onClick={() => {
            setScale(1);
            setOffset({ x: 0, y: 0 });
            needsRedraw.current = true;
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ZoomableCanvasGrid;
