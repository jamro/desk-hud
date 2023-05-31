import Widget from '../../Widget.js'
import ScaleCircle from '../../circles/ScaleCircle.js'
import ArchText from '../../components/ArchText.js'
import TextField from '../../components/TextField.js'

const icons = {
  '01d': '',    '01n': '',
  '02d': '',    '02n': '',
  '03d': '',    '03n': '',
  '04d': '',    '04n': '',
  '09d': '',    '09n': '',
  '10d': '',    '10n': '',
  '11d': '',    '11n': '',
  '13d': '',    '13n': '',
  '50d': '',    '50n': '',
}

export default class WeatherWidget extends Widget {
  constructor() {
    super('weather', "Weather")
    this.data = {
      lastUpdate: null,
      currentTemperature: null,
      currentTemperatureMin: null,
      currentTemperatureMax: null,
      currentIcon: null,
      currentDescription: null,
      rainTime: null
    }
    this._dataLoadProgress = 0

    this._currentTempScale = new ScaleCircle(-10, 30, '°c', 5, Math.PI*0.8)
    this._currentTempScale.rotation = Math.PI*0.3 + Math.PI/2
    this.addChild(this._currentTempScale)

    this._currentTempLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this.addChild(this._currentTempLabel)

    this._currentDescriotionLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1,
      align: 'center',
    })
    this.addChild(this._currentDescriotionLabel)

    this._currentIcon = new TextField('', {
      fontFamily: 'weathericons-regular-webfont',
      fontSize: 60,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._currentIcon.progress = 1
    this.addChild(this._currentIcon)

    this._rainLabel = new ArchText()
    this._rainLabel.text = ''
    this._rainLabel.color = 0xff0000
    this._rainLabel.positionOffset = -Math.PI*0.45
    this.addChild(this._rainLabel)
  }
  
  onMessage(msg) {
    const currentJsonData = msg.current
    const forecastJsonData = msg.forecast
    this.data.lastUpdate = new Date().getTime()
    this.data.currentTemperature = currentJsonData.main.temp
    this.data.currentIcon = currentJsonData.weather[0].icon
    this.data.currentDescription = currentJsonData.weather[0].description

    const now = (new Date().getTime())/1000
    const temperature24 = forecastJsonData.list
      .filter(d => d.dt >= now && d.dt <= now + 24*60*60)
      .map(d => ({
        min: d.main.temp_min,
        max: d.main.temp_max,
      }))
      .reduce((range, val) => {
        range.min = Math.min(val.min, range.min)
        range.max = Math.max(val.max, range.max)
        return range
      }, {
        min: currentJsonData.main.temp,
        max: currentJsonData.main.temp
      })
    this.data.currentTemperatureMin = temperature24.min
    this.data.currentTemperatureMax = temperature24.max

    let rain = forecastJsonData.list.filter(d => d.rain)
    this.data.rainTime = (rain || rain.length > 0) ? rain[0].dt*1000 : null

    console.log(this.data)
  }

  render(renderer) {
    super.render(renderer)

    if(this.data.lastUpdate && this._dataLoadProgress < 1) {
      this._dataLoadProgress = Math.min(1, this._dataLoadProgress + 0.02)
    }

    this._currentTempLabel.progress = this.progress*this._dataLoadProgress
    this._currentTempLabel.text = this.data.currentTemperature === null ? '' : Math.round(this.data.currentTemperature) + '°c'
    this._currentTempLabel.y = 40*this.size
    this._currentTempLabel.style.fontSize = this.size * 8 + 7

    this._currentIcon.alpha = this.progress*this._dataLoadProgress
    this._currentIcon.text = this.data.currentIcon === null ? '' : icons[this.data.currentIcon]
    this._currentIcon.y = -29*this.size
    this._currentIcon.style.fontSize = this.size * 60

    this._currentDescriotionLabel.progress = this.progress*this._dataLoadProgress
    this._currentDescriotionLabel.text = this.data.currentDescription === null ? '' : this.data.currentDescription.substring(0, 17)
    this._currentDescriotionLabel.y = 15*this.size
    this._currentDescriotionLabel.visible = (this.size === 1)
    this._currentDescriotionLabel.style.fontSize = this.size * 12

    this._currentTempScale.size = this.size
    this._currentTempScale.progress = this.progress*this._dataLoadProgress
    this._currentTempScale.visible = (this.size === 1)
    if(this.data.currentTemperature !== null) {
      this._currentTempScale.value = Math.max(-30, Math.min(30, this.data.currentTemperature))
    }
    if(this.data.currentTemperatureMin !== null) {
      this._currentTempScale.valueMin = Math.max(-30, Math.min(30, this.data.currentTemperatureMin))
    }
    if(this.data.currentTemperatureMax !== null) {
      this._currentTempScale.valueMax = Math.max(-30, Math.min(30, this.data.currentTemperatureMax))
    }

    if(this.data.rainTime) {
      const now = (new Date().getTime())
      const rainTimeLeft = Math.round(Math.max(0, this.data.rainTime - now)/1000)
      let rainClock = ''
      rainClock += Math.floor(rainTimeLeft/(60*60)).toString().padStart(2, '0') + ':'
      rainClock += (Math.floor(rainTimeLeft/60) % 60).toString().padStart(2, '0') + ':'
      rainClock += (rainTimeLeft % 60).toString().padStart(2, '0')
      this._rainLabel.text = rainTimeLeft ? 'rain in ' + rainClock : ''
    } else {
      this._rainLabel.text = ''
    }

    this._rainLabel.visible = (this.size === 1)
    this._rainLabel.progress = this.progress*this._dataLoadProgress
    this._rainLabel.size = this.size
    this._rainLabel.radius = 110*this.size
    this._rainLabel.fontSize = 11*this.size
  }
}