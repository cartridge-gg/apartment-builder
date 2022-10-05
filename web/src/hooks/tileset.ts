import { useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

export interface Tileset {
    texture: THREE.Texture;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
}

export interface TilesetProps {
    texture: string;
    tileWidth: number;
    tileHeight: number;
}

export const useTilesets = (tilesetProps: TilesetProps[]) => {
    const textures = useTexture(tilesetProps.map((tileset) => tileset.texture));
    const [ tilesets, setTilesets ] = useState<Tileset[]>([]);

    useEffect(() => {
        textures.forEach(texture => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
        });

        setTilesets(tilesetProps.map((tileset, index) => ({
            texture: textures[index],
            width: textures[index].image.width / tileset.tileWidth,
            height: textures[index].image.height / tileset.tileHeight,
            tileWidth: tileset.tileWidth,
            tileHeight: tileset.tileHeight
        })));
    }, [textures]);

    return tilesets;
}