import ProgressCircle from '../../circles/ProgressCircle'
import LineArt from '../../components/LineArt'
import TextField from '../../components/TextField'

export default class Fan extends PIXI.Container {

  constructor() {
    super()

    this.speed = 0
    this.isAuto = false

    this.progress = 0

    this._pointer = new LineArt()
    this._pointer.addSequence([
      -60, -17,
      -30, -17,
      -10, -10,
    ], 1, 0x888888)
    this.addChild(this._pointer)

    this._turbine = new LineArt()
    this.addChild(this._turbine)

    const coord = (a, r) => {
      return [
        r * Math.sin(a),
        -r * Math.cos(a),
      ]
    }

    const points = []
    const step = 2*Math.PI/6
    for(let a=0; a <= Math.PI*2; a+=step) {
      points.push(...coord(a, 5))
      points.push(...coord(a+step*0.5, 20))
      points.push(...coord(a+step*0.7, 21))
      points.push(...coord(a+step*1.1, 20))
      points.push(...coord(a+step*0.9, 15))
      points.push(...coord(a+step*0.75, 7))
    }

    this._turbine.addSequence(points, 2, 0xaaaaaa)

    this._frame = new ProgressCircle()
    this._frame.value = 1
    this._frame.size = 0.25
    this.addChild(this._frame)

    this._speedBar = new ProgressCircle()
    this._speedBar.value = 1
    this._speedBar.size = 0.3
    this._speedBar.color = 0xff0000
    this._speedBar.lineWidth = 3
    this.addChild(this._speedBar)

    this._label = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 9,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'right',
    })
    this._label.anchor.set(1, 0.5)
    this._label.y = -25
    this._label.x = -32
    this.addChild(this._label)

  }

  render(renderer) {
    super.render(renderer)

    this._turbine.progress = this.progress

    const turbineSpeed = this.isAuto ? 0.5 : this.speed

    this._turbine.rotation += 0.3*turbineSpeed
    this._frame.progress = this.progress
    this._speedBar.progress = this.progress * turbineSpeed
    this._label.progress = this.progress
    this._label.text = this.isAuto ? 'Auto' : Math.round(100*this.speed) + '%'
    this._pointer.progress = this.progress
  }

}