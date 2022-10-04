import Tilemap from "@/map/Tilemap";
import { useRef } from "react";
import THREE from "three";

interface TileProps {
    tilemap: Tilemap;
    x: number;
    y: number;
    width: number;
    height: number;
    tilesetId: number;
    tileId: number;
}

export default function Tile({
    tilemap,
    x,
    y,
    // width,
    // height,
    tilesetId,
    tileId,
}: TileProps) {
    const mesh = useRef(null);

    const tileset = tilemap.getTileset(tilesetId);

    const texture = this.tileset.tileset.clone();
    texture.offset.x = tileId % tileset.width;
    texture.offset.y = Math.floor(tileId / tileset.width);

    return (
        <>
            <mesh 
                ref={mesh}
                position={[x * tilemap.tileWidth, y * tilemap.tileHeight, 0]}
                // scale={[width, height, 1]}
            >
                <planeGeometry args={[tilemap.tileWidth, tilemap.tileHeight]} />
                <meshBasicMaterial args={[{ map: texture, side: THREE.DoubleSide }]} />
            </mesh>
        </>
    );
}