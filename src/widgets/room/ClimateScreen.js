import ScaleCircle from "../../frontend/circles/ScaleCircle"
import TitleCircle from "../../frontend/circles/TitleCircle"
import BarChart from "../../frontend/components/BarChart"
import Battery from "../../frontend/components/Battery"
import Icon from "../../frontend/components/Icon"
import TextField from "../../frontend/components/TextField"
import ArrowButton from "./ArrowButton"
import Fan from "./Fan"

export default class ClimateScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.acMode = 'off'
    this.targetTemperature = null
    this.currentTemperature = null
    this.acFanSpeed = null
    this.tempHistory = null
    this.batteryValue = null

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

    this._fan = new Fan()
    this._fan.y = -60
    this._fan.x = -20
    this._fan.interactive = true
    this._fan.on('pointertap', () => {
      this.emit('fanToggle')
    })
    this.addChild(this._fan)

    this._tempChart = new BarChart({width: 240, height: 100, scaleMin: 18, scaleMax: 26, tickStep: 1})
    this._tempChart.x = 43
    this._tempChart.y = -65
    this.addChild(this._tempChart)

    this._chartLabel = new TextField("Room Temperature:", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._chartLabel.anchor.set(0, 1)
    this._chartLabel.x = 30
    this._chartLabel.y = -80
    this.addChild(this._chartLabel)

    this._roomTempLabel = new TextField("", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._roomTempLabel.anchor.set(0, 1)
    this._roomTempLabel.x = 175
    this._roomTempLabel.y = -80
    this.addChild(this._roomTempLabel)
    
    this._battery = new Battery()
    this._battery.x = 235
    this._battery.y = 55
    this.addChild(this._battery)

    this._batteryLabel = new TextField("Thermometer:", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._batteryLabel.anchor.set(1, 0.6)
    this._batteryLabel.x = 220
    this._batteryLabel.y = 55
    this.addChild(this._batteryLabel)
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

    this._autoModeIcon.scale.set(0.55)
    this._coolModeIcon.scale.set(0.55)
    this._heatModeIcon.scale.set(0.55)
    this._offModeIcon.scale.set(0.55)

    this._icons.alpha = this.progress
    this._fan.progress = this.progress

    if(this.acFanSpeed === 'auto') {
      this._fan.isAuto = true
    } else {
      this._fan.isAuto = false
      this._fan.speed = this.acFanSpeed || 0
    }

    this._tempChart.progress = this.progress
    this._tempChart.data = this.tempHistory || []
    this._chartLabel.progress = this.progress
    this._roomTempLabel.progress = this.progress
    this._roomTempLabel.text = this.currentTemperature ? this.currentTemperature + '°c' : ''

    this._battery.progress = this.progress
    this._batteryLabel.progress = this.progress
    this._battery.value = this.batteryValue || 0
    
    super.render(renderer)
  }
}