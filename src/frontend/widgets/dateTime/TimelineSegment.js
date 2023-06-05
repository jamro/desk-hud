import LineArt from "../../components/LineArt"
import TextField from "../../components/TextField"

export default class TimelineSegment extends PIXI.Container {
  constructor() {
    super()
    
    this.progress = 0

    const h = 34
    this._background = new LineArt()
    this.addChild(this._background)
    for(let i=0; i <=24; i++) {
      this._background.addLine(i * 30, -h/2, i * 30, h/2)
    }
    this._background.addLine(0, -h/2, 24 * 30, -h/2)
    this._background.addLine(0, h/2, 24 * 30, h/2)

    const hours = Array(24).fill(1).map((_, i) => String((i % 12) + 1).padStart(2, '0')).join(' ')
    this._hourLabels = new TextField(hours, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 13.5,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._hourLabels.x = 4
    this._hourLabels.y = -h*0.2
    this._hourLabels.anchor.set(0, 0.5)
    this.addChild(this._hourLabels)

    const postfix = Array(24).fill(1).map((_, i) => i < 12 ? 'Am' : 'Pm').join('  ') 

    this._postfixLabels = new TextField(postfix, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 10.16,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'left',
    })
    this._postfixLabels.x = 4
    this._postfixLabels.y = h*0.2
    this._postfixLabels.anchor.set(0, 0.5)
    this.addChild(this._postfixLabels)
  }

  render(renderer) {
    this._background.progress = this.progress
    this._hourLabels.progress = this.progress
    this._postfixLabels.progress = this.progress
    super.render(renderer)
  }
}