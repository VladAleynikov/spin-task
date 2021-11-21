import * as PIXI from "pixi.js";
import * as gsap from "gsap";
import { TweenMax } from "gsap";
import { Howl } from "howler";

export class Button {

    container: PIXI.Sprite;
    text: PIXI.Text;
    isActive: boolean = true;

    constructor(x: number, y: number, onClick: () => void) {

        const baseTexture = PIXI.Texture.from('button_normal');
        const hoverTexture = PIXI.Texture.from('button_hover');
        const pressedTexture = PIXI.Texture.from('button_pressed');
        const disabledTexture = PIXI.Texture.from('button_disabled');

        this.container = new PIXI.Sprite(baseTexture);
        this.container.x = x;
        this.container.y = y + this.container.texture.height/2;
        this.container.anchor.set(0.5, 1);

        const spinText = new PIXI.Text('SPIN',{fontFamily : 'Roboto', fontSize: 35, align : 'center', stroke: 0x292917, strokeThickness: 2});
        spinText.anchor.set(0.5);
        spinText.y -= 120;
        this.container.addChild(spinText);
        this.text = spinText;

        this.setActive();

        this.container.interactive = true;
        this.container.buttonMode = true;

        this.container.on('click', () => {

            if (!this.isActive) return;

            this.container.texture = disabledTexture;
            this.click();
            onClick();

        });

        this.container.on('mouseover', () => {
            if (this.isActive) this.container.texture = hoverTexture;
        });

        this.container.on('mousedown', () => {
            if (this.isActive) this.container.texture = pressedTexture;
        });

        this.container.on('mouseup', () => {
            this.container.texture = baseTexture;
        });

        this.container.on('mouseout', () => {
            if (this.isActive) this.container.texture = baseTexture;
        });

    }

    click() {

        this.setActive(false);

    }

    setActive(isActive: boolean = true) {

        this.isActive = isActive;

        const yScale = isActive ? 1 : 0.94;
        const xScale = isActive ? 1 : 0.98;
        const yTo = isActive ? this.container.y - 12 : this.container.y + 12;
        const duration = isActive ? 0.15 : 0.35;

        new Howl({src: ['./assets/sounds/spin_click.mp3'], rate: isActive ? 1.6 : 1}).play();

        TweenMax.to(this.container.scale, duration, {x: xScale, y: yScale, ease: isActive ? gsap.Sine.easeInOut : gsap.Back.easeOut.config(5)});
        TweenMax.to(this.container, duration, {y: yTo, ease: isActive ? gsap.Sine.easeInOut : gsap.Back.easeOut.config(5), onComplete: () => {
                this.text.style.fill = isActive ? 0xffff59 : 0x454527;
            }});

    }


}
