export default class Icon extends PIXI.Container {

  constructor(code) {
    super()

    this._code = code
    this._color = 0xffffff

    const bg = new PIXI.Graphics()
    this.addChild(bg)
    bg.beginFill(0x000000, 0.01)
    bg.drawCircle(0, 0, 25)
    
    this._icon = new PIXI.Text(code ? String.fromCharCode(code) : '', {
      fontFamily: 'Material Symbols Outlined',
      fontSize: 62,
      fill: 0xffffff,
      stroke: 0xffffff,
      align: 'center',
    })
    this._icon.anchor.set(0.5, 0.35)
    this.addChild(this._icon)
  }

  set code(s) {
    this._code = s
    this._icon.text = s ? String.fromCharCode(s) : ''
  }

  get code() {
    return this._code
  }

  set color(c) {
    this._color = c
    this._icon.tint = c
  }

  get color() {
    return this._color
  }

  render(renderer) {
    super.render(renderer)
  }
}