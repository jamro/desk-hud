import LineArt from "./LineArt"
import TextField from '../components/TextField'

export default class BarChart extends PIXI.Container {

  constructor(options={}) {
    super()
  
    this._chartWidth = options.width !== undefined ? options.width : 200
    this._chartHeight = options.height !== undefined ? options.height : 100
    this._scaleMin = options.scaleMin !== undefined ? options.scaleMin : 0
    this._scaleMax = options.scaleMax !== undefined ? options.scaleMax : 100
    this._tickStep = options.tickStep !== undefined ? options.tickStep : 10

    this.progress = 0
    this._data = []

    this._renderHash = ''

    this._scaleLines = new LineArt()
    this._scaleLabels = []
    for(let y = this._chartHeight; y >= -1; y -= (this._tickStep*this._chartHeight)/(this._scaleMax - this._scaleMin)) {
      this._scaleLines.addLine(0, y, this._chartWidth, y, 1, 0x666666)
      this._scaleLabels.push(y)
    }

    this._scaleLabels = this._scaleLabels.map((y, i) => {
      const txt = new TextField(this._scaleMin + i * this._tickStep, {
        fontFamily: 'MajorMonoDisplay-Regular',
        fontSize: 9,
        fill: '#ffffff',
        stroke: "#ffffff",
        strokeThickness: 0.5,
        align: 'right',
      })
      txt.anchor.set(1, 0.6)
      txt.y = y
      txt.x = -3
      this.addChild(txt)
      return txt
    })


    this.addChild(this._scaleLines)
    this._canvas = new PIXI.Graphics()
    this.addChild(this._canvas)
  }

  get data() {
    return this._data
  }

  set data(d) {
    this._data = d
  }

  render(renderer) {
    super.render(renderer)

    const hash = `${this.progress}|${this.data.join('|')}`
    if(this._renderHash === hash) {
      return
    }
    this._renderHash = hash

    this._scaleLines.progress = this.progress
    this._scaleLabels.forEach(l => l.progress = this.progress)

    this._canvas.clear()
    const step = this._data.length ? this._chartWidth / this._data.length : 0
    this._canvas.beginFill(0xffffff, 0.5*this.progress)
    for(let i=0; i < this._data.length; i++) {
      const progress = Math.min(1, Math.max(0, this.progress - 0.5*i/this._data.length)*2)
      let value = (this._data[i] - this._scaleMin) / (this._scaleMax - this._scaleMin)
      value = progress * Math.max(0, Math.min(1, value))
      this._canvas.drawRect(
        i*step,
        1-this._chartHeight * value + this._chartHeight, 
        step*0.66,
        this._chartHeight * value
      )
    }

    this._canvas.beginFill(0xffffff)
    for(let i=0; i < this._data.length; i++) {
      let value = (this._data[i] - this._scaleMin) / (this._scaleMax - this._scaleMin)
      const progress = Math.min(1, Math.max(0, this.progress - 0.5*i/this._data.length)*2)
      value = progress * Math.max(0, Math.min(1, value))
      this._canvas.drawRect(
        i*step,
        1-this._chartHeight * value + this._chartHeight, 
        step*0.66,
        Math.min(3, this._chartHeight * value)
      )
    }
    
  }
}