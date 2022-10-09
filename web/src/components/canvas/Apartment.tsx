import { tilesets } from "@/hooks/tileset";
import { useState } from "react";
import * as THREE from "three";
import Tilemap, { Tile } from "./Map/Tilemap";

interface ApartmentProps {
    width: number;
    height: number;
}

const generateAptTiles = (width: number, height: number) => {
    let tiles = new Array(width * height);

    for (let i = 0; i < tiles.length; i++) {
        const pos = new THREE.Vector2(i % width, Math.floor(i / width));

        // left
        if (pos.x === 0 && pos.y !== 0 && pos.y !== height - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 0,
            };
        // bottom
        } else if (pos.y === 0 && pos.x !== 0 && pos.x !== width - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 2,
            };
        // left bottom corner
        } else if (pos.x === 0 && pos.y === 0) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 6,
            };
        // right bottom corner
        } else if (pos.x === width - 1 && pos.y === 0) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 5,
            };
        // right 
        } else if (pos.x === width - 1 && pos.y !== 0 && pos.y !== height - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 1,
            };
        // top
        } else if (pos.x !== width - 1 && pos.y === height - 1 && pos.x !== 0) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 60,
            };
        // left top corner
        } else if (pos.x === 0 && pos.y === height - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 7,
            };
        // right top corner
        } else if (pos.x === width - 1 && pos.y === height - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 8,
            };
        } else if (pos.y >= height - 2 && pos.x !== 0 && pos.x !== width - 1) {
            tiles[i] = {
                tilesetId: 1,
                tileId: 80,
            };
        } else {
            tiles[i] = {
                tilesetId: 0,
                tileId: 22,
            };
        }
    }

    return tiles;
};

export default function Apartment({
    width,
    height,
}: ApartmentProps) {
    const [tiles, setTiles] = useState<Tile[]>(generateAptTiles(width, height));
    
    return (
        <>
            <Tilemap
                x={0}
                y={0}
                z={0}
                tileWidth={32}
                tileHeight={32}
                width={width}
                height={width}
                tilesetProps={tilesets} 
                initialTiles={tiles}
            />
        </>
    )
}