export default class Thermometer extends PIXI.Container {
  constructor(height=100, warnThreshold) {
    super()
    this.value = 0
    this.progress = 0
    this._barHeight = height
    this._bg = new PIXI.Graphics()
    this._bg.beginFill(0xffffff)
    this._bg.drawCircle(0, 0, 6)
    this._bg.drawRect(-4, -this._barHeight+4, 8, this._barHeight-4)
    this._bg.drawCircle(0, -this._barHeight+4, 4)
    
    this._bg.beginFill(0x000000)
    this._bg.drawRect(-3, -this._barHeight+4, 6, this._barHeight-4)
    this._bg.drawCircle(0, -this._barHeight+4, 3)
    this._bg.drawCircle(0, 0, 5)

    this._bg.beginFill(0xffffff)
    this._bg.drawCircle(0, 0, 3)
    if(warnThreshold) {
      this._bg.beginFill(0xff0000)
      this._bg.drawRect(8, -this._barHeight, 3, 4+(this._barHeight-4)*(1-warnThreshold))
      this._bg.endFill()
      this._bg.lineStyle({
        color: 0xffffff,
        width: 1
      })
      this._bg.moveTo(
        -7, 
        -this._barHeight+3 + (this._barHeight+3)*(1-warnThreshold),
      )
      this._bg.lineTo(
        7, 
        -this._barHeight+3 + (this._barHeight+3)*(1-warnThreshold),
      )
    }
    this.addChild(this._bg)

    this._pointer = new PIXI.Graphics()
    this._pointer.beginFill(0xffffff)
    this._pointer.drawRect(-1, -this._barHeight+3, 2, this._barHeight-3)
    this.addChild(this._pointer)
  }

  render(renderer) {
    super.render(renderer)
    this._pointer.scale.set(1, this.value*this.progress)
    this._bg.alpha = this.progress
  }
}