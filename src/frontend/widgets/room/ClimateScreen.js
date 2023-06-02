import ScaleCircle from "../../circles/ScaleCircle"
import TitleCircle from "../../circles/TitleCircle"
import Icon from "../../components/Icon"
import TextField from "../../components/TextField"
import ArrowButton from "./ArrowButton"

export default class ClimateScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.acMode = 'off'
    this.targetTemperature = null
    this.currentTemperature = null

    this._icons = new PIXI.Container()
    this._icons.x = -230
    this.addChild(this._icons)

    this._autoModeIcon = new Icon(0xe663)
    this._autoModeIcon.interactive = true
    this._autoModeIcon.y = -80
    this._icons.addChild(this._autoModeIcon)

    this._coolModeIcon = new Icon(0xeb3b)
    this._coolModeIcon.interactive = true
    this._coolModeIcon.y = -33
    this._coolModeIcon.x = -25
    this._icons.addChild(this._coolModeIcon)

    this._heatModeIcon = new Icon(0xe518)
    this._heatModeIcon.interactive = true
    this._heatModeIcon.y = 23
    this._heatModeIcon.x = -25
    this._icons.addChild(this._heatModeIcon)

    this._offModeIcon = new Icon(0xe8ac)
    this._offModeIcon.interactive = true
    this._offModeIcon.y = 70
    this._icons.addChild(this._offModeIcon)

    this._offModeIcon.on('pointertap', () => this.emit('acMode', 'off'))
    this._coolModeIcon.on('pointertap', () => this.emit('acMode', 'cool'))
    this._heatModeIcon.on('pointertap', () => this.emit('acMode', 'heat'))
    this._autoModeIcon.on('pointertap', () => this.emit('acMode', 'auto'))

    this._circle =  new PIXI.Container()
    this._circle.x = -120
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

    this._autoModeIcon.alpha = this.acMode === 'auto' ? 1 : 0.5
    this._coolModeIcon.alpha = this.acMode === 'cool' ? 1 : 0.5
    this._heatModeIcon.alpha = this.acMode === 'heat' ? 1 : 0.5
    this._offModeIcon.alpha = this.acMode === 'off' ? 1 : 0.5
    this._icons.alpha = this.progress
    
    super.render(renderer)
  }
}