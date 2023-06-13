import BarChart from '../../frontend/components/BarChart'

export default class StocksHistoryScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.data = []

    this._chart = new BarChart({
      width: 555,
      height: 150,
      autoscale: true
    })
    this._chart.x = -270
    this._chart.y = -80
    this.addChild(this._chart)
  }

  render(renderer) {
    this._chart.progress = this.progress
    this._chart.data = this.data
    super.render(renderer)
  }
}