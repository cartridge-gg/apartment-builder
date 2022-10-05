import { Tile } from "@/components/canvas/Map/Tilemap";
import { useState } from "react";

export const useTiles = (width: number, height: number) => {
    const [ tiles, setTiles ] = useState<Tile[]>(new Array(width * height));

    const getTileAt = (x: number, y: number) => {
        return tiles[y * width + x];
    };

    const setTileAt = (x: number, y: number, tile: Tile) => {
        const newTiles = [...tiles];
        newTiles[y * width + x] = tile;
        setTiles(newTiles);
    };

    return {
        tiles,
        getTileAt,
        setTileAt,
        setTiles,
    };
}