import { useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

export enum TileType {
    Floor = 0,
    Wall = 1,
    Object = 2,
}

export enum ObjectType {
    Furnitures = 0,
}

export interface Object {
    startingTile: number;
    // Width of the object in tiles
    width: number;
    // Height of the object in tiles
    height: number;
}

export interface Tileset {
    texture: THREE.Texture;
    tileType: TileType;
    // Columns of tiles
    width: number;
    // Rows of tiles
    height: number;
    // Width of a single tile in pixels 
    tileWidth: number;
    // Height of a single tile in pixels
    tileHeight: number;

    // Type of the objects
    objectsType?: ObjectType;
    // Objects in the tileset
    objects?: Object[];
}

export interface TilesetProps {
    tileType: TileType;
    sheet: string;
    tileWidth: number;
    tileHeight: number;

    objectsType?: ObjectType;
    objects?: Object[];
}

export const useTilesets = (tilesetProps: TilesetProps[]) => {
    const textures = useTexture(tilesetProps.map((tileset) => tileset.sheet));
    const [ tilesets, setTilesets ] = useState<Tileset[]>([]);

    useEffect(() => {
        textures.forEach(texture => {
            texture.encoding = THREE.sRGBEncoding;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
        });

        setTilesets(tilesetProps.map((tileset, index) => ({
            tileType: tileset.tileType,
            texture: textures[index],
            width: textures[index].image.width / tileset.tileWidth,
            height: textures[index].image.height / tileset.tileHeight,
            tileWidth: tileset.tileWidth,
            tileHeight: tileset.tileHeight,
            objectsType: tileset.objectsType,
            objects: tileset.objects,
        })));
    }, [textures]);

    return tilesets;
}

export const tilesets: TilesetProps[] = [{
    tileType: TileType.Floor,
    sheet: '/Apt_Floors.png',
    tileWidth: 32,
    tileHeight: 32,
    }, {
    tileType: TileType.Wall,
    sheet: '/Apt_Walls.png',
    tileWidth: 32,
    tileHeight: 32,
    }, {
    tileType: TileType.Object,
    sheet: '/Apt_Object_Surface1.png',
    tileWidth: 8,
    tileHeight: 8,
    objectsType: ObjectType.Furnitures,
    objects: [{
        startingTile: 0,
        width: 4,
        height: 4,
    }, {
        startingTile: 2,
        width: 16,
        height: 4,
    }]
}]
  
export const walls = [20, 21, 23, 24]
export const floors = [0, 1, 2, 3, 20, 21, 22, 40, 41]
