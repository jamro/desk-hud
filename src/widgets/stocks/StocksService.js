const Service = require("../../backend/services/Service");
const fetch = require('node-fetch');

class StocksService extends Service {

  constructor(config, io) {
    super(config, io, 'stocks')
    this._loop1 = null
    this._loop2 = null
    this._intraDay = null
    this._daily = null
  }

  async start() {
    if(this._loop1) {
      clearInterval(this._loop1)
    }
    if(this._loop2) {
      clearInterval(this._loop2)
    }
    this._loop1 = setInterval(() => this.updateIntraDay(), 5*60*1000)
    this._loop2 = setInterval(() => this.updateDaily(), 60*60*1000)
    this.updateIntraDay()
    setTimeout(() => this.updateDaily(), 1000)
  }

  _createMessage() {
    if(!this._intraDay || ! this._daily) {
      this.logger.log('Unable to create full stocks message', {_intraDay: !!this._intraDay,  _daily: !!this._daily})
      return null
    }
    const symbol = this.config.getProp('alphavantage.symbol')
    return {
      symbol,
      intraDay: this._intraDay,
      daily: this._daily
    }
  }

  async welcomeClient(socket) {
    const msg = this._createMessage()
    if(msg) {
      this.emit(msg, socket)
    }
  }

  async updateIntraDay() {
    try {
      const apiKey = this.config.getProp('alphavantage.apiKey')
      const symbol = this.config.getProp('alphavantage.symbol')

      this._intraDay = await this._fetchIntraDay(apiKey, symbol);
      const msg = this._createMessage()
      if(msg) {
        this.emit(msg)
      }
    } catch(err) {
      this.logger.error(err)
    }
  }

  async updateDaily() {
    try {
      const apiKey = this.config.getProp('alphavantage.apiKey')
      const symbol = this.config.getProp('alphavantage.symbol')

      this._daily = await this._fetchDaily(apiKey, symbol);

      const msg = this._createMessage()
      if(msg) {
        this.emit(msg)
      }
    } catch(err) {
      this.logger.error(err)
    }
  }

  async _fetchIntraDay(apiKey, symbol) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
    const url = `http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
    this.logger.log(`call http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey.substr(0, 2)}...`)
    const response = await fetch(url)
    this.logger.debug('TIME_SERIES_INTRADAY Response received', {ok: response.ok})
    const json = await response.json()
    if(json.Note) throw new Error(json.Note)
    return json
  }

  async _fetchDaily(apiKey, symbol) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`
    this.logger.log(`call https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey.substr(0, 2)}...`)
    const response = await fetch(url)
    this.logger.debug('TIME_SERIES_DAILY_ADJUSTED Response received', {ok: response.ok})
    const json = await response.json()
    if(json.Note) throw new Error(json.Note)
    return json
  }

}

module.exports = StocksService