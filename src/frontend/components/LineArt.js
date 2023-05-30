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
  }

  addLine(x1, y1, x2, y2, width=1, color=0xffffff, alpha=1, startTime=0, endTime=1) {
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
    this._lines[groupId].children.push({x1, x2, y1, y2, startTime, endTime})
  }

  addSequence(coordinates, width=1, color=0xffffff, alpha=1, startTime=0, endTime=1) {
    let totalLength = 0

    for(let i=2; i < coordinates.length; i+=2) {
      const dx = coordinates[i] - coordinates[i-2]
      const dy = coordinates[i+1] - coordinates[i-1]
      totalLength += Math.sqrt(dx*dx + dy*dy)
    }
    let time = 0
    for(let i=2; i < coordinates.length; i+=2) {
      const dx = coordinates[i] - coordinates[i-2]
      const dy = coordinates[i+1] - coordinates[i-1]
      const nextTime = time + Math.sqrt(dx*dx + dy*dy) / totalLength
      this.addLine(
        coordinates[i-2],
        coordinates[i-1],
        coordinates[i],
        coordinates[i+1],
        width, 
        color, 
        alpha,
        startTime + time * (endTime - startTime),
        startTime + nextTime * (endTime - startTime)
      )
      time = nextTime
    }
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
        let lineProgress = Math.min(1, Math.max(0, this.progress - line.startTime)/(line.endTime - line.startTime))
        this._canvas.lineTo(
          (line.x1 + (line.x2 - line.x1)*lineProgress)*this.size,
          (line.y1 + (line.y2 - line.y1)*lineProgress)*this.size,
        )
      }
    }
  }

}