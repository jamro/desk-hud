export default class DotCircle extends PIXI.Container {
  constructor() {
    super()
    this._shapes = new PIXI.Graphics()
    this.addChild(this._shapes)

    this.size = 1
    this.progress = 0
    this.count = 30
    this.countMax = 100000
    this.length = 0.5

    this._updateHash = ''
  }

  render(renderer) {
    super.render(renderer)

    const hash = `${this.size.toFixed(3)}|${this.progress.toFixed(3)}|${this.length.toFixed(3)}|${this.count.toFixed(0)}|${this.countMax.toFixed(0)}`
    if(this._updateHash === hash) return
    this._updateHash = hash

    this._shapes.clear()
    this._shapes.beginFill(0xff0000)

    const a = 2 * Math.PI / this.count

    for(let i=0; i < this.countMax && i < this.count; i++) {
      this._shapes.drawCircle(
        this.size*100*Math.sin(i*a),
        -this.size*100*Math.cos(i*a),
        2.5*this.size*this.progress
      )
    }
  }
}