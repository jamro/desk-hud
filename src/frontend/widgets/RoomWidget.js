import Widget from '../Widget.js'
import TextField from '../components/TextField.js'

export default class RoomWidget extends Widget {
  constructor() {
    super('room', "Room")
    this._dataLoadProgress = 0
    this.data = {
      lastUpdate: null,
      currentTemperature: null
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

  }

  onMessage(msg) {
    console.log('room:', msg)
    this.data.lastUpdate = new Date().getTime()
    this.data.currentTemperature = msg.attributes.current_temperature

    console.log( this.data )
  }

  render(renderer) {
    super.render(renderer)

    if(this.data.lastUpdate && this._dataLoadProgress < 1) {
      this._dataLoadProgress = Math.min(1, this._dataLoadProgress + 0.02)
    }

    this._currentTempLabel.progress = this.progress
    this._currentTempLabel.text = this.data.currentTemperature === null ? '' : Math.round(this.data.currentTemperature) + '°c'
    this._currentTempLabel.y = 40*this.size
    this._currentTempLabel.style.fontSize = this.size * 8 + 7
  }
}