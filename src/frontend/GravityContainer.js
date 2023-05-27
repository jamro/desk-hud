export default class GravityContainer extends PIXI.Container {

  constructor(content) {
    super()
    this._content = content
    this.addChild(content)
    this._targetX = 0
    this._targetY = 0
    this._targetSize = 1
    this._vx = 0
    this._vy = 0
  }

  get content() {
    return this._content
  }

  set size(v) {
    this._content.size = v
  }

  get size() {
    return this._content.size
  }

  set targetSize(v) {
    if(this._targetSize === v) return
    this.content.isMoving = true
    this._targetSize = v
  }

  get targetSize() {
    return this._targetSize
  }

  set targetX(v) {
    this._targetX = v
  }

  get targetX() {
    return this._targetX
  }


  set targetY(v) {
    this._targetY = v
  }

  get targetY() {
    return this._targetY
  }

  applyGravityForce(sourceX, sourceY, force=1) {
    const dx = sourceX - this.x
    const dy = sourceY - this.y
    const distance = Math.sqrt(dx*dx + dy*dy)

    if(force > 0 && distance < 20) {
      this._vx = 0
      this._vy = 0
      this.x = sourceX
      this.y = sourceY
    } else {
      this._vx += dx/100
      this._vy += dy/100
    }
  }

  render(renderer) {
    this.x += this._vx
    this.y += this._vy

    if(this.content.isMoving && Math.max( Math.abs(this._vx), Math.abs(this._vy)) < 10) {
      this.content.isMoving = false
    }
    this.size += (this._targetSize - this.size)/5

    if(Math.abs(this._targetSize - this.size) < 0.01) this.size = this._targetSize
    super.render(renderer)


  }
  
}