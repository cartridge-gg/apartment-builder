import Tileset from "@/gfx/Tileset";
import THREE from "three";
import Tilemap from "./Tilemap";

export default class Tile {
    private _id: number;
    private _tilesetId: number;

    private _tilemap: Tilemap;
    private _x: number;
    private _y: number;

    private _mesh: THREE.Mesh;

    constructor(id: number, tilesetId: number, tilemap: Tilemap, x: number, y: number, size: number) {
        this._id = id;
        this._tilesetId = tilesetId;
        this._x = x;
        this._y = y;
    }

    create() {
        const clipped = this.tileset.tileset.clone();
        clipped.offset.x = this.x * this.tileset.tileWidth;
        clipped.offset.y = this.y * this.tileset.tileHeight;
    
        const geometry = new THREE.PlaneGeometry(this._tilemap.tileWidth, this._tilemap.tileHeight);
        const material = new THREE.MeshBasicMaterial({
            map: clipped,
            side: THREE.DoubleSide,
        });

        this._mesh = new THREE.Mesh(geometry, material);
    }

    // Position of the tile in the tileset
    public get id(): number {
        return this._id;
    }

    public get tileset(): Tileset {
        return this._tilemap.getTileset(this._tilesetId);
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}