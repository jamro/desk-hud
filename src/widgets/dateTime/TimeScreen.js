import TimezonePreview from "./TimezonePreview"

export default class TimeScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0

    this._timezonePreview = null
  }

  addTimezonePreview(timezones) {
    if(this._timezonePreview) {
      this.removeChild(this._timezonePreview)
    }
    this._timezonePreview = new TimezonePreview(timezones)
    this._timezonePreview.x = -280
    this._timezonePreview.y = -65
    this.addChild(this._timezonePreview)
  }

  render(renderer) {
    if(this._timezonePreview) {
      this._timezonePreview.progress = this.progress
    }
    super.render(renderer)
  }
}