export default class ProgressBar extends PIXI.Container {
  constructor(segmentCount=10) {
    super()

    this._value = 0

    this._segments = Array(segmentCount).fill(1).map((_, i) => {
      const segment = new PIXI.Graphics()
      segment.beginFill(0xffffff)
      segment.moveTo(5,0)
      segment.lineTo(13,0)
      segment.lineTo(8,10)
      segment.lineTo(0,10)
      segment.lineTo(5,0)
      segment.alpha = 0
      this.addChild(segment)
      segment.x = 10 * i
      return segment
    })

    const limit = new PIXI.Graphics()
    limit.beginFill(0xffffff)
    limit.moveTo(5,0)
    limit.lineTo(7,0)
    limit.lineTo(2,10)
    limit.lineTo(0,10)
    limit.lineTo(5,0)
    this.addChild(limit)
    limit.x = 10 * this._segments.length
  }

  set value(v) {
    if(this._value === v) return
    this._value = v

    const segmentWidth = 1 / this._segments.length
    const fullSegments = Math.floor(this.value/segmentWidth)

    for(let i=0; i < this._segments.length; i++) {
      const segment = this._segments[i]

      if(i < fullSegments) {
        segment.alpha = 1
      } else if(i === fullSegments) {
        segment.alpha = (this.value - i * segmentWidth)/segmentWidth
      } else {
        segment.alpha = 0.1
      }
      
    }
  }

  get value() {
    return this._value
  }
}