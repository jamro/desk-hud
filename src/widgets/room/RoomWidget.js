import MainScreen from '../../frontend/MainScreen.js'
import Widget from '../../frontend/Widget.js'
import IconButton from '../../frontend/components/IconButton.js'
import LineArt from '../../frontend/components/LineArt.js'
import RoomPreview from '../../frontend/components/RoomPreview.js'
import TextField from '../../frontend/components/TextField.js'
import ClimateScreen from './ClimateScreen.js'
import CoversScreen from './CoversScreen.js'

export default class RoomWidget extends Widget {
  constructor() {
    super('room', "rooM")
    this._acFanModes = ['auto', 'low', 'medium low', 'medium', 'medium high', 'high']
    this.initState({
      lastUpdate: null,
      currentTemperature: null,
      targetTemperature: null,
      acState: null,
      acMode: null,
      covers: null,
      doors: null,
      coversBattery: null,
      doorsBattery: null,
      acFanSpeed: null,
      acFanMode: null,
      tempHistory: null,
      tempBattery: null,
    })

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

    // main screen
    this.main.title = "room"
    const acTab = this.main.getTabButton(1)
    const acPage = this.main.getPage(1)
    acTab.visible = true
    acTab.text = "Climate"
    const coversTab = this.main.getTabButton(0)
    const coversPage = this.main.getPage(0)
    coversTab.visible = true
    coversTab.text = "Covers"

    this._coversScreen = new CoversScreen()
    coversPage.addChild(this._coversScreen)
    this._coversScreen.on('coverChange', (id, pos, index) => {
      const newValue = Math.round((1-pos)*100)
      this.sendMessage({action: 'cover', target: id, value: newValue})
      this.state.covers[index] = pos
    })

    this._climateScreen = new ClimateScreen()
    acPage.addChild(this._climateScreen)

    this._climateScreen.on('heatUp', () => {
      if(this.state.targetTemperature === null) {
        this.sendMessage({action: 'acMode', value: 'on'})
      } else {
        this.state.targetTemperature++
        this.sendMessage({action: 'temperature', value: this.state.targetTemperature})
      }
    })
    this._climateScreen.on('coolDown', () => {
      if(this.state.targetTemperature === null) {
        this.sendMessage({action: 'acMode', value: 'on'})
      } else {
        this.state.targetTemperature--
        this.sendMessage({action: 'temperature', value: this.state.targetTemperature})
      }
    })
    this._climateScreen.on('acMode', (mode) => {
      if(mode === 'off') {
        this.state.targetTemperature = null
      }
      this.sendMessage({action: 'acMode', value: mode})
    })
    this._climateScreen.on('fanToggle', () => {
      const modeIndex = this._acFanModes.indexOf(this.state.acFanMode)
      if(modeIndex === -1) return
      const nextMode = this._acFanModes[((modeIndex + 1) % this._acFanModes.length)]

      this.sendMessage({action: 'fanMode', value: nextMode})
    })
  }

  msg2state(entities) {
    const newState = {}
    newState.lastUpdate = new Date().getTime()
    newState.currentTemperature = Number(entities.temp.state)
    newState.tempBattery = Number(entities.tempBattery.state/100)
    newState.acState = entities.ac.state === 'off' ? 'off' : entities.ac.attributes.temperature + '°c'
    newState.acMode = entities.ac.state
    newState.targetTemperature = entities.ac.state === 'off' ? null : entities.ac.attributes.temperature
    newState.covers = [
      1-entities.cover1.attributes.current_position/100,
      1-entities.cover2.attributes.current_position/100,
      1-entities.cover3.attributes.current_position/100,
      1-entities.cover4.attributes.current_position/100,
      1-entities.cover5.attributes.current_position/100,
    ]
    newState.doors = [
      entities.door1.state !== 'off',
      entities.door2.state !== 'off',
      entities.door3.state !== 'off',
    ]
    newState.coversBattery = [
      Number(entities.cover1Battery.state)/100,
      Number(entities.cover2Battery.state)/100,
      Number(entities.cover3Battery.state)/100,
      Number(entities.cover4Battery.state)/100,
      Number(entities.cover5Battery.state)/100,
    ]
    newState.doorsBattery = [
      Number(entities.door1Battery.state)/100,
      Number(entities.door2Battery.state)/100,
      Number(entities.door3Battery.state)/100,
    ]
    
    if(entities.ac.state === 'off') {
      newState.acFanSpeed = 0
      newState.acFanMode = 'off'
    } else if(entities.ac.attributes.fan_mode === 'auto') {
      newState.acFanSpeed = 'auto'
      newState.acFanMode = 'auto'
    } else {
      newState.acFanSpeed = (this._acFanModes.indexOf(entities.ac.attributes.fan_mode))/(this._acFanModes.length-1)
      newState.acFanMode = entities.ac.attributes.fan_mode
    }
    newState.tempHistory = entities.temp.history.map(Number) || []
    newState.tempHistory.push(Number(entities.temp.state))
    while(newState.tempHistory.length > 48) {
      newState.tempHistory.shift()
    }
    return newState
  }

  render(renderer) {
    super.render(renderer)

    this._currentTempLabel.progress = this.progress * this.dataLoadProgress
    this._currentTempLabel.text = this.state.currentTemperature === null ? '' : Math.round(this.state.currentTemperature) + '°c'
    this._climateScreen.targetTemperature = this.state.targetTemperature
    this._climateScreen.currentTemperature = this.state.currentTemperature
    this._climateScreen.acMode = this.state.acMode
    this._currentTempLabel.y = -60*this.size
    this._currentTempLabel.style.fontSize = this.size * 8 + 7

    this._acStateLabel.progress = this.progress * this.dataLoadProgress
    this._acStateLabel.text = (this.state.acState || '')
    if(this.size === 1) {
      this._acStateLabel.y = -40*this.size
      this._acStateLabel.style.fontSize = this.size * 8 + 3
    } else {
      this._acStateLabel.y = 60*this.size
      this._acStateLabel.style.fontSize = this.size * 8 + 7
    }

    this._roomView.size = this.size
    this._roomView.progress = this.progress*this.dataLoadProgress
    if(this.state.covers) {
      this._roomView.covers = this.state.covers
      this._coversScreen.covers = this.state.covers
    }
    if(this.state.doors) {
      this._roomView.doors = this.state.doors
      this._coversScreen.doors = this.state.doors
    }
    if(this.state.coversBattery) {
      this._coversScreen.coversBattery = this.state.coversBattery
    }
    if(this.state.doorsBattery) {
      this._coversScreen.doorsBattery = this.state.doorsBattery
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
    this._dayButton.scale.set(this.progress*this.dataLoadProgress)
    this._callButton.scale.set(this.progress*this.dataLoadProgress)
    this._nightButton.scale.set(this.progress*this.dataLoadProgress)

    this._buttonFrame.size = this.size
    this._buttonFrame.progress = this.progress
    this._buttonFrame.visible = this.size === 1

    this._scenesLabel.progress = this.progress
    this._scenesLabel.y = 35
    this._scenesLabel.visible = this.size === 1
     
    this._climateScreen.progress = this.main.progress
    this._coversScreen.progress = this.main.progress
    
    this._climateScreen.acFanSpeed = this.state.acFanSpeed
    this._climateScreen.tempHistory = this.state.tempHistory
    this._climateScreen.batteryValue = this.state.tempBattery
  }
}