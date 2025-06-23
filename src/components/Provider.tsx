import React, { createContext, useContext, useState, type Dispatch } from "react";
import type {Photo} from "../types/Photo";


interface ContextData {
    isLoadingCarvings: boolean;
    setIsLoadingCarvings: Dispatch<React.SetStateAction<boolean>>;
    photoTypes: string[];
    setPhotoTypes: Dispatch<React.SetStateAction<string[]>>;
    photos: Photo[];
    setPhotos: Dispatch<React.SetStateAction<Photo[]>>;
    currentPhotoType: string | null;
    setCurrentPhotoType: Dispatch<React.SetStateAction<string | null>>;

    cameraPosition: [number, number, number];
    setCameraPosition: Dispatch<React.SetStateAction<[number, number, number]>>;
    cameraPositionRef: React.MutableRefObject<[number, number, number]>;
    camZRef: React.MutableRefObject<number>;
    firstTime: boolean;
    setFirstTime: Dispatch<React.SetStateAction<boolean>>;
    trigger: number;
    setTrigger: Dispatch<React.SetStateAction<number>>;
}

const DefaultContextData: ContextData = {

    isLoadingCarvings: false,
    setIsLoadingCarvings: () => { },
    photoTypes: [],
    setPhotoTypes: () => { },
    photos: [],
    setPhotos: () => { },
    currentPhotoType: null,
    setCurrentPhotoType: () => { },
    cameraPosition: [0, 0, 0],
    setCameraPosition: () => { },
    cameraPositionRef: { current: [0, 0, 0] },
    camZRef: { current: 0 },
    firstTime: true,
    setFirstTime: () => { },
    trigger: 0,
    setTrigger: () => { }

};

const GeneralStore = createContext<ContextData>(DefaultContextData);

export const useGeneralStore = () => useContext(GeneralStore);

export const GeneralProvider: React.FC<React.PropsWithChildren<React.PropsWithChildren<unknown>>> = ({ children }) => {
    const [isLoadingCarvings, setIsLoadingCarvings] = useState<boolean>(false);
    const [photoTypes, setPhotoTypes] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentPhotoType, setCurrentPhotoType] = useState<string | null>(null);

    const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 0]);
    const cameraPositionRef = React.useRef<[number,number,number]>([0, 0, 0]);
    const camZRef = React.useRef<number>(0);
    const [firstTime, setFirstTime] = useState(true);
    const [trigger, setTrigger] = useState(0);
    
    return (
        <GeneralStore.Provider value={{
            isLoadingCarvings,
            setIsLoadingCarvings,
            photoTypes,
            setPhotoTypes,
            photos, 
            setPhotos,
            currentPhotoType,
            setCurrentPhotoType,
            cameraPosition,
            setCameraPosition,
            cameraPositionRef,
            firstTime,
            setFirstTime,
            camZRef,
            trigger,
            setTrigger

        }}>
            {children}
        </GeneralStore.Provider>
    );
};
