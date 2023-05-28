import Button from "./Button"

export default class IconButton extends Button {

  constructor(code) {
    super()
    
    this._icon = new PIXI.Text(String.fromCharCode(code), {
      fontFamily: 'Material Symbols Outlined',
      fontSize: 29,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._icon.anchor.set(0.5, 0.35)
    this.addChild(this._icon)
  }

  render(renderer) {
    super.render(renderer)

    
  }
}