
export default class ProgressCircle extends PIXI.Container {

  constructor() {
    super()
    this._canvas = new PIXI.Graphics()
    this.addChild(this._canvas)
    this._progress = 0
    this.value = 0
    this._presentedValue = 0
    this._size = 1
    this.color = 0xffffff
  }

  set progress(v) {
    this._progress = v
  }

  get progress() {
    return this._progress
  }

  set size(v) {
    this._size = v
  }

  get size() {
    return this._size
  }

  render(renderer) {
    super.render(renderer)
    this._canvas.clear()

    const r = 100*this.size
    const da = Math.PI/100

    this._canvas.moveTo(
      r * Math.sin(0),
      -r * Math.cos(0)
    )

    this._canvas.lineStyle({
      color: this.color,
      width: 2,
      alpha: 0.7
    })

    this._presentedValue += (this.value - this._presentedValue)/30

    for(let a=0; a <= Math.PI * 2 * this._presentedValue * this.progress; a+=da) {
      this._canvas.lineTo(
        r * Math.sin(a),
        -r * Math.cos(a)
      )
    }
  }

}