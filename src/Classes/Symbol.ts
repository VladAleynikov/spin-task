import * as PIXI from "pixi.js";

export class Symbol {

    container: PIXI.Sprite;

    position: number[] = [0, 0];
    previousPosition: number[] = [0, 0];
    blur: PIXI.filters.BlurFilter = new PIXI.filters.BlurFilter();

    constructor(x: number, y: number, scale: number, texture: PIXI.Texture) {

        this.container = new PIXI.Sprite(texture);
        this.container.x = x;
        this.container.y = y;
        this.container.scale.set(scale);

    }

    setTexture(texture: PIXI.Texture) {

        this.container.texture = texture;

    }

}
