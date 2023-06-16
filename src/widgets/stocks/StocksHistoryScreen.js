import Chart from '../../frontend/components/Chart'
import TextField from '../../frontend/components/TextField'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class StocksHistoryScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.data = []

    this._timelineHash = ''

    this._timeline = new PIXI.Graphics()
    this.addChild(this._timeline)

    this._chart = new Chart({
      width: 555,
      height: 140,
      autoscale: true,
      style: 'line'
    })
    this._chart.x = -270
    this._chart.y = -80
    this.addChild(this._chart)

    this._monthLabels = []

  }

  render(renderer) {
    this._chart.progress = this.progress
    this._chart.data = this.data
    this._timeline.scale.set(1, this.progress)

    this._monthLabels.forEach(l => l.progress = this.progress)

    const now = new Date()
    const initX = Math.round((now.getDate())*(5/7))
    const hash = `${initX}|${this.data.length}`
    if(this._timelineHash !== hash) {

      while(this._monthLabels.length) {
        this.removeChild(this._monthLabels.pop())
      }

      this._timelineHash = hash
      this._timeline.clear()
      this._timeline.lineStyle({
        color: 0x444444,
        width: 1
      })

      const xMin = -268
      const xMax = 285
      const step = (xMax - xMin)/Math.max(1, this.data.length)
      
      for(let x=initX; x < this.data.length; x+=21) {
        this._timeline.moveTo(xMax-x*step, -90)
        this._timeline.lineTo(xMax-x*step, 80)
        
        if(x < this.data.length - 21) {
          const month = MONTHS[(now.getMonth()-1-this._monthLabels.length+12) % 12]
          const label = new TextField(month, {
            fontFamily: 'MajorMonoDisplay-Regular',
            fontSize: 11,
            fill: '#ffffff',
            stroke: "#ffffff",
            strokeThickness: 0.5,
            align: 'center',
          })
          label.x = xMax-(x+10.5)*step
          label.y = 70
          this.addChild(label)
          this._monthLabels.push(label)
        }


      }
      
    }

    super.render(renderer)
  }
}