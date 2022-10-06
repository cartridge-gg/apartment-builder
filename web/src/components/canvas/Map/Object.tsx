import { Tileset } from "@/hooks/tileset";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ObjectProps {
    x: number;
    y: number;
    z: number;
    tileWidth: number;
    tileHeight: number;
    objectId: number;
    tileset: Tileset;
}

export default function Object({
    x,
    y,
    z,
    tileWidth,
    tileHeight,
    tileset,
    objectId,
    ...props
}: ObjectProps & Partial<JSX.IntrinsicElements['mesh']>) {
    const mesh = useRef(null);
    const [ texture, setTexture ] = useState(null);
    const object = tileset.objects?.[objectId];

    useEffect(() => {
        if (!tileset || !object) return;

        const texture = tileset.texture.clone();
        texture.repeat.x = 1 / (tileset.width / object.width);
        texture.repeat.y = 1 / (tileset.height / object.height);
        texture.center.x = 0;
        texture.center.y = 1;
        texture.offset.x = (object.startingTile % tileset.width) / tileset.width;
        texture.offset.y = 1 - Math.floor(object.startingTile / tileset.width) / tileset.height;

        setTexture(texture);
    }, [tileset, objectId])

    return (
        <>
            <mesh 
                ref={mesh}
                position={[x, y, z]}
                {...props}
            >
                <planeGeometry args={[tileWidth*object.width, tileHeight*object.height]} />
                <meshBasicMaterial args={[{ map: texture, opacity: texture ? 1 : 0, side: THREE.DoubleSide, transparent: true }]} />
            </mesh>
        </>
    );
}