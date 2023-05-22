import TitleCircle from "./circles/TitleCircle"

export default class Widget extends PIXI.Container {

  constructor() {
    super()
    this._frame = new TitleCircle()
    this.addChild(this._frame)
    this._progress = 0
    this.size = 1
  }

  render(r) {
    super.render(r)
    this._progress = Math.min(1, this._progress + 0.05)
    this._frame.size = this.size
    this._frame.progress = this._progress
  }

}