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
    this._showScale = options.showScale !== undefined ? options.showScale : true
    this._colFill = options.colFill !== undefined ? options.colFill : 0.66
    this._autoscale = options.autoscale !== undefined ? options.autoscale : false


    this.progress = 0
    this._data = []

    this._renderHash = ''
    this._scaleLabels = []
    this._scaleLines = null
    this._canvas = null

    this._reload()

  }

  _reload() {
    this._renderHash = ''
    if(this._scaleLines && this._scaleLines.parent) {
      this.removeChild(this._scaleLines)
      this._scaleLines = null
    }
    if(this._canvas && this._canvas.parent) {
      this.removeChild(this._canvas)
      this._canvas = null
    }
    while(this._scaleLabels.length) {
      this.removeChild(this._scaleLabels.pop())
    }

    if(this._showScale) {
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
    }
    this._canvas = new PIXI.Graphics()
    this.addChild(this._canvas)
  }

  get data() {
    return this._data
  }

  set data(d) {
    if(this._data === d) return

    if(this._data.length === 0 && d.length > 0 && this._autoscale) {
      this._scaleMin = Math.floor(d[0]*0.999 / this._tickStep)*this._tickStep
      this._scaleMax = Math.ceil(d[0]*1.001 / this._tickStep)*this._tickStep
      this._reload()
    } 
    this._data = d
    if(this._autoscale && this._data.length > 0) {
      this.applyAutoscale()
    }
  }

  applyAutoscale() {
    let min = this._data[0]
    let max = this._data[0]
    for(let v of this._data) {
      min = Math.min(min, v)
      max = Math.max(max, v)
    }

    this._tickStep = 1
    while((max - min)/this._tickStep > 8) {
      if(this._tickStep % 2 !== 0) {
        this._tickStep *= 5
      } else {
        this._tickStep *= 2
      }
    }

    let reloadNeeded = false
    let newScaleMin = this._scaleMin
    let newScaleMax = this._scaleMax
    if(min < this._scaleMin) {
      newScaleMin = Math.floor(0.95 * min / this._tickStep)*this._tickStep
      reloadNeeded = true
    }
    if(max > this._scaleMax) {
      newScaleMax = Math.ceil(1.05 * max / this._tickStep)*this._tickStep
      reloadNeeded = true
    }
    if(reloadNeeded) {
      this._scaleMin = newScaleMin
      this._scaleMax = newScaleMax
      this._reload()
    }
    
   }

  render(renderer) {
    super.render(renderer)

    const hash = `${this.progress}|${this.data.join('|')}`
    if(this._renderHash === hash) {
      return
    }
    this._renderHash = hash

    if(this._showScale) {
      this._scaleLines.progress = this.progress
      this._scaleLabels.forEach(l => l.progress = this.progress)
    }

    this._canvas.clear()
    const step = this._data.length ? this._chartWidth / this._data.length : 0
    this._canvas.beginFill(0xffffff, 0.5*this.progress)
    for(let i=0; i < this._data.length; i++) {
      const progress = Math.min(1, Math.max(0, this.progress - 0.5*i/this._data.length)*2)
      let value = (this._data[i] - this._scaleMin) / (this._scaleMax - this._scaleMin)
      value = progress * Math.max(0, Math.min(1, value))
      this._canvas.drawRect(
        i*step + (1-this._colFill)*step*0.5,
        1-this._chartHeight * value + this._chartHeight, 
        step*this._colFill,
        this._chartHeight * value
      )
    }

    this._canvas.beginFill(0xffffff)
    for(let i=0; i < this._data.length; i++) {
      let value = (this._data[i] - this._scaleMin) / (this._scaleMax - this._scaleMin)
      const progress = Math.min(1, Math.max(0, this.progress - 0.5*i/this._data.length)*2)
      value = progress * Math.max(0, Math.min(1, value))
      this._canvas.drawRect(
        i*step + (1-this._colFill)*step*0.5,
        1-this._chartHeight * value + this._chartHeight, 
        step*this._colFill,
        Math.min(3, this._chartHeight * value)
      )
    }
    
  }
}