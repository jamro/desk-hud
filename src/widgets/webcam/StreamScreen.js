
const SCREEN_WIDTH = 580
const SCREEN_HEIGHT = 200

export default class StreamScreen extends PIXI.Container {

  constructor() {
    super()
    this.progress = 0
    this.areas = []
    this._videoTexture = null
    this._videoContainer = new PIXI.Container()
    this._videoContainer.y = 5
    this.addChild(this._videoContainer)

  }

  updateVideoTexture(videoTexture) {
    this._videoContainer.removeChildren()
    this._videoTexture = videoTexture

    const viewDefs = [...this.areas]
    if(viewDefs.length === 0) {
      viewDefs.push({
        cameraX: 0,
        cameraY: 0,
        viewX: 0,
        viewY: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        scale: Math.max(SCREEN_WIDTH / this._videoTexture.width, SCREEN_HEIGHT / this._videoTexture.height)
      })
    }

    for(const viewDef of viewDefs) {
      const view = new PIXI.Sprite(this._videoTexture);
      view.anchor.set(0.5);
      view.scale.set(viewDef.scale)
      this._videoContainer.addChild(view);
      view.x = viewDef.viewX + viewDef.cameraX*viewDef.scale;
      view.y = viewDef.viewY + viewDef.cameraY*viewDef.scale;

      const viewMask = new PIXI.Graphics();
      viewMask.beginFill(0xFFFFFF);
      viewMask.drawRect(
        viewDef.viewX - viewDef.width / 2,
        viewDef.viewY - viewDef.height / 2,
        viewDef.width,
        viewDef.height
      );
      viewMask.endFill();
      this._videoContainer.addChild(viewMask);
      view.mask = viewMask;
    }

  }

  render(renderer) {
    super.render(renderer)
    //this._videoContainer.alpha = this.progress
    this._videoContainer.visible = (0.1 + 0.9*Math.random()) < this.progress
  }


}