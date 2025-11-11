import * as me from 'melonjs'

class UIBackground extends me.Renderable {
  opacity: number;
  color: string;
  borderRadius: number;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);

    this.opacity = .8 as number;
    this.color = `rgba(0, 0, 0, ${this.opacity})` as string;
    this.borderRadius = .1 as number; // obligatoire

  }

  draw(renderer: me.CanvasRenderer) {

    renderer.setColor(this.color);
    renderer.fillRoundRect(0, 0, me.game.viewport.width * 1.75, this.height, this.borderRadius);
  }
}


/**
 * a HUD container and child items
 */
class UIContainer extends me.Container {
  userName: string;
  z: number;
  constructor(text: string, userName: string) {
    super(0, 0,
      me.game.viewport.width,
      me.game.viewport.height

    )
    this.isPersistent = true

    this.floating = true
    this.z = Infinity
    this.name = 'HUD'
    this.userName = userName
    this.addChild(new UIBackground(0, 0, me.game.viewport.width, 75));
    // this.addChild(new DialogItem(text))
  }

}

export default UIContainer
