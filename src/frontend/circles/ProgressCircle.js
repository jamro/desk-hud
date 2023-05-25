
export default class ProgressCircle extends PIXI.Container {

  constructor() {
    super()
    this._canvas = new PIXI.Graphics()
    this.addChild(this._canvas)
    this._progress = 0
    this.value = 0
    this.lineWidth = 2
    this._presentedValue = 0
    this._size = 1
    this.color = 0xffffff
    this._lastUpdateHash = ''
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

    this._presentedValue += (this.value - this._presentedValue)/30

    const updateHash = this.size.toFixed(3) + '|' + this.progress.toFixed(3) + '|' + this._presentedValue.toFixed(3) + '|' + this.color.toString(16) + '|' + this.lineWidth.toFixed(0)
    if(updateHash === this._lastUpdateHash) {
      return;
    }
    this._lastUpdateHash = updateHash
    this._canvas.clear()

    const r = 100*this.size
    const da = Math.PI/100

    this._canvas.moveTo(
      r * Math.sin(0),
      -r * Math.cos(0)
    )

    this._canvas.lineStyle({
      color: this.color,
      width: this.lineWidth,
      alpha: 0.7
    })



    for(let a=0; a <= Math.PI * 2 * this._presentedValue * this.progress; a+=da) {
      this._canvas.lineTo(
        r * Math.sin(a),
        -r * Math.cos(a)
      )
    }
  }

}