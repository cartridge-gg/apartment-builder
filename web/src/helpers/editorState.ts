import { proxy } from "valtio";

export enum EditorState {
    None = 0,
    PlacingObject = 1,
    ReplacingWall = 2,
    ReplacingFloor = 3,
}

interface State {
    tool: EditorState;
    selectedObject?: {
        tilesetId: number;
        objectId: number;
    };
    selectedWall?: {
        tilesetId: number;
        tileId: number;
    };
    selectedFloor?: {
        tilesetId: number;
        tileId: number;
    };
}

export const state = proxy(<State>{
    tool: EditorState.None,
    selectedObject: undefined,
    selectedWall: undefined,
    selectedFloor: undefined,
});