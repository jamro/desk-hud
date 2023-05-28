export default class LineArt extends PIXI.Container {

  constructor() {
    super()
    this.size = 1
    this.progress = 0
    this._canvas = new PIXI.Graphics()
    this.addChild(this._canvas)
    this._linesChanged = false
    this._lastHash = ''

    this._lineGroups = []
    this._lines = {}

    /*
    this._canvas.lineStyle({
      width: 1,
      alpha: 0.8,
      color: 0xffffff
    })
    this._canvas.drawRect(-20, -20, 40, 40)
    */
  }

  addLine(x1, y1, x2, y2, width=1, color=0xffffff, alpha=1) {
    this._linesChanged = true
    const groupId = `${width.toFixed(1)}|${color.toString(16)}|${alpha.toFixed(2)}`
    this._lineGroups.push(groupId)
    if(!this._lines[groupId]) {
      this._lines[groupId] = {
        width, 
        color, 
        alpha, 
        children: []
      }
    }
    this._lines[groupId].children.push({x1, x2, y1, y2})
  }

  render(renderer) {
    const hash = `${this.size.toFixed(3)}|${this.progress.toFixed(3)}`
    if(hash === this._lastHash && !this._linesChanged) {
      this._canvas.cacheAsBitmap = true
      super.render(renderer)
      return
    }
    this._canvas.cacheAsBitmap = false
    super.render(renderer)
    this._lastHash = hash
    this._linesChanged = false

    this._canvas.clear()

    for(let groupId of this._lineGroups) {
      const group = this._lines[groupId]
      this._canvas.lineStyle({
        width: group.width,
        alpha: group.alpha,
        color: group.color
      })
      for(let line of group.children) {
        this._canvas.moveTo(
          line.x1*this.size, 
          line.y1*this.size
        )
        this._canvas.lineTo(
          (line.x1 + (line.x2 - line.x1)*this.progress)*this.size,
          (line.y1 + (line.y2 - line.y1)*this.progress)*this.size,
        )
      }
    }
  }

}