export default class TickCircle extends PIXI.Container {
  constructor() {
    super()
    this._lines = new PIXI.Graphics()
    this.addChild(this._lines)

    this.size = 1
    this.progress = 0
    this.count = 10
    this.length = 0.5
    this.countMax = 100000

    this._updateHash = ''
  }

  render(renderer) {
    super.render(renderer)

    const hash = `${this.size.toFixed(3)}|${this.progress.toFixed(3)}|${this.length.toFixed(3)}|${this.count.toFixed(0)}|${this.countMax.toFixed(0)}`
    if(this._updateHash === hash) return
    this._updateHash = hash

    this._lines.clear()
    this._lines.lineStyle({
      color: 0xffffff,
      alpha: 0.3,
      width: 2
    })
    const a = 2 * Math.PI / this.count

    const l2 = 100*this.size
    const l1 = this.progress * 100*this.size*(1-this.length) + (1-this.progress) * l2

    for(let i=0; i < this.countMax && i < this.count; i++) {
      this._lines.moveTo(
        l1*Math.sin(i*a),
        -l1*Math.cos(i*a),
      )
      this._lines.lineTo(
        l2*Math.sin(i*a),
        -l2*Math.cos(i*a),
      )
    }
  }
}