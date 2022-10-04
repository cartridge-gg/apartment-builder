import Tileset from "@/gfx/Tileset";
import Tile from "./Tile";

export default class Tilemap {
    private _width: number;
    private _height: number;
    private _depth: number;
    private _tileWidth: number;
    private _tileHeight: number;
    private _tilesets: Tileset[];
    private _tiles: Tile[][][];

    constructor(width: number, height: number, tileWidth: number, tileHeight: number, ...tilesets: Tileset[]) {
        this._width = width;
        this._height = height;
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
        this._tilesets = tilesets;
        this._tiles = new Array(width);
        for (let x = 0; x < width; x++) {
            this._tiles[x] = new Array(height);
        }
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get tileWidth(): number {
        return this._tileWidth;
    }

    public get tileHeight(): number {
        return this._tileHeight;
    }

    public get tilesets(): Tileset[] {
        return this._tilesets;
    }

    public get tiles(): Tile[][][] {
        return this._tiles;
    }

    getTileset(id: number): Tileset {
        return this._tilesets[id];
    }

    tileAt(x: number, y: number, z: number): Tile {
        return this._tiles[x][y][z];
    }

    setTileAt(x: number, y: number, z: number, tile: Tile): Tilemap {
        this._tiles[x][y][z] = tile;
        return this;
    }
}