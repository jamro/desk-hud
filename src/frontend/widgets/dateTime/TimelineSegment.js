import LineArt from "../../components/LineArt"
import TextField from "../../components/TextField"

export default class TimelineSegment extends PIXI.Container {
  constructor() {
    super()
    
    this.progress = 0

    const h = 34

    this._bg = new PIXI.Graphics()
    this._bg.beginFill(0x666666)
    this._bg.drawRect(30*5, -h/2, 14*30, h)
    this._bg.beginFill(0xcccccc)
    this._bg.drawRect(30*8, -h/2, 8*30, h)
    this.addChild(this._bg)

    const lightNumbers =  Array(24).fill(1).map((_, i) => (i < 8 || i > 15) ? String(i+1).padStart(2, '0') : '  ')
    const darkNumbers =  Array(24).fill(1).map((_, i) => (i < 8 || i > 15) ? '  ' : String(i+1).padStart(2, '0'))

    this._hourLabels = new TextField(lightNumbers.join(' '), {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 13.5,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._hourLabels.x = 4
    this._hourLabels.y = 0
    this._hourLabels.anchor.set(0, 0.5)
    this.addChild(this._hourLabels)

    this._darkHourLabels = new TextField(darkNumbers.join(' '), {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 13.5,
      fill: '#000000',
      stroke: "#000000",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._darkHourLabels.x = 4
    this._darkHourLabels.y = 0
    this._darkHourLabels.anchor.set(0, 0.5)
    this.addChild(this._darkHourLabels)

  }

  render(renderer) {
    this._hourLabels.progress = this.progress
    this._darkHourLabels.progress = this.progress
    this._bg.alpha = this.progress
    
    super.render(renderer)
  }
}