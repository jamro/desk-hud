import ArchText from "../components/ArchText"
import GaugePointer from "../components/GaugePointer"
import ProgressCircle from "./ProgressCircle"
import TickCircle from "./TickCircle"

export default class ScaleCircle extends PIXI.Container {
  constructor(scaleMin=0, scaleMax=10, unit='', labelCount=5, angleRange=Math.PI) {
    super()
    this.value = scaleMin
    this.valueMin = scaleMin
    this.valueMax = scaleMin
    this._scaleMin = scaleMin
    this._scaleMax = scaleMax
    this._angleRange = angleRange
    this.size = 1
    this.progress = 1
    this._lastHash= ''
    const scaleRange = scaleMax - scaleMin

    this._rangeIndicator = new ProgressCircle()
    this._rangeIndicator.color = 0xff0000
    this._rangeIndicator.lineWidth = 10
    this.addChild(this._rangeIndicator)

    const tickShrink = (Math.PI*2)/angleRange

    this._ticksSmall = new TickCircle()
    this._ticksSmall.count = tickShrink*scaleRange
    this._ticksSmall.countMax = Math.floor(this._ticksSmall.count/tickShrink)+1
    this.addChild(this._ticksSmall)

    this._ticksLarge = new TickCircle()
    this._ticksLarge.count = Math.floor(tickShrink*scaleRange/5)
    this._ticksLarge.countMax = Math.floor(this._ticksLarge.count/tickShrink)+1
    this.addChild(this._ticksLarge)

    const scaleStep = scaleRange/(labelCount-1)
    this._labels = Array(labelCount)
      .fill(0)
      .map((v, i) => Math.round(scaleMin + scaleStep*i))
      .map((v, i, arr) => {
        const txt = new ArchText()
        txt.text = String(v) + unit
        txt.positionOffset = - (i/(arr.length-1)) * this._angleRange
        txt.radius = 100
        txt.progress = 1
        this.addChild(txt)
        return txt
      })

      this._pointer = new GaugePointer('arrow')
      this._pointer.pointerWidth = 10
      this.addChild(this._pointer)
  }

  render(renderer) {
    super.render(renderer)

    const hash = `${this.size.toFixed(3)}|${this.progress.toFixed(3)}|${this.value.toFixed(1)}|${this.valueMin.toFixed(1)}|${this.valueMax.toFixed(1)}|`
    if(this._lastHash === hash) return 
    this._lastHash = hash

    this._ticksSmall.size = this.size
    this._ticksSmall.progress = Math.min(1, this.progress*2)
    this._ticksSmall.length = this.size * 0.05

    this._ticksLarge.size = this.size * 0.95
    this._ticksLarge.progress = Math.max(0, this.progress*2-1)
    this._ticksLarge.length = this.size * 0.05
    this._ticksLarge.length = this.size * 0.05

    for(let label of this._labels) {
      label.progress = this.progress
      label.radius = this.size*110
      label.fontSize = this.size * 9
    }

    const tickGrow = (this._angleRange/(Math.PI*2))
    this._pointer.progress = this.progress
    this._pointer.size = this.size*(0.9 + 0.04/Math.max(0.5, this.size))
    this._pointer.pointerWidth = 10/(0.5 + 0.5*Math.max(0.5, this.size))
    this._pointer.pointerRotation =  this._angleRange * ((this.value - this._scaleMin)/(this._scaleMax - this._scaleMin))

    const scaleRange = this._scaleMax - this._scaleMin
    this._rangeIndicator.size =  this.size*0.95
    this._rangeIndicator.lineWidth = 4*this.size
    this._rangeIndicator.progress = this.progress
    const minPos = (this.valueMin - this._scaleMin)/scaleRange
    this._rangeIndicator.rotation =  this._angleRange * minPos
    this._rangeIndicator.value = tickGrow*((this.valueMax - this._scaleMin)/scaleRange - minPos)
    this._rangeIndicator.visible = (this.size  === 1)
  }
}