export default class ScrollContainer extends PIXI.Container {
  constructor(windowWidth, windowHeight) {
    super()
    this.offsetX = 0
    this.offsetY = 0
    this._windowWidth = windowWidth
    this._windowHeight = windowHeight
    this.dragging = false

    this.contentRect = {
      x: -0.5*Number.MAX_VALUE,
      y: -0.5*Number.MAX_VALUE,
      width: Number.MAX_VALUE,
      height: Number.MAX_VALUE,
    }

    this._content = new PIXI.Container()
    super.addChild(this._content)

    this._contentMask = new PIXI.Graphics()
    this._contentMask.beginFill(0x0000ff)
    this._contentMask.drawRect(0, 0, windowWidth, windowHeight)
    super.addChild(this._contentMask)
    this._content.mask = this._contentMask

    this._scroller = new PIXI.Graphics()
    this._scroller.beginFill(0x000000, 0.0001)
    this._scroller.drawRect(0, 0, windowWidth, windowHeight)
    this._scroller.interactive = true
    super.addChild(this._scroller)
    this._scroller.on('mousedown', (e) => this._startDrag(e.data.global))
    this._scroller.on('mouseup', (e) => this._stopDrag(e.data.global))
    this._scroller.on('pointerdown', (e) => this._startDrag(e.data.global))
    this._scroller.on('pointermove', (e) => this._updateDrag(e.data.global))
    this._scroller.on('pointerup', (e) => this._stopDrag(e.data.global))
  }

  _boundX(v) {
    const maxLimit = -this.contentRect.x
    const minLimit = -(this.contentRect.x + Math.max(0, this.contentRect.width - this._windowWidth))
    return Math.max(minLimit, Math.min(maxLimit, v))
  }


  _boundY(v) {
    const maxLimit = -this.contentRect.y
    const minLimit = -(this.contentRect.y + Math.max(0, this.contentRect.height - this._windowHeight))
    return Math.max(minLimit, Math.min(maxLimit, v))
  }

  _startDrag({x, y}) {
    this.offsetX = x - this._content.x
    this.offsetY = y - this._content.y
    this._scroller.scale.set(100)
    this.dragging = true
  }

  _updateDrag({x, y}) {
    if (this.dragging) {
      this._content.x = this._boundX(x - this.offsetX)
      this._content.y = this._boundY(y - this.offsetY)
    }
  }

  _stopDrag({x, y}) {
    if(!this.dragging) return
    this._content.x = this._boundX(x - this.offsetX)
    this._content.y = this._boundY(y - this.offsetY)
    this._scroller.scale.set(1)
    this._scroller.x = 0
    this.dragging = false
  }

  get contentMask() {
    return this._contentMask
  }

  get scroller() {
    return this._scroller
  }

  scrollTo(x, y) {
    this._content.x = this._boundX(x)
    this._content.y = this._boundX(y)
  }

  addChild(obj) {
    this._content.addChild(obj)
  }

  addChildAt(obj, index) {
    this._content.addChildAt(obj, index)
  }

  removeChild(obj) {
    this._content.removeChild(obj)
  }
}