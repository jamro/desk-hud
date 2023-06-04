import MainScreen from '../../MainScreen.js'
import Widget from '../../Widget.js'
import Button from '../../components/Button.js'
import IconButton from '../../components/IconButton.js'
import LineArt from '../../components/LineArt.js'
import RoomPreview from '../../components/RoomPreview.js'
import TextField from '../../components/TextField.js'
import ClimateScreen from './ClimateScreen.js'

export default class RoomWidget extends Widget {
  constructor() {
    super('room', "rooM")
    this._dataLoadProgress = 0
    this._acFanModes = ['auto', 'low', 'medium low', 'medium', 'medium high', 'high']
    this.data = {
      lastUpdate: null,
      currentTemperature: null,
      targetTemperature: null,
      acState: null,
      acMode: null,
      covers: null,
      doors: null,
      acFanSpeed: null,
      acFanMode: null,
      tempHistory: null,
      tempBattery: null,
    }

    this._currentTempLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._currentTempLabel)

    this._acStateLabel = new TextField('Off', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1,
      align: 'center',
    });
    this.addChild(this._acStateLabel)

    this._roomView = new RoomPreview()
    this.addChild(this._roomView)

    this._buttonFrame = new LineArt()
    this._buttonFrame.addLine(0, 45, 30, 45, 1, 0xaa0000)
    this._buttonFrame.addLine(0, 45, -30, 45, 1, 0xaa0000)
    this._buttonFrame.addLine(0, 60, 0, 45, 1, 0xaa0000)
    this._buttonFrame.addLine(45, 55, 30, 45, 1, 0xaa0000)
    this._buttonFrame.addLine(-45, 55, -30, 45, 1, 0xaa0000)
    this.addChild(this._buttonFrame)

    this._dayButton = new IconButton(0xe518)
    this._callButton = new IconButton(0xe04b)
    this._nightButton = new IconButton(0xe51c)
    this.addChild(this._dayButton)
    this.addChild(this._callButton)
    this.addChild(this._nightButton)

    this._dayButton.on('pointertap', (e) => {
      e.stopPropagation();
      this.sendMessage({action: 'cover', target: 'cover1', value: 100})
      this.sendMessage({action: 'cover', target: 'cover2', value: 100})
      this.sendMessage({action: 'cover', target: 'cover3', value: 100})
      this.sendMessage({action: 'cover', target: 'cover4', value: 100})
      this.sendMessage({action: 'cover', target: 'cover5', value: 100})
    })
    this._callButton.on('pointertap', (e) => {
      e.stopPropagation();
      this.sendMessage({action: 'cover', target: 'cover1', value: 100})
      this.sendMessage({action: 'cover', target: 'cover2', value: 100})
      this.sendMessage({action: 'cover', target: 'cover3', value: 30})
      this.sendMessage({action: 'cover', target: 'cover4', value: 0})
      this.sendMessage({action: 'cover', target: 'cover5', value: 0})
    })
    this._nightButton.on('pointertap', (e) => {
      e.stopPropagation();
      this.sendMessage({action: 'cover', target: 'cover1', value: 0})
      this.sendMessage({action: 'cover', target: 'cover2', value: 0})
      this.sendMessage({action: 'cover', target: 'cover3', value: 0})
      this.sendMessage({action: 'cover', target: 'cover4', value: 0})
      this.sendMessage({action: 'cover', target: 'cover5', value: 0})
    })

    this._scenesLabel = new TextField('SceNes', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#aa0000',
      stroke: "#aa0000",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._scenesLabel)
  }

  createMainScreen() {
    const screen = new MainScreen()
    screen.title = "room"
    const acTab = screen.getTabButton(0)
    const acPage = screen.getPage(0)
    acTab.visible = true
    acTab.text = "Climate"
    const coversTab = screen.getTabButton(1)
    const coversPage = screen.getPage(1)
    coversTab.visible = true
    coversTab.text = "Covers"

    this._climateScreen = new ClimateScreen()
    acPage.addChild(this._climateScreen)

    this._climateScreen.on('heatUp', () => {
      if(this.data.targetTemperature === null) {
        this.sendMessage({action: 'acMode', value: 'on'})
      } else {
        this.data.targetTemperature++
        this.sendMessage({action: 'temperature', value: this.data.targetTemperature})
      }
    })
    this._climateScreen.on('coolDown', () => {
      if(this.data.targetTemperature === null) {
        this.sendMessage({action: 'acMode', value: 'on'})
      } else {
        this.data.targetTemperature--
        this.sendMessage({action: 'temperature', value: this.data.targetTemperature})
      }
    })
    this._climateScreen.on('acMode', (mode) => {
      if(mode === 'off') {
        this.data.targetTemperature = null
      }
      this.sendMessage({action: 'acMode', value: mode})
    })
    this._climateScreen.on('fanToggle', () => {
      const modeIndex = this._acFanModes.indexOf(this.data.acFanMode)
      if(modeIndex === -1) return
      const nextMode = this._acFanModes[((modeIndex + 1) % this._acFanModes.length)]

      this.sendMessage({action: 'fanMode', value: nextMode})
    })

    return screen
  }

  onMessage(entities) {
    console.log(entities)
    this.data.lastUpdate = new Date().getTime()
    this.data.currentTemperature = Number(entities.temp.state)
    this.data.tempBattery = Number(entities.tempBattery.state/100)
    this.data.acState = entities.ac.state === 'off' ? 'off' : entities.ac.attributes.temperature + '°c'
    this.data.acMode = entities.ac.state
    this.data.targetTemperature = entities.ac.state === 'off' ? null : entities.ac.attributes.temperature
    this.data.covers = [
      1-entities.cover1.attributes.current_position/100,
      1-entities.cover2.attributes.current_position/100,
      1-entities.cover3.attributes.current_position/100,
      1-entities.cover4.attributes.current_position/100,
      1-entities.cover5.attributes.current_position/100,
    ]
    this.data.doors = [
      entities.door1.state !== 'off',
      entities.door2.state !== 'off',
      entities.door3.state !== 'off',
    ]
    
    if(entities.ac.state === 'off') {
      this.data.acFanSpeed = 0
      this.data.acFanMode = 'off'
    } else if(entities.ac.attributes.fan_mode === 'auto') {
      this.data.acFanSpeed = 'auto'
      this.data.acFanMode = 'auto'
    } else {
      this.data.acFanSpeed = (this._acFanModes.indexOf(entities.ac.attributes.fan_mode))/(this._acFanModes.length-1)
      this.data.acFanMode = entities.ac.attributes.fan_mode
    }
    this.data.tempHistory = entities.temp.history.map(Number) || []
    this.data.tempHistory.push(Number(entities.temp.state))
    while(this.data.tempHistory.length > 48) {
      this.data.tempHistory.shift()
    }

    console.log( this.data )
  }

  render(renderer) {
    super.render(renderer)

    if(this.data.lastUpdate && this._dataLoadProgress < 1) {
      this._dataLoadProgress = Math.min(1, this._dataLoadProgress + 0.02)
    }

    this._currentTempLabel.progress = this.progress * this._dataLoadProgress
    this._currentTempLabel.text = this.data.currentTemperature === null ? '' : Math.round(this.data.currentTemperature) + '°c'
    this._climateScreen.targetTemperature = this.data.targetTemperature
    this._climateScreen.currentTemperature = this.data.currentTemperature
    this._climateScreen.acMode = this.data.acMode
    this._currentTempLabel.y = -60*this.size
    this._currentTempLabel.style.fontSize = this.size * 8 + 7

    this._acStateLabel.progress = this.progress * this._dataLoadProgress
    this._acStateLabel.text = (this.data.acState || '')
    if(this.size === 1) {
      this._acStateLabel.y = -40*this.size
      this._acStateLabel.style.fontSize = this.size * 8 + 3
    } else {
      this._acStateLabel.y = 60*this.size
      this._acStateLabel.style.fontSize = this.size * 8 + 7
    }

    this._roomView.size = this.size
    this._roomView.progress = this.progress*this._dataLoadProgress
    if(this.data.covers) {
      this._roomView.covers = this.data.covers
    }
    if(this.data.doors) {
      this._roomView.doors = this.data.doors
    }

    this._dayButton.x = -100*this.size * Math.cos(Math.PI*0.25)
    this._dayButton.y = 100*this.size * Math.sin(Math.PI*0.25)
    this._callButton.x = -100*this.size * Math.cos(Math.PI*0.5)
    this._callButton.y = 100*this.size * Math.sin(Math.PI*0.5) - this.size * 10
    this._nightButton.x = -100*this.size * Math.cos(Math.PI*0.75)
    this._nightButton.y = 100*this.size * Math.sin(Math.PI*0.75)
    this._dayButton.visible = this.size === 1
    this._callButton.visible = this.size === 1
    this._nightButton.visible = this.size === 1
    this._dayButton.scale.set(this.progress*this._dataLoadProgress)
    this._callButton.scale.set(this.progress*this._dataLoadProgress)
    this._nightButton.scale.set(this.progress*this._dataLoadProgress)

    this._buttonFrame.size = this.size
    this._buttonFrame.progress = this.progress
    this._buttonFrame.visible = this.size === 1

    this._scenesLabel.progress = this.progress
    this._scenesLabel.y = 35
    this._scenesLabel.visible = this.size === 1

    if(this._climateScreen && this.main) {      
      this._climateScreen.progress = this.main.progress
    }
    
    this._climateScreen.acFanSpeed = this.data.acFanSpeed
    this._climateScreen.tempHistory = this.data.tempHistory
    this._climateScreen.batteryValue = this.data.tempBattery
  }
}