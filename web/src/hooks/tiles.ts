import { Tile } from "@/components/canvas/Map/Tilemap";
import { useState } from "react";

export const useTiles = (width: number, height: number, initialTiles?: Tile[]) => {
    const [ tiles, setTiles ] = useState<Tile[]>(initialTiles ?? new Array(width * height));

    const getTileAt = (x: number, y: number) => {
        return tiles[y * width + x];
    };

    const setTile = (index: number, tile: Tile) => {
        tiles[index] = tile;
        setTiles([...tiles]);
    }

    const setTileAt = (x: number, y: number, tile: Tile) => {
        tiles[y * width + x] = tile;
        setTiles(tiles);
    };

    return {
        tiles,
        getTileAt,
        setTile,
        setTileAt,
        setTiles,
    };
}