import LineArt from "./LineArt"

export default class RoomPreview extends PIXI.Container{
  constructor() {
    super()

    this.size = 1
    this.progress = 0
    this._lastHash = ''
    this._bg = new LineArt()
    this.addChild(this._bg)

    this._coverCanvas = new PIXI.Graphics()
    this.addChild(this._coverCanvas)

    const backWallWidth = 80
    const backWallHeight = 40
    const sideWallWidth = 40
    const color = 0x555555

    const persp = (x, y) => {
      if(x == 0) return 0
      return y + x*y*0.02
    }

    const drawWindow = ({x1, x2, x3, x4, y1, y2, y3, y4})=> {
      //this._bg.addLine(x1, y1, x2, y2, 2, color)
      this._bg.addLine(x3, y3, x1, y1, 2, color)
      this._bg.addLine(x4, y4, x2, y2, 2, color)
    }

    this._windows = [
      {
        x1: -backWallWidth/2-sideWallWidth*0.9, y1: persp(sideWallWidth*0.9, -backWallHeight/4),
        x2: -backWallWidth/2 - sideWallWidth*0.55, y2: persp(sideWallWidth*0.55, -backWallHeight/4),
        x3: -backWallWidth/2-sideWallWidth*0.9, y3: persp(sideWallWidth*0.9, backWallHeight/2),
        x4: -backWallWidth/2 - sideWallWidth*0.55, y4: persp(sideWallWidth*0.55, backWallHeight/2),
      },
      {
        x1: -backWallWidth/2-sideWallWidth*0.45, y1: persp(sideWallWidth*0.45, -backWallHeight/4),
        x2: -backWallWidth/2 - sideWallWidth*0.1, y2: persp(sideWallWidth*0.1, -backWallHeight/4),
        x3: -backWallWidth/2-sideWallWidth*0.45, y3: persp(sideWallWidth*0.45, backWallHeight/2),
        x4: -backWallWidth/2 - sideWallWidth*0.1, y4: persp(sideWallWidth*0.1, backWallHeight/2),
      },
      {
        x1: -(backWallWidth/2)*0.6, y1: -(backWallHeight/2)*0.45,
        x2: -(backWallWidth/2)*0.2, y2: -(backWallHeight/2)*0.45,
        x3: -(backWallWidth/2)*0.6, y3: backWallHeight/2,
        x4: -(backWallWidth/2)*0.2, y4: backWallHeight/2,
      },
      {
        x1: backWallWidth/2 + sideWallWidth*0.5, y1: persp(sideWallWidth*0.5, -backWallHeight/4),
        x2: backWallWidth/2 + sideWallWidth*0.1, y2: persp(sideWallWidth*0.1, -backWallHeight/4),
        x3: backWallWidth/2 + sideWallWidth*0.5, y3: persp(sideWallWidth*0.5, backWallHeight/2),
        x4: backWallWidth/2 + sideWallWidth*0.1, y4: persp(sideWallWidth*0.1, backWallHeight/2),
      },
      {
        x1: backWallWidth/2 + sideWallWidth*0.9, y1: persp(sideWallWidth*0.9, -backWallHeight/4),
        x2: backWallWidth/2 + sideWallWidth*0.5, y2: persp(sideWallWidth*0.5, -backWallHeight/4),
        x3: backWallWidth/2 + sideWallWidth*0.9, y3: persp(sideWallWidth*0.9, backWallHeight/2),
        x4: backWallWidth/2 + sideWallWidth*0.5, y4: persp(sideWallWidth*0.5, backWallHeight/2),
      }
    ]
    this.covers = this._windows.map(() => 0)

    // back wall
    this._bg.addLine(-backWallWidth/2, -backWallHeight/2, -backWallWidth/2, backWallHeight/2, 1, color)
    this._bg.addLine(-backWallWidth/2, -backWallHeight/2, backWallWidth/2, -backWallHeight/2, 1, color)
    this._bg.addLine(backWallWidth/2, backWallHeight/2, backWallWidth/2, -backWallHeight/2, 1, color)
    this._bg.addLine(backWallWidth/2, backWallHeight/2, -backWallWidth/2, backWallHeight/2, 1, color)

    // left wall
    this._bg.addLine(-backWallWidth/2, -backWallHeight/2, -backWallWidth/2-sideWallWidth, persp(sideWallWidth, -backWallHeight/2), 1, color)
    this._bg.addLine(-backWallWidth/2, backWallHeight/2, -backWallWidth/2-sideWallWidth, persp(sideWallWidth, backWallHeight/2), 1, color)

    // right wall
    this._bg.addLine(backWallWidth/2, -backWallHeight/2, backWallWidth/2+sideWallWidth, persp(sideWallWidth, -backWallHeight/2), 1, color)
    this._bg.addLine(backWallWidth/2, backWallHeight/2, backWallWidth/2+sideWallWidth, persp(sideWallWidth, backWallHeight/2), 1, color)

    this._windows.forEach(drawWindow)
  }

  render(renderer) {
    super.render(renderer)

    this._bg.size = this.size
    this._bg.progress = this.progress

    const hash = this.covers.map(c => c.toFixed(3)).join('|') + `|${this.size}|${this.progress}`
    if(hash === this._lastHash) {
      return 
    }
    this._lastHash = hash

    this._coverCanvas.clear()
    this._coverCanvas.beginFill(0xffffff)
    this._coverCanvas.alpha = this.progress
    
    const drawCover = ({x1, x2, x3, x4, y1, y2, y3, y4}, position) => {
      const p = (0.05 + 0.95*position)*this.progress
      this._coverCanvas.moveTo(x1*this.size, y1*this.size)
      this._coverCanvas.lineTo(x2*this.size, y2*this.size)
      this._coverCanvas.lineTo(x4*this.size, (y4*p + y2*(1-p))*this.size)
      this._coverCanvas.lineTo(x3*this.size, (y3*p + y1*(1-p))*this.size)
    }
    this._windows.forEach((w, i) => drawCover(w, this.covers[i]))


  }
}