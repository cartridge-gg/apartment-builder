import { EditorState, state } from "@/helpers/editorState";
import { useTiles } from "@/hooks/tiles";
import { TilesetProps, TileType, useTilesets } from "@/hooks/tileset";
import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";
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

    const snap = useSnapshot(state);

    const { tiles, getTileAt, setTileAt, setTile, setTiles } = useTiles(
        width, height, 
        initialTiles,
    );

    useEffect(() => {
        if (mouseDown || !selectedTiles) return;

        const [x, y, w, h] = selectedTiles;
        for (let i = 0; i < Math.abs(w); i++) {
            for (let j = 0; j < Math.abs(h); j++) {
                if (snap.tool == EditorState.ReplacingFloor) {
                    setTileAt(x + i * Math.sign(w), y + j * Math.sign(h), {
                        tilesetId: snap.selectedFloor.tilesetId,
                        tileId: snap.selectedFloor.tileId,
                    });
                } else if (snap.tool == EditorState.ReplacingWall) {
                    setTileAt(x + i * Math.sign(w), y + j * Math.sign(h), {
                        tilesetId: snap.selectedWall.tilesetId,
                        tileId: snap.selectedWall.tileId,
                    });
                }
            }
        }
        setSelectedTiles(null);
    }, [mouseDown]);

    useEffect(() => {
        if (!mouseDown) return;
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
            {tiles.length > 0 && tiles.map((tile, index) => {
                const tileset = tilesets[tile.tilesetId];
                const tileX = (index % width);
                const tileY = Math.floor(index / width);

                const xBetween = selectedTiles && (selectedTiles[2] < 0 ?
                    tileX > selectedTiles[0] + selectedTiles[2] && tileX <= selectedTiles[0] :
                    tileX >= selectedTiles[0] && tileX < selectedTiles[0] + selectedTiles[2]);
                const yBetween = xBetween && (selectedTiles[3] < 0 ?
                    tileY > selectedTiles[1] + selectedTiles[3] && tileY <= selectedTiles[1] :
                    tileY >= selectedTiles[1] && tileY < selectedTiles[1] + selectedTiles[3]);

                const selectable = snap.tool == EditorState.ReplacingWall ? 
                    tileset.tileType === TileType.Wall :
                snap.tool == EditorState.ReplacingFloor ?
                    tileset.tileType === TileType.Floor : false;

                return <Tile 
                    key={index}
                    x={x + tileX*tileWidth}
                    y={y + tileY*tileHeight}
                    z={z + 0}
                    width={tileWidth}
                    height={tileHeight}
                    tileset={tileset}
                    tileId={tile.tileId}
                    selected={xBetween && yBetween}
                    selectable={selectable}
                    onPointerDown={(event) => onMouseDown(event, index)}
                    onPointerUp={() => setMouseDown(false)}
                    onPointerOver={() => onHoverTile(index)}
                />
            })}
        </>
    );
}