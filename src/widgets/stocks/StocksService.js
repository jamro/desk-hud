const Service = require("../../backend/services/Service");
const fetch = require('node-fetch');
const storage = require('node-persist');

class StocksService extends Service {

  constructor(config, io, webApp) {
    super(config, io, webApp, 'stocks')
    this._loop1 = null
    this._loop2 = null
    this._intraDay = null
    this._daily = null
  }

  async start() {
    this._intraDay = await storage.getItem('stocks.intraDay') || null
    this._daily = await storage.getItem('stocks.daily') || null

    if(this._intraDay) {
      this.logger.log('Intra day data restored from cache')
    }
    if(this._daily) {
      this.logger.log('Intra daily data restored from cache')
    }

    if(this._loop1) {
      clearInterval(this._loop1)
    }
    if(this._loop2) {
      clearInterval(this._loop2)
    }
    this._loop1 = setInterval(() => this.updateIntraDay(), 20*60*1000)
    this._loop2 = setInterval(() => this.updateDaily(), 60*60*1000)
    if(!this._intraDay ) {
      await this.updateIntraDay()
    }
    if(!this._daily ) {
      setTimeout(async () => await this.updateDaily(), 1000)
    }
   
  }

  _createMessage() {
    if(!this._intraDay || ! this._daily) {
      this.logger.log('Unable to create full stocks message', {_intraDay: !!this._intraDay,  _daily: !!this._daily})
      return null
    }
    const symbol = this.config.getProp('stockdata.symbol')
    return {
      symbol,
      intraDay: this._intraDay,
      daily: this._daily,
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
      const apiKey = this.config.getProp('stockdata.apiKey')
      const symbol = this.config.getProp('stockdata.symbol')

      this._intraDay = await this._fetchIntraDay(apiKey, symbol);
      await storage.setItem('stocks.intraDay', this._intraDay)
      
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
      const apiKey = this.config.getProp('stockdata.apiKey')
      const symbol = this.config.getProp('stockdata.symbol')

      this._daily = await this._fetchDaily(apiKey, symbol);

      await storage.setItem('stocks.daily', this._daily)

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
    const url = `https://api.stockdata.org/v1/data/quote?symbols=${symbol}&api_token=${apiKey}`
    this.logger.log(`call https://api.stockdata.org/v1/data/quote?symbols=${symbol}&api_token=${apiKey.substr(0, 2)}...`)
    const response = await fetch(url)
    this.logger.debug('quote Response received', {ok: response.ok})
    const json = await response.json()
    if(json.Note) throw new Error(json.Note)
    return json
  }

  async _fetchDaily(apiKey, symbol) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
    const url = `https://api.stockdata.org/v1/data/eod?symbols=${symbol}&api_token=${apiKey}`
    this.logger.log(`call https://api.stockdata.org/v1/data/eod?symbols=${symbol}&api_token=${apiKey.substr(0, 2)}...`)
    const response = await fetch(url)
    this.logger.debug('eod Response received', {ok: response.ok})
    const json = await response.json()
    if(json.Note) throw new Error(json.Note)
    return json
  }

}

module.exports = StocksService