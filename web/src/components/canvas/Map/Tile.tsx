import { Tileset, TileType } from "@/hooks/tileset";
import { useSpring, config, animated, AnimatedProps } from "@react-spring/three";
import { MeshProps, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface TileProps {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    tileId: number;
    tileset: Tileset;
    selected: boolean;
    selectable: boolean;
}

export default function Tile({
    x,
    y,
    z,
    width,
    height,
    tileset,
    tileId,
    selected,
    selectable,
    ...props
}: TileProps & Partial<MeshProps>) {
    const tileMesh = useRef<THREE.Mesh>(null);
    const overlayMesh = useRef<THREE.Mesh>(null);

    const [ texture, setTexture ] = useState(null);
    const [ hovered, setHovered ] = useState(false);

    useEffect(() => {
        if (!tileset || tileId < 0) return;

        const texture = tileset.texture.clone();
        texture.repeat.x = ((1 - 1/32) / tileset.width);
        texture.repeat.y = ((1 - 1/32) / tileset.height);
        texture.center.x = 0;
        texture.center.y = 1;
        texture.offset.x = (tileId % tileset.width) / tileset.width;
        texture.offset.y = (1 - Math.floor(tileId / tileset.width) / tileset.height);

        setTexture(texture);
        // scale.start();
    }, [tileset, tileId]);

    useFrame((state, delta) => {        
        if (overlayMesh.current && selected) {
            let anim = Math.sin(state.clock.elapsedTime * 6) * 0.5 + 0.5;
            anim = Math.min(Math.max(0.3, anim), 0.6);
            (overlayMesh.current.material as THREE.Material).opacity = anim;
        }
    });
    
    return (
        <>
            <mesh
                ref={tileMesh}
                position={[x, y, z]}
                scale={1.01}
                {...props}
            >
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial map={texture} opacity={texture ? 1 : 0} side={THREE.DoubleSide} transparent />
            </mesh>
            {selectable && <mesh
                ref={overlayMesh}
                position={[x, y, z]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <planeGeometry args={[0.9*width, 0.9*height]} />
                <meshBasicMaterial color={selected ? new THREE.Color(0x4287f5) : new THREE.Color(0xffffff)} opacity={hovered || selected ? 0.5 : 0.3} side={THREE.DoubleSide} transparent />
            </mesh>}
        </>
    );
}