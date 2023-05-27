

class Dot extends PIXI.Graphics{
  constructor() {
    super()
    this._completed = null
    this._radius = null
    this._angle = null
    this.radius = 50
    this.angle = 0
    this.completed = false
  }

  set completed(v) {
    if(v === this._completed) return
    this._completed = v
    this.clear()
    if(!this.completed) {
      this.lineStyle({
        width: 1.5,
        alpha: 0.8,
        color: 0xffffff
      })
      this.beginFill(0x000000)
      this.drawCircle(0, 0, 4)
    } else {
      this.lineStyle({
        width: 2,
        alpha: 0.9,
        color: 0xffffff
      })
      this.moveTo(-4, -4)
      this.lineTo(4, 4)
      this.moveTo(4, -4)
      this.lineTo(-4, 4)
    }

  }
  get completed() {
    return this._completed
  }

  set radius(v) {
    this._radius = v
    this._updatePos()
  }
  get radius() {
    return this._radius
  }

  set angle(v) {
    this._angle = v
    this._updatePos()
  }
  get angle() {
    return this._angle
  }

  _updatePos() {
    this.x = this._radius*Math.sin(this.angle)
    this.y = -this._radius*Math.cos(this.angle)
    this.rotation = this.angle
  }

}


export default class TimelineCircle extends PIXI.Container {

  constructor(startTime, endTime, angularRange=Math.PI*2) {
    super()
    this._startTime = startTime
    this._endTime = endTime
    this._angularRange = angularRange
    this._startAngle = (Math.PI*2-angularRange)/2
    this._endAngle = this._startAngle+angularRange
    this.now = startTime
    this.size = 1
    this.progress = 0

    this._dots = []
  }

  setPoints(points) {
    this._points = points
    let dot
    while(this._dots.length > this._points.length) {
      this.removeChild(this._dots.pop())
    }
    while(this._dots.length < this._points.length) {
      dot = new Dot()
      dot.visible = false
      dot.angle = this._startAngle
      this.addChild(dot)
      this._dots.push(dot)
    }
  }

  render(renderer) {
    super.render(renderer)

    let incompleteIndex = 0
    for(let i=0; i < this._dots.length; i++) {
      const timestamp = this._points[i] || this.now
      const dot = this._dots[i]
      dot.visible = true
      if(!this._points[i]) {
        incompleteIndex++
        dot.completed = false
      } else {
        dot.completed = true
      }

      dot.alpha = this.progress
      const pos = (timestamp - this._startTime)/(this._endTime - this._startTime)
      let angle = this._startAngle + this._angularRange * this.progress * pos
      if(!dot.completed) {
        angle += incompleteIndex * 0.15
      }
      dot.angle = Math.max(this._startAngle, Math.min(this._endAngle, angle))
      dot.radius = this.size*100
    }
  }
}