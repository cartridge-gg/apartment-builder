import { proxy } from "valtio";

export enum EditorState {
    None,
    PlacingObject,
    ReplacingWall,
    ReplacingFloor,
}

interface State {
    editorState: EditorState;
    selectedObject: {
        tilesetId: number;
        objectId: number;
    };
    selectedWall: {
        tilesetId: number;
        tileId: number;
    };
    selectedFloor: {
        tilesetId: number;
        tileId: number;
    };
}

export const state = proxy({
    state: EditorState.None,
    selectedObject: null,
    selectedWall: null,
    selectedFloor: null,
});