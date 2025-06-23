import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { photoData } from "../data/data";
import {CameraAnimator} from "./CameraAnimator";
import ImagePlane from "./ImagePlane";
import {useGeneralStore} from "./Provider";

const imageUrls = photoData.map((photo) => photo.url);

const cts = {
    imageWidth: 1920,
    imageHeight: 1000,
    marginX: 20, // Margin between images in pixels
    marginY: 20, // Margin between images in pixels
    fov: 75, // Field of view in degrees
    near: 0.1,
    far: 9000,
}



export default function Zoombable3JS() {
    const {trigger, setTrigger,cameraPositionRef, photos, currentPhotoType, camZRef, setCurrentPhotoType, firstTime,setFirstTime} = useGeneralStore();
 
    
    useEffect(() => {
        // tính toán vị trí camZ để hiển thị hình ảnh >= screen   
        const fovRad = (cts.fov * Math.PI) / 180;
        const requiredWidth = cts.imageWidth
        const aspectRatio = window.innerWidth / window.innerHeight;
        camZRef.current = (requiredWidth / aspectRatio) / (2 * Math.tan(fovRad / 2));
        cameraPositionRef.current = [0, 0, camZRef.current];
    }, []);

    return (
        <>
                <button
                    className="bg-blue-500 text-white p-2 rounded absolute top-0 left-0 z-10"
                    type="button"
                    onClick={() => {
                        // Get a random image in photos
                        const randomIndex = Math.floor(Math.random() * photos.length);
                        const randomPhoto = photos[randomIndex];
                        setCurrentPhotoType(randomPhoto.contentType)
                        
                        const gridSize = 5;
                        const row = Math.floor(randomIndex / gridSize);
                        const col = randomIndex % gridSize;
                        const x = col * (cts.imageWidth + cts.marginX);
                        const y = -row * (cts.imageHeight + cts.marginY);

                        cameraPositionRef.current = [x, y, cameraPositionRef.current[2]+900]; // Update camera position to the right of the first image
                        setTrigger((t) => t + 1)
                    }}
                >
                    Animate
                </button>
                <Canvas
                    id='canvas'
                    camera={{ position: cameraPositionRef.current, fov: cts.fov, near: cts.near, far: cts.far }}
                    style={{ height: "100vh", width: "100vw" }}
                    shadows
                    gl={{ antialias: true, alpha: false }}
                    onCreated={(state) => {
                        state.gl.setClearColor("black");
                        state.gl.shadowMap.enabled = true;
                        state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
                    }} 
                    
                >
                    <OrbitControls />
                    <axesHelper args={[200]} />
                    <CameraAnimator />
                    {imageUrls.map((url, index) => {
                        // Vẽ grid 5x5 với marginX và marginY
                        const gridSize = 5;
                        const row = Math.floor(index / gridSize);
                        const col = index % gridSize;
                        const x = col * (cts.imageWidth + cts.marginX);
                        const y = -row * (cts.imageHeight + cts.marginY);
                        return (
                            <ImagePlane
                                key={index}
                                position={[x, y, 0]}
                                scale={[cts.imageWidth, cts.imageHeight]}
                                url={url}
                            />
                        );
                    })}
                </Canvas>
        </>
    );
}
