import ScaleCircle from "../../circles/ScaleCircle"
import TitleCircle from "../../circles/TitleCircle"
import TextField from "../../components/TextField"
import ArrowButton from "./ArrowButton"

export default class ClimateScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.targetTemperature = null
    this.currentTemperature = null

    this._circle =  new PIXI.Container()
    this._circle.x = -190
    this.addChild(this._circle)

    this._acFrame = new TitleCircle("Air Conditioning")
    this._acFrame.size = 0.7
    this._circle.addChild(this._acFrame)

    this._tempScale = new ScaleCircle(18, 26, '°c', 5, Math.PI)
    this._tempScale.rotation = Math.PI*0.5
    this._tempScale.size = 0.75
    this._tempScale.valueMin = 18
    this._circle.addChild(this._tempScale)

    this._targetLabel = new TextField("", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 30,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._circle.addChild(this._targetLabel)
    
    this._upButton = new ArrowButton()
    this._upButton.y = -35
    this._circle.addChild(this._upButton)

    this._downButton = new ArrowButton()
    this._downButton.y = 35
    this._downButton.rotation = Math.PI
    this._circle.addChild(this._downButton)

    this._upButton.on('pointertap', () => {
      this.emit('heatUp')
    })

    this._downButton.on('pointertap', () => {
      this.emit('coolDown')
    })

    this._offButton = new PIXI.Graphics()
    this._offButton.beginFill(0x000000, 0.00001)
    this._offButton.drawRect(-45, -22, 90, 44)
    this._offButton.interactive = true
    this._circle.addChild(this._offButton)
    this._offButton.on('pointertap', () => {
      this.emit('acOff')
    })
  }

  render(renderer) {
    this._acFrame.progress = this.progress
    this._targetLabel.progress = this.progress
    this._targetLabel.text = this.targetTemperature ? this.targetTemperature + '°c' : 'off'
    this._tempScale.progress = this.progress
    this._tempScale.value += (Math.min(26, (Math.max(18, this.targetTemperature || 18))) - this._tempScale.value )/10
    this._tempScale.valueMax = Math.min(26, (Math.max(18, this.currentTemperature || 18)))

    this._upButton.progress = this.progress
    this._downButton.progress = this.progress
    
    super.render(renderer)
  }
}