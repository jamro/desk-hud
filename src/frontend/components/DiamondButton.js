import LineArt from "./LineArt"
import TextField from "./TextField"

export default class DiamondButton extends PIXI.Container {
  constructor(text='') {
    super()

    this.progress = 0
    this._active = false

    this._blackFill = new PIXI.Graphics()
    this.addChild(this._blackFill)
    this._blackFill.beginFill(0x000000)
    this._blackFill.moveTo(-45, -20)
    this._blackFill.lineTo(45, -20)
    this._blackFill.lineTo(65, 0)
    this._blackFill.lineTo(45, 20)
    this._blackFill.lineTo(-45, 20)
    this._blackFill.lineTo(-65, 0)
    this._blackFill.lineTo(-45, -20)

    this._refFill = new PIXI.Graphics()
    this.addChild(this._refFill)
    this._refFill.beginFill(0xff0000)
    this._refFill.moveTo(-45, -20)
    this._refFill.lineTo(45, -20)
    this._refFill.lineTo(65, 0)
    this._refFill.lineTo(45, 20)
    this._refFill.lineTo(-45, 20)
    this._refFill.lineTo(-65, 0)
    this._refFill.lineTo(-45, -20)
    this._refFill.alpha = 0

    this._frame = new LineArt()
    this.addChild(this._frame)
    this._frame.addSequence([
      -45, -20,
      45, -20,
      65, 0,
      45, 20,
      -45, 20,
      -65, 0,
      -45, -20
    ], 2, 0xffffff)
    this._frame.addSequence([
      -45+2, -20+3,
      45-2, -20+3,
      65-5, 0,
      45-2, 20-3,
      -45+2, 20-3,
      -65+5, 0,
      -45+2, -20+3
    ], 1, 0xffffff)
  
    this._label = new TextField(text, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this.addChild(this._label)

    this.interactive = true
    this.on('pointertap', () => {
      if(!this._active) {
        this.emit('activate')
      }
    })
  }

  set active(v) {
    this._active = v
  }

  get active() {
    return this._active
  }

  set text(v) {
    this._label.text = v
  }

  get text() {
    return this._label.text
  }

  render(renderer) {
    this._frame.progress = this.progress
    this._blackFill.alpha = this.progress
    this._refFill.alpha += ((this._active ? this.progress : 0) - this._refFill.alpha) / 7
    this._label.progress = this.progress
    this._label.style.stroke = this._active ? 0x000000 : 0xffffff
    this._label.style.fill = this._active ? 0x000000 : 0xffffff
    super.render(renderer)
  }

}