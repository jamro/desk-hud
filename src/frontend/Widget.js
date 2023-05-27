import TitleCircle from "./circles/TitleCircle"

export default class Widget extends PIXI.Container {

  constructor(title) {
    super()
    this._container = new PIXI.Container()
    super.addChild(this._container)
    this._title = title
    this._isMoving = false
    this._preMoveSize = 1
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

  set isMoving(v) {
    if(this._isMoving === v) return 
    this._container.cacheAsBitmap = v
    this._isMoving = v
    if(!v) {
      this._container.scale.set(1)
    } else {
      this._preMoveSize = this.size
    }
  }

  get isMoving() {
    return this._isMoving
  }

  addChild(c) {
    this._container.addChild(c)
  }
  addChildAt(c, n) {
    this._container.addChildAt(c, n)
  }
  removeChild(c) {
    this._container.removeChild(c)
  }

  get progress() {
    return this._progress
  }

  set progress(v) {
    this._progress = v
  }

  render(r) {
    super.render(r)
    this._bg.scale.set(this.size)
    this._frame.size = this.size
    this._frame.progress = this._progress

    if(this._isMoving) {
      this._container.scale.set(this.size/this._preMoveSize)
    }
  }

  toString() {
    return `[Widget title="${this._title}"]`
  }
}