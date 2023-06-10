export default class DragButton extends PIXI.Container {
  constructor(yMin, yMax) {
    super()

    this.y = yMin
    this._yMin = yMin
    this._yMax = yMax
    this._pos = 0

    this._clicker = new PIXI.Graphics()
    this._clicker.beginFill(0x000000, 0.001)
    this._clicker.drawCircle(0, 0, 25)
    this.addChild(this._clicker)

    this._canvas = new PIXI.Graphics()
    this._canvas.beginFill(0xffffff)
    this._canvas.lineStyle({
      width: 2,
      color: 0x000000
    })
    this._canvas.drawCircle(0, 0, 10)
    this._canvas.moveTo(5, 2)
    this._canvas.lineTo(0, 5)
    this._canvas.lineTo(-5, 2)
    this._canvas.moveTo(5, -2)
    this._canvas.lineTo(0, -5)
    this._canvas.lineTo(-5, -2)
    this.addChild(this._canvas)

    this.interactive = true
    this.dragging = false
    this.offsetY = 0

    this.on('mousedown', (e) => this._startDrag(e.data.global.y))
    this.on('mousemove', (e) => this._updateDrag(e.data.global.y))
    this.on('mouseup', (e) => this._stopDrag(e.data.global.y))

    this.on('pointerdown', (e) => this._startDrag(e.data.global.y))
    this.on('pointermove', (e) => this._updateDrag(e.data.global.y))
    this.on('pointerup', (e) => this._stopDrag(e.data.global.y))
  }

  get pos() {
    return this._pos
  }

  set pos(v) {
    this._pos = v
  }

  _boundY(y) {
    return Math.min(this._yMax, Math.max(this._yMin, y))
  }

  _startDrag(y) {
    this.offsetY = y - this.y
    this._clicker.scale.set(100)
    this.dragging = true
    const parent = this.parent
    parent.removeChild(this)
    parent.addChild(this)
  }

  _updateDrag(y) {
    if (this.dragging) {
      this.y = this._boundY(y - this.offsetY)
    }
  }

  _stopDrag(y) {
    if(!this.dragging) return
    this.y = this._boundY(y - this.offsetY)
    this._clicker.scale.set(1)
    this.dragging = false
    this.emit('posChange', (this.y - this._yMin)/(this._yMax - this._yMin))
  }

  render(renderer) {
    if(!this.dragging) {
      this.y += (this._yMin + this._pos * (this._yMax - this._yMin)- this.y)/5
    }
    super.render(renderer)
  }

}