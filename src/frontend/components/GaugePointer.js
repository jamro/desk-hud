export default class GaugePointer extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.size = 1
    this.pointerWidth = 2
    this._pointer = new PIXI.Graphics()
    this.addChild(this._pointer)

    this._pointerRotation = 0
    this._pointerUpdateHash = ''
  }

  set pointerRotation(v) {
    this._pointerRotation = v
  }
  get pointerRotation() {
    return this._pointerRotation
  }

  render(renderer) {
    super.render(renderer)

    this._pointer.rotation = -this.progress * Math.PI*2 + this._pointerRotation

    const hash = `${this.size.toFixed(3)}|${this.progress.toFixed(3)}|${this.pointerWidth.toFixed(1)}`
    if(hash !== this._pointerUpdateHash) {

      const c = 15 // center radius
      const p = 100*this.size*this.progress
      const w = this.pointerWidth

      this._pointer.clear()
      this._pointer.beginFill(0xffffff)
      this._pointer.moveTo(w, -c)
      this._pointer.lineTo(w, -Math.max(c, p-w))
      this._pointer.lineTo(0, -Math.max(c, p))
      this._pointer.lineTo(-w, -Math.max(c, p-2*w))
      this._pointer.lineTo(-w, -c)
      
      this._pointer.moveTo(w, c)
      this._pointer.lineTo(w, c + 0.15*p)
      this._pointer.lineTo(-w, c + 0.15*p)
      this._pointer.lineTo(-w, c)

      this._pointerUpdateHash = hash
    }

  }
}