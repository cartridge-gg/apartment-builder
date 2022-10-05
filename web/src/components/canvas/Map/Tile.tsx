import { Tileset } from "@/hooks/tileset";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface TileProps {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    tileset: Tileset;
    tileId: number;
}

export default function Tile({
    x,
    y,
    z,
    width,
    height,
    tileset,
    tileId,
    ...props
}: TileProps & Partial<JSX.IntrinsicElements['mesh']>) {
    const mesh = useRef(null);
    const three = useThree();
    const [ texture, setTexture ] = useState(null);

    useEffect(() => {
        const texture = tileset.texture.clone();
        texture.repeat.x = 1 / tileset.width;
        texture.repeat.y = 1 / tileset.height;
        texture.center.x = 0;
        texture.center.y = 1;
        texture.offset.x = (tileId % tileset.width) / tileset.width;
        texture.offset.y = 1 - Math.floor(tileId / tileset.width) / tileset.height;

        setTexture(texture);
    }, [tileset, tileId])

    return (
        <>
            <mesh 
                ref={mesh}
                position={[x, y, z]}
                {...props}
            >
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial args={[{ map: texture, side: THREE.DoubleSide, transparent: true }]} />
            </mesh>
        </>
    );
}