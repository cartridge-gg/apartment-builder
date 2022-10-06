import { useTiles } from "@/hooks/tiles";
import { TilesetProps, useTilesets } from "@/hooks/tileset";
import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import Object from "./Object";
import Tile from "./Tile";

type ObjectMap = Map<THREE.Vec2, {
    tilesetId: number;
    objectId: number;
}>;
export interface Tilemap {
    tileWidth: number; 
    tileHeight: number; 
    width: number; 
    height: number; 
    tiles: Tile[];
    objects: ObjectMap;
}

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
    initialTiles?: Tile[];
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
    initialTiles,
}: TilemapProps) {
    const tilesets = useTilesets(tilesetProps);
    const [mouseDown, setMouseDown] = useState(false);
    const [selectedTiles, setSelectedTiles] = useState<THREE.Vector4Tuple>(null);

    const { tiles, getTileAt, setTileAt, setTile, setTiles } = useTiles(
        width, height, 
        Array.from({ length: width * height }, () => ({ tilesetId: 0, tileId: 68 }))
    );

    useEffect(() => {
        if (mouseDown || !selectedTiles) return;

        const [x, y, w, h] = selectedTiles;
        for (let i = 0; i < Math.abs(w); i++) {
            for (let j = 0; j < Math.abs(h); j++) {
                console.log(x + i*Math.sign(w), y + j*Math.sign(h));
                setTileAt(x + i * Math.sign(w), y + j * Math.sign(h), {
                    tilesetId: 0,
                    tileId: 99,
                });
            }
        }
        setSelectedTiles(null);
    }, [mouseDown]);

    useEffect(() => {
        if (!mouseDown) return;

        console.log(selectedTiles);
    }, [selectedTiles]);

    const onMouseDown = (e: ThreeEvent<MouseEvent>, tileIdx: number) => {
        if (e.nativeEvent.button !== 0) return;

        setSelectedTiles([
            tileIdx % width,
            Math.floor(tileIdx / width),
            1,
            1,
        ]);
        setMouseDown(true);
    };

    const onHoverTile = (index) => {
        if (!mouseDown) return;
        if (!tiles[index]) return;

        const [x, y] = selectedTiles;
        setSelectedTiles([
            x,
            y,
            (index % width - x) + Math.sign(index % width - x),
            (Math.floor(index / width) - y) + Math.sign(Math.floor(index / width) - y),
        ]);
    };

    return (
        <>
            {tilesets[0] && <Object 
                x={-10}
                y={-10}
                z={z}
                tileWidth={tileWidth}
                tileHeight={tileHeight}
                tileset={tilesets[0]}
                objectId={0}
            />}
            {tiles.length > 0 && tiles.map((tile, index) => {
                const tileX = (index % width);
                const tileY = Math.floor(index / width);

                const xBetween = selectedTiles && (selectedTiles[2] < 0 ?
                    tileX > selectedTiles[0] + selectedTiles[2] && tileX <= selectedTiles[0] :
                    tileX >= selectedTiles[0] && tileX < selectedTiles[0] + selectedTiles[2]);
                const yBetween = xBetween && (selectedTiles[3] < 0 ?
                    tileY > selectedTiles[1] + selectedTiles[3] && tileY <= selectedTiles[1] :
                    tileY >= selectedTiles[1] && tileY < selectedTiles[1] + selectedTiles[3]);

                return <Tile 
                    key={index}
                    x={x + tileX*tileWidth}
                    y={y + tileY*tileHeight}
                    z={z + 0}
                    width={tileWidth}
                    height={tileHeight}
                    tileset={tilesets[tile.tilesetId]}
                    tileId={tile.tileId}
                    selected={xBetween && yBetween}
                    onPointerDown={(event) => onMouseDown(event, index)}
                    onPointerUp={() => setMouseDown(false)}
                    onPointerOver={() => onHoverTile(index)}
                />
            })}
        </>
    );
}