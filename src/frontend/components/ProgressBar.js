export default class ProgressBar extends PIXI.Container {
  constructor(segmentCount=10, height=10) {
    super()

    this.value = 0
    this.progress = 0

    this._segments = Array(segmentCount).fill(1).map((_, i) => {
      const segment = new PIXI.Graphics()
      segment.beginFill(0xffffff)
      segment.moveTo(height/2,0)
      segment.lineTo(height/2 + 8,0)
      segment.lineTo(8,height)
      segment.lineTo(0,height)
      segment.lineTo(height/2,0)
      segment.alpha = 0
      this.addChild(segment)
      segment.x = 10 * i
      return segment
    })

    this._limit = new PIXI.Graphics()
    this._limit.beginFill(0xffffff)
    this._limit.moveTo(height/2,0)
    this._limit.lineTo(height/2 + 2,0)
    this._limit.lineTo(2,height)
    this._limit.lineTo(0,height)
    this._limit.lineTo(height/2,0)
    this.addChild(this._limit)
    this._limit.x = 10 * this._segments.length
  }

  render(renderer) {
    const v = this.value*this.progress
    const segmentWidth = 1 / this._segments.length
    const fullSegments = Math.floor(v/segmentWidth)

    for(let i=0; i < this._segments.length; i++) {
      const segment = this._segments[i]

      if(i < fullSegments) {
        segment.alpha = 1
      } else if(i === fullSegments) {
        segment.alpha = (v - i * segmentWidth)/segmentWidth
      } else {
        segment.alpha = 0.1*this.progress
      }
    }

    this._limit.visible = (this.progress === 1)

    super.render(renderer)
  }
}