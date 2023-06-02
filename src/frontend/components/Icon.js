export default class Icon extends PIXI.Container {

  constructor(code=0xe813) {
    super()

    const bg = new PIXI.Graphics()
    this.addChild(bg)
    bg.beginFill(0x000000, 0.01)
    bg.drawCircle(0, 0, 25)
    
    this._icon = new PIXI.Text(String.fromCharCode(code), {
      fontFamily: 'Material Symbols Outlined',
      fontSize: 31,
      fill: '#ffffff',
      stroke: "#ffffff",
      align: 'center',
    })
    this._icon.anchor.set(0.5, 0.35)
    this.addChild(this._icon)
  }

  render(renderer) {
    super.render(renderer)
  }
}