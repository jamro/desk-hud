import LineArt from "../../frontend/components/LineArt"
import TomatoPlant from "./TomatoPlant"


const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default class PomodoroStatsScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.value = 0
    this.stats = Array(7).fill(0)

    this._scale = new LineArt()
    this._scale.addLine(-285, 40, 285, 40, 1, 0x444444)
    this._scale.addLine(-285, 20, 285, 20, 1, 0x444444)
    this._scale.addLine(-285, 0, 285, 0, 1, 0x444444)
    this._scale.addLine(-285, -20, 285, -20, 1, 0x444444)
    this._scale.addLine(-285, -40, 285, -40, 1, 0x444444)
    this._scale.addLine(-285, -60, 285, -60, 1, 0x444444)
    this._scale.addLine(-285, -80, 285, -80, 1, 0x444444)
    this.addChild(this._scale)

    this._plants = Array(7)
      .fill(1)
      .map((_, i) => {
        const plant = new TomatoPlant()
        this.addChild(plant)
        plant.x = i*80 - 250
        plant.y = 40
        plant.value = 0
        return plant
      })
  }

  render(renderer) {
    const now = new Date()
    const dayOfWeek = now.getDay()
    this._scale.progress = this.progress
    if(this.stats) {
      for(let i=0; i < this._plants.length; i++) {
        this._plants[i].progress = this.progress
        this._plants[i].label = DAYS[(i + dayOfWeek+1) % 7]
        this._plants[i].value = this.stats[i]
      }
    }
    super.render(renderer)
  }
}