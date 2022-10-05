import { useTiles } from "@/hooks/tiles";
import { TilesetProps, useTilesets } from "@/hooks/tileset";
import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import Tile from "./Tile";

export interface Tile {
    tilesetId: number;
    tileId: number;
} 

interface TilemapProps {
    x: number;
    y: number;
    z: number;
    tileWidth: number;
    tileHeight: number;
    width: number;
    height: number;
    tilesetProps: TilesetProps[];
}

export default function TilemapComponent({
    x,
    y,
    z,
    tileWidth,
    tileHeight,
    width,
    height,
    tilesetProps,
}: TilemapProps) {
    const tilesets = useTilesets(tilesetProps);
    const [mouseDown, setMouseDown] = useState(false);
    const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
    const { tiles, getTileAt, setTileAt, setTiles } = useTiles(width, height);

    useEffect(() => {
        setTiles(new Array(width * height).fill({ tilesetId: 0, tileId: 5 }));
    }, []);

    useEffect(() => {
        if (mouseDown) return;

        setSelectedTiles([]);
    }, [mouseDown]);

    useEffect(() => {
        if (!mouseDown) return;

        const newTiles = [...tiles];
        selectedTiles.forEach((tileIndex) => {
            newTiles[tileIndex] = { tilesetId: 0, tileId: 8 };
        });
        setTiles(newTiles);
    }, [selectedTiles]);

    const onMouseDown = (e: ThreeEvent<MouseEvent>, tileIdx: number) => {
        if (e.nativeEvent.button !== 0) return;

        if (!selectedTiles.includes(tileIdx)) 
            setSelectedTiles([...selectedTiles, tileIdx]);
        setMouseDown(true);
    };

    const onHoverTile = (index) => {
        if (!mouseDown) return;
        if (!tiles[index]) return;
        if (selectedTiles.includes(index)) return;

        setSelectedTiles([...selectedTiles, index]);
    };

    return (
        <>
            {tiles.length > 0 && tiles.map((tile, index) => {
                return <Tile 
                    key={index}
                    x={x + (index % width) * tileWidth}
                    y={y + Math.floor(index / width) * tileHeight}
                    z={z + 0}
                    width={tileWidth}
                    height={tileHeight}
                    tileset={tilesets[tile.tilesetId]}
                    tileId={tile.tileId}
                    onPointerDown={(event) => onMouseDown(event, index)}
                    onPointerUp={() => setMouseDown(false)}
                    onPointerOver={() => onHoverTile(index)}
                />
            })}
        </>
    );
}