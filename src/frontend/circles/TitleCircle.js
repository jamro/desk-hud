import ArchText from "../components/ArchText"

export default class TitleCircle extends PIXI.Container {

  constructor(title='Widget') {
    super()
    this._canvas = new PIXI.Graphics()
    this._label = new ArchText()
    this._label.text = `|> ${title} <|`
    this.addChild(this._canvas)
    this.addChild(this._label)
    this._progress = 0
    this._size = 1
    this._updated = true
    this._stealTime = 0
  }

  set progress(v) {
    this._updated = this._updated || (this._progress !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._progress = v
  }

  get progress() {
    return this._progress
  }

  set size(v) {
    this._updated = this._updated || (this._size !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._size = v
  }

  get size() {
    return this._size
  }

  render(renderer) {
    super.render(renderer)
    if(!this._updated) {
      this._stealTime++
      this.cacheAsBitmap = this._stealTime > 10
      return 
    }

    this._label.progress = this.progress
    this._canvas.clear()

    const r = 100*this.size
    this._label.radius = r
    this._label.fontSize = 6 + 6 * this.size
    const da = Math.PI/20

    const [startAngle, endAngle] = this._label.startAngleRange

    this._canvas.moveTo(
      r * Math.sin(endAngle),
      -r * Math.cos(endAngle)
    )

    const angleDistance =  startAngle+Math.PI*2 - endAngle

    for(let a=endAngle; a <= endAngle + angleDistance * this.progress; a+=da) {
      const lineY = -r * Math.cos(a)
      this._canvas.lineStyle({
        color: 0xffffff,
        width: 2,
        alpha: lineY > 0 ? 0.3 : 0.8
      })
      this._canvas.lineTo(
        r * Math.sin(a),
        lineY
      )
    }
    this._canvas.lineTo(
      r * Math.sin(endAngle + angleDistance * this.progress),
      -r * Math.cos(endAngle + angleDistance * this.progress)
    )
    this._updated = false
    this._stealTime = 0 
  }

}