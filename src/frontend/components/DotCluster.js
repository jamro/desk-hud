import TextField from "./TextField"

export default class DotCluster extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.count = 0
    this.title = 'Count'

    this._dots = []
    
    const distance = 8
    let radius = 0
    let slotsLeft = 0
    let dotsLeft = 42
    let i = 1
    const gap = 27
    while(dotsLeft > 0) {
      if(slotsLeft === 0) {
        radius += distance
      }
      const circum = 2 * Math.PI * radius
      let pointCount = Math.floor(circum / distance)
      pointCount = Math.floor(pointCount/2)*2
      const da = radius ? (Math.PI * 2) / pointCount : 0
      if(slotsLeft === 0) {
        slotsLeft = Math.round((2*Math.PI)/da)
        i=1
      }

      let dot = this._createDot(distance*0.3, radius, i*da)
      if(dot.y > 0) {
        dot.y += gap/2
      } else {
        dot.y -= gap/2
      }
      this.addChild(dot)
      this._dots.push(dot)
      slotsLeft--
      dotsLeft--

      if(Math.abs(Math.sin(i*da)) < 0.01 && dotsLeft > 0) {
        dot = this._createDot(distance*0.3, radius, i*da)
        if(dot.y >= 0) {
          dot.y -= gap/2
        } else {
          dot.y += gap/2
        }
        this.addChild(dot)
        this._dots.push(dot)
        dotsLeft--
      }
      i++
    }

    this._label = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._label)
  }

  _createDot(size, radius, angle) {
    const dot = new PIXI.Graphics()
    dot.lineStyle({
      color: 0xff0000,
      width: 1.5,
      alpha: 0.4
    })
    dot.beginFill(0xff0000, 0.9)
    dot.drawCircle(0, 0, size)
    dot.x = 1.35 * radius * Math.cos(angle)
    dot.y = radius * Math.sin(angle)
    return dot
  }

  render(renderer) {
    super.render(renderer)

    for(let i=0; i< this._dots.length; i++) {
      this._dots[i].visible = this.progress > (i/this._dots.length)
      this._dots[i].alpha = (i < this.count) ? 1 : 0.4
    }
    this._label.progress = this.progress
    this._label.text = this.count > 0 ? `${this.title}:${this.count}` : this.title
  }
}