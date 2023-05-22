export default class SleepToggle extends PIXI.Container {
  constructor() {
    super()
    this._clicker = new PIXI.Graphics()
    this._clicker.beginFill(0x000000)
    this._clicker.drawCircle(0, 0, 40)
    this._clicker.beginFill(0xff0000)
    this._clicker.drawCircle(0, 0, 4)
    this.addChild(this._clicker)
    this.interactive = true
  }
}