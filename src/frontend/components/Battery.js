import LineArt from '../components/LineArt'
import TextField from './TextField'

export default class Battery extends PIXI.Container {
  constructor() {
    super()
    this.value = 0

    this._shape = new LineArt()
    this._shape.addSequence([
      -11.5, -6.5,
      11.5, -6.5,
      11.5, -3.5,
      13.5, -3.5,
      13.5, 3.5,
      11.5, 3.5,
      11.5, 6.5,
      -11.5, 6.5,
      -11.5, -6.5
    ])
    this.addChild(this._shape)

    this._bars = Array(4).fill(1)

    for(let i=0; i < this._bars.length; i++) {
      const m = 2 // margin
      const w = 18 // width
      const h = 4 // height
      const s = w/(this._bars.length-1) // step
      console.log(s)
      this._bars[i] = new PIXI.Graphics()
      this._bars[i].beginFill(0xffffff)
      this._bars[i].moveTo(-w/2 + Math.max(0, (s)*i-s+m), h)
      this._bars[i].lineTo(-w/2 + Math.max(0, s*(i+1)-m-s+m), h)
      this._bars[i].lineTo(-w/2 + Math.min(w, s*(i+1)-m), -h)
      this._bars[i].lineTo(-w/2 + (s)*i, -h)
      this._bars[i].lineTo(-w/2 + Math.max(0, (s)*i-s+m), h)
      this.addChild(this._bars[i])
    }

    this._label = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    })
    this.addChild(this._label)
    this._label.anchor.set(0, 0.6)
    this._label.x = 18

  }

  render(renderer) {

    this._shape.progress = this.progress

    for(let i=0; i < this._bars.length; i++) {
      this._bars[i].visible = ((0.1+0.8*this.value)/0.8)*this.progress >= (i+1)/(this._bars.length)
    }
    if(!this._bars[1].visible) {
      this._bars[0].alpha = 0.5+0.5*Math.cos(performance.now()*0.02)
    } else {
      this._bars[0].alpha = 1
    }
    this._label.progress = this.progress
    this._label.text = Math.round(this.value*100) + '%'
    super.render(renderer)
  }
}