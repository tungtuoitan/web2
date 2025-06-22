import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {OrbitControls, useTexture} from "@react-three/drei";
import {photoData} from "../data/data";


const imageUrls = photoData.map((photo) => photo.url)

type ImagePlaneProps = {
    position?: [number, number, number];
    scale: [number, number];
    url: string;
}
function ImagePlane(props: ImagePlaneProps ) {
    const { position = [0, 0, 0], scale, url } = props;
    const texture = useTexture(url || "/bg1.png");
    texture.minFilter = THREE.LinearFilter; // hoặc THREE.NearestFilter nếu muốn nét
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false; // Bật mipmaps để giảm hiện tượng răng cưa khi zoom
    // texture.encoding = THREE.sRGBEncoding
     (texture as any).encoding = THREE.SRGBColorSpace 
     texture.colorSpace = THREE.SRGBColorSpace;

    const { gl } = useThree();
    useEffect(() => {
        gl.outputColorSpace = THREE.SRGBColorSpace; // Đảm bảo renderer xuất đúng màu
        gl.toneMapping = THREE.NoToneMapping; // Tắt tone mapping để texture sáng hơn
    }, [gl]);



    return (
        <mesh 
            position={position}>
            <planeGeometry args={scale} />
            {/* <planeGeometry args={[texture.image?.width || 1000, texture.image?.height || 1000]} /> */}
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}

function CameraScrollPan() {
    const { camera } = useThree();

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Di chuyển camera theo trục y (cuộn lên/xuống)
            camera.position.y += e.deltaY * 2; // Điều chỉnh tốc độ pan nếu muốn
            camera.updateProjectionMatrix();
        };
        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [camera]);

    return null;
}

export default function Zoombable3JS() {
  return (
    <div>
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75,
                near: 0.1, far: 9000
             }}
            style={{ height: "100vh", width: "100vw" }}
            shadows
            gl={{ antialias: true, alpha: false }}
            onCreated={(state) => {
                state.gl.setClearColor("black");
                state.gl.shadowMap.enabled = true;
                state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
        >
            <ambientLight intensity={5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={5}
                castShadow
            />
            <OrbitControls/>
            <axesHelper args={[200]} />
            {/* <Picture scale={1} /> */}
            {
                imageUrls.map((url, index) => {

                    if(index <10){
                        return <ImagePlane
                            key={index}
                            position={[ index * 7680 + 100, 0, -1000]} // Đặt các plane ở các vị trí khác nhau
                            scale={[7680, 4000]} // Kích thước của plane
                            url={url}
                        />

                    }
                    else {
                        return <></>
                    }

                }
                )
            }
            {/* <mesh position={[0, 0, 0]}>
                <boxGeometry args={[100, 100, 100]} />
                <meshStandardMaterial color="orange" />
            </mesh> */}
            {/* <CameraScrollPan /> */}
            {/* <Picture vec={new THREE.Vector3(1, 0, 0)} scale={1} />
            <Picture vec={new THREE.Vector3(0, 1, 0)} scale={1} />
            <Picture vec={new THREE.Vector3(0, 0, 1)} scale={1} /> */}
        
        </Canvas>
    </div>
  );
}
