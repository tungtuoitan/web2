import * as THREE from "three";
import {useFrame, useThree} from "@react-three/fiber";
import {useEffect, useRef, useState} from "react";
import {useGeneralStore} from "./Provider";

type CameraAnimatorProps = {
    onArrived?: () => void;
}
export function CameraAnimator(props: CameraAnimatorProps) {
    const { onArrived } = props;
    const {cameraPositionRef,camZRef,trigger,setTrigger, firstTime, setFirstTime} = useGeneralStore();
    const { camera } = useThree();
    const [target, setTarget] = useState<THREE.Vector3 | null>(new THREE.Vector3(...cameraPositionRef.current));
    const lookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const arrivedRef = useRef(false);
    

    useEffect(() => {
        // Khi trigger thay đổi, đặt target mới cho camera
        if(firstTime) {
            setFirstTime(false);
            console.log("CameraAnimator first time");
        }
        else {
            console.log("CameraAnimator trigger", trigger);
            setTarget(new THREE.Vector3(...cameraPositionRef.current)); // Ví dụ: di chuyển camera đến vị trí này
            arrivedRef.current = false;
        }
    }, [trigger]);

    const onArrived2 = onArrived || (() => {
        console.log("Camera đã đến vị trí mới");
        if(!firstTime) {
            cameraPositionRef.current[2] = camZRef.current; // Tăng camZ để tránh lặp lại
            setTrigger(t => t + 1); 
        }
    });
    
    useFrame(() => {
        if (target) {
            // Di chuyển camera mượt mà về target
            camera.position.lerp(target, 0.04);

            const lookAtGoal = new THREE.Vector3(target.x, target.y, 0);
            lookAtTarget.current.lerp(lookAtGoal, 0.04);
            camera.lookAt(lookAtTarget.current);

            if (
                camera.position.distanceTo(target) < 200 &&
                lookAtTarget.current.distanceTo(lookAtGoal) < 200 &&
                !arrivedRef.current
            ) {
                arrivedRef.current = true;
                if (onArrived2) onArrived2();
            }
        }
    });
    return null;
}