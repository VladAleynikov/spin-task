import * as PIXI from "pixi.js";
import * as gsap from "gsap";
import * as _ from 'lodash';
import { Reel } from "./Classes/Reel";
import { Symbol } from "./Classes/Symbol";
import { Button } from "./Classes/Button";
import {Howl} from 'howler';

const { TweenMax } = gsap;

const SYMBOL_WIDTH = 236;
const SYMBOL_HEIGHT = 226;
const REEL_WIDTH = SYMBOL_WIDTH;

const REELS_COUNT = 5;
const REEL_SYMBOLS_COUNT = 3;

const width = REEL_WIDTH * REELS_COUNT;
const height = SYMBOL_HEIGHT * REEL_SYMBOLS_COUNT + 300;

const reels: Reel[] = [];

let symbolTextures: PIXI.Texture[] = [];
let button: Button;

const app = new PIXI.Application({
    width: width,
    height: height,
    antialias: true,
    backgroundColor: 0xFFFFFF
});

app.ticker.add(() => {

    reels.forEach((reel) => {

        reel.blur.blurY = (reel.position - reel.previousPosition) * 12;
        reel.previousPosition = reel.position;

        reel.symbols.forEach((symbol, index) => {

            const previousY = symbol.container.y;

            symbol.container.y = ((reel.position + index) % reel.symbols.length) * SYMBOL_HEIGHT - SYMBOL_HEIGHT;


            if (symbol.container.y < 0 && previousY > SYMBOL_WIDTH) {

                const newTexture = symbolTextures[_.random(0, symbolTextures.length - 1)];
                symbol.setTexture(newTexture);

            }

        })

    })

});

const appContainer = document.getElementById("app_container")
appContainer.appendChild(app.view);

function loadAssets() {

    PIXI.loader
        .add("symbol_1", "assets/symbols/symbol_1.png")
        .add("symbol_2", "assets/symbols/symbol_2.png")
        .add("symbol_3", "assets/symbols/symbol_3.png")
        .add("symbol_4", "assets/symbols/symbol_4.png")
        .add("symbol_5", "assets/symbols/symbol_5.png")
        .add("symbol_6", "assets/symbols/symbol_6.png")
        .add("symbol_7", "assets/symbols/symbol_7.png")
        .add("symbol_8", "assets/symbols/symbol_8.png")
        .add("button_disabled", "assets/ui/btn_spin_disabled.png")
        .add("button_hover", "assets/ui/btn_spin_hover.png")
        .add("button_normal", "assets/ui/btn_spin_normal.png")
        .add("button_pressed", "assets/ui/btn_spin_pressed.png")
        .load(run);
}

function run() {

    for (let i = 1; i <= 8; i++) {
        symbolTextures.push(PIXI.Texture.from(`symbol_${i}`));
    }
    const reelsContainer = new PIXI.Container();

    reelsContainer.mask = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRoundedRect(0, 0, width, REEL_SYMBOLS_COUNT * SYMBOL_HEIGHT, 25)
        .endFill();

    for (let i = 0; i < REELS_COUNT; i++) {

        const reel: Reel = new Reel(i * REEL_WIDTH);

        reelsContainer.addChild(reel.container);

        for (let j = -1; j < REEL_SYMBOLS_COUNT + 1; j++) {

            const symbolTexture = symbolTextures[_.random(0, symbolTextures.length - 1)];
            const scale = Math.min(SYMBOL_WIDTH / symbolTexture.width, SYMBOL_HEIGHT / symbolTexture.height);
            const y = j * symbolTexture.height * scale;
            const x = 0;
            const symbol = new Symbol(x, y, scale, symbolTexture);

            reel.addSymbol(symbol);

        }

        reels.push(reel);

    }

    button = new Button(width/2, height - 150, spinClick);

    app.stage.addChild(reelsContainer);
    app.stage.addChild(button.container);

}

function spinClick() {

    startSpin();

}

function startSpin(duration: number = 3, delayStep: number = 0.2) {

    reels.forEach((reel, index) => {

        const targetPosition = reel.position + 20;
        const delay = index * delayStep;

        setTimeout(() => {

            new Howl({src: [`./assets/sounds/reel_${index + 1}.mp3`]}).play();

        }, (duration + delay) * 1000 - 250);

        TweenMax.to(reel, duration, {position: targetPosition, delay: delay, ease: gsap.Back.easeInOut.config(0.5), onComplete: () => {

                if (index === reels.length - 1) {

                    button.setActive();

                }

            }
        });

    })

}

loadAssets();

