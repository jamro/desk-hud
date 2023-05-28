const Service = require('./Service.js')
const fetch = require('node-fetch');

class WeatherService extends Service {

  constructor(io) {
    super(io, 'weather')
    this._loop = null
  }

  async start() {
    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 1000*60*15)
    this.update()
  }

  async welcomeClient(socket) {
    this.emit(await this.fetchAll(), socket)
  }

  async update() {
    this.emit(await this.fetchAll())
  }

  async fetchAll() {
    const apiKey = this.getConfig('DHUD_OPEN_WEATHER_API_KEY')
    const lon = this.getConfig('DHUD_GEO_LON')
    const lat = this.getConfig('DHUD_GEO_LAT')

    const current = await this._fetchCurrent(apiKey, lat, lon)
    const forecast = await this._fetchForecast(apiKey, lat, lon)

    return {current, forecast}
  }

  async _fetchCurrent(apiKey, lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

  async _fetchForecast(apiKey, lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

}

module.exports = WeatherService