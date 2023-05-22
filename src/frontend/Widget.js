import TitleCircle from "./circles/TitleCircle"

export default class Widget extends PIXI.Container {

  constructor(title) {
    super()
    this._title = title
    this._frame = new TitleCircle(title)
    this.addChild(this._frame)
    this._progress = 0
    this.size = 1
    this._bg = new PIXI.Graphics()
    this._bg.beginFill(0x000000, 0.01)
    this._bg.drawCircle(0, 0, 100)
    this.addChild(this._bg)
    this.interactive = true

    let lastClickTime = 0
    this.on('pointertap', () => {
      const now = performance.now()
      const dt = now - lastClickTime
      lastClickTime = now
      if(dt < 500) {
        this.emit('activate')
        lastClickTime = 0
      }
    });
  }

  render(r) {
    super.render(r)
    this._bg.scale.set(this.size)
    this._progress = Math.min(1, this._progress + 0.01)
    this._frame.size = this.size
    this._frame.progress = this._progress
  }

  toString() {
    return `[Widget title="${this._title}"]`
  }
}