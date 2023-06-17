import ProgressCircle from './circles/ProgressCircle'
import LineArt from './components/LineArt'

export default class CpuFan extends PIXI.Container {

  constructor() {
    super()

    this.speed = 0
    this.isAuto = false

    this.progress = 0

    this._bg = new PIXI.Graphics()
    this._bg.beginFill(0x000000, 0.001)
    this._bg.drawCircle(0, 0, 30)
    this.addChild(this._bg)

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
      points.push(...coord(a, 3))
      points.push(...coord(a+step*0.5, 10))
      points.push(...coord(a+step*0.7, 11))
      points.push(...coord(a+step*1.1, 10))
      points.push(...coord(a+step*0.9, 7))
      points.push(...coord(a+step*0.75, 3))
    }

    this._turbine.addSequence(points, 2, 0x666666)

    this._frame = new ProgressCircle()
    this._frame.value = 1
    this._frame.size = 0.14
    this._frame.alpha = 0.4
    this.addChild(this._frame)

  }

  render(renderer) {
    super.render(renderer)

    this._turbine.progress = this.progress

    const turbineSpeed = this.isAuto ? 0.5 : this.speed

    this._turbine.rotation += 0.3*turbineSpeed
    this._frame.progress = this.progress
    this._bg.visible = this.progress > 0
  }

}