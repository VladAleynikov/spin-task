import * as PIXI from "pixi.js";
import {Symbol} from "./Symbol";

export class Reel {

    container: PIXI.Container = new PIXI.Container();
    symbols: Symbol[] = [];
    position: number = 0;
    previousPosition: number = 0;
    blur: PIXI.filters.BlurFilter = new PIXI.filters.BlurFilter();

    constructor(x) {

        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.container.filters = [this.blur];
        this.container.x = x;

    }

    addSymbol(symbol: Symbol) {

        this.symbols.push(symbol);
        this.container.addChild(symbol.container);

    }


}
