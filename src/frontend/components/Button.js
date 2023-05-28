export default class Button extends PIXI.Container {

  constructor() {
    super()
    this._blink = false
    this._clicker = new PIXI.Graphics()
    this._clicker.beginFill(0x000000, 0.75)
    this._clicker.drawCircle(0, 0, 30)
    this._clicker.endFill()
    this._clicker.lineStyle({
      color: 0xcccccc,
      width: 2
    })
    this._clicker.drawCircle(0, 0, 25)
    this._clicker.lineStyle({
      color: 0x888888,
      width: 1
    })
    this._clicker.drawCircle(0, 0, 22)

    this.addChild(this._clicker)

    this.interactive = true

    this.on('pointertap', (e) => {
      this._blink = true
    })
  }

  render(renderer) {
    super.render(renderer)

    const targetClickerScale = this._blink ? 1.2 : 1
    const clickerScale = this._clicker.scale.x + (targetClickerScale - this._clicker.scale.x )/5
    this._clicker.scale.set(clickerScale)
    if(this._clicker.scale.x >= 1.18) {
      this._blink = false
    }

  }



}