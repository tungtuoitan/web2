import  { useRef, useState, useEffect } from "react";
import { photoData } from "../data/data";
import * as THREE from "three";

const imageUrls = photoData.map((photo) => photo.url)

const TILE_SIZE = 200;
const GAP = 20;
const COLS = 5;
const PADDING = 20;

const ZoomableThreeGrid = () => {
const containerRef = useRef<HTMLDivElement>(null);
const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
const sceneRef = useRef<THREE.Scene | null>(null);
const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  const needsRedraw = useRef(true);

  // Initialize Three.js scene, camera, and renderer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Orthographic Camera (2D-like view)
    const aspect = container.clientWidth / container.clientHeight;
    const frustumHeight = container.clientHeight / 2;
    const camera = new THREE.OrthographicCamera(
      -frustumHeight * aspect,
      frustumHeight * aspect,
      frustumHeight,
      -frustumHeight,
      1,
      1000
    );
    camera.position.z = 500; // Fixed distance for 2D view
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load images as textures
    const loader = new THREE.TextureLoader();
    imageUrls.forEach((url, i) => {
        console.log(`Loading texture: ${url}`);
      loader.load(
        url,
        (texture) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const x = col * (TILE_SIZE + GAP) + PADDING + TILE_SIZE / 2;
          const y = -(row * (TILE_SIZE + GAP) + PADDING + TILE_SIZE / 2); // Flip Y for correct orientation

          const geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, 0);
          scene.add(mesh);
          needsRedraw.current = true;
        },
        undefined,
        (err) => console.error(`Failed to load texture: ${url}`, err)
      );
    });

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / height;
      camera.left = -frustumHeight * aspect;
      camera.right = frustumHeight * aspect;
      camera.top = frustumHeight;
      camera.bottom = -frustumHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      needsRedraw.current = true;
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
        console.log("Animating...");
      if (needsRedraw.current && renderer && scene && camera) {
        renderer.render(scene, camera);
        needsRedraw.current = false;
      }
      requestAnimationFrame(animate);
    };
    animate();

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    //   container.removeChild(renderer.domElement);
    //   renderer.dispose();
    // };
  }, []);

  // Update camera on scale or offset change
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    console.log("Updating camera with scale:", scale);

    camera.zoom = scale;
    camera.position.x = cameraOffset.current.x;
    camera.position.y = cameraOffset.current.y;
    camera.updateProjectionMatrix();
    needsRedraw.current = true;
  }, [scale]);

  const handleMouseDown = (e:any) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - cameraOffset.current.x,
      y: e.clientY - cameraOffset.current.y,
    };
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    cameraOffset.current = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    };
    setScale((s) => s); // Trigger re-render to update camera
    needsRedraw.current = true;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: any) => {
    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 0.9 : 1.1;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to world coordinates
    // const worldX =
    //   (mouseX / container.clientWidth) * 2 - 1;
    // const worldY = -((mouseY / container.clientHeight) * 2 - 1);

    const newScale = Math.max(0.1, Math.min(15, scale * zoomFactor));
    const scaleFactor = newScale / scale;

    // Adjust camera position to keep mouse point fixed
    cameraOffset.current.x = mouseX - (mouseX - cameraOffset.current.x) * scaleFactor;
    cameraOffset.current.y = mouseY - (mouseY - cameraOffset.current.y) * scaleFactor;

    setScale(newScale);
    needsRedraw.current = true;
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
      />
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
            cameraOffset.current = { x: 0, y: 0 };
            setScale((s) => s); // Trigger re-render
            needsRedraw.current = true;
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ZoomableThreeGrid;