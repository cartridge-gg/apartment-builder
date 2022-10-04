import THREE from "three";

export default class Tileset {
    private _width: number;
    private _height: number;
    
    private _tileWidth: number;
    private _tileHeight: number;
    
    private _tileset: THREE.Texture;
    private _tileTextures: THREE.Texture[] = [];

    constructor(width: number, height: number, tileWidth: number, tileHeight: number, tileset: THREE.Texture) {
        this._width = width;
        this._height = height;

        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
        
        this._tileset = tileset;
    }

    create() {

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

    public get tileset(): THREE.Texture {
        return this._tileset;
    }
}