export default class ArrowButton extends PIXI.Container {

  constructor() {
    super()
    this.progress = 1
    this._blink = false

    this._clicker = new PIXI.Graphics()
    this._clicker.beginFill(0x000000, 0.1)
    this._clicker.drawCircle(0, -10, 20)
    this.addChild(this._clicker)

    this._line = new PIXI.Graphics()
    this._line.lineStyle({
      width: 1,
      color: 0xffffff
    })
    this._line.moveTo(0, -20)
    this._line.lineTo(0, 10)
    this._line.alpha = 0.35
    this.addChild(this._line)

    this._arrow = new PIXI.Graphics()
    this._arrow.beginFill(0xffffff)
    this._arrow.moveTo(-10, 0)
    this._arrow.lineTo(10, 0)
    this._arrow.lineTo(0, -10)
    this.addChild(this._arrow)

    this.interactive = true

    this.on('pointertap', () => {
      this._blink = true
    })

  }

  render(renderer) {
    this._arrow.scale.set(this.progress)
    this._line.scale.y = this.progress
    this._clicker.visible = this.progress === 1

    const targetY = (1-this.progress)*20 + (this._blink ? -25 : 0)
    this._arrow.y += (targetY - this._arrow.y)/4

    if(this._arrow.y < -20) {
      this._blink = false
    }

    super.render(renderer)
  }

}