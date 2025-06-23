import {useTexture} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useEffect} from "react";
import * as THREE from "three";

type ImagePlaneProps = {
    position?: [number, number, number];
    scale: [number, number];
    url: string;
};
export default function ImagePlane(props: ImagePlaneProps) {
    const { position = [0, 0, 0], scale, url } = props;
    const texture = useTexture(url || "/bg1.png");
    texture.minFilter = THREE.LinearFilter; // hoặc THREE.NearestFilter nếu muốn nét
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false; // Bật mipmaps để giảm hiện tượng răng cưa khi zoom
    // texture.encoding = THREE.sRGBEncoding
    (texture as any).encoding = THREE.SRGBColorSpace;
    texture.colorSpace = THREE.SRGBColorSpace;

    const { gl } = useThree();
    useEffect(() => {
        gl.outputColorSpace = THREE.SRGBColorSpace; // Đảm bảo renderer xuất đúng màu
        gl.toneMapping = THREE.NoToneMapping; // Tắt tone mapping để texture sáng hơn
    }, [gl]);

    return (
        <mesh position={position}>
            <planeGeometry args={scale} />
            {/* <planeGeometry args={[texture.image?.width || 1000, texture.image?.height || 1000]} /> */}
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}