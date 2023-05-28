const Service = require('./Service.js')
const fetch = require('node-fetch');

class RoomService extends Service {

  constructor(io) {
    super(io, 'room')
    this._loop = null
  }

  start() {
    if(this._loop) {
      clearInterval(this._loop)
    }
    this._loop = setInterval(() => this.update(), 1000*60*5)
    this.update()
  }

  async welcomeClient(socket) {
    this.emit(await this.fetchAll(), socket)
  }

  async update() {
    this.emit(await this.fetchAll())
  }

  async fetchAll() {
    const url = `${this.getConfig('DHUD_HA_URL')}/api/states/${this.getConfig('DHUD_HA_AC_ENTITY_ID')}`
    const token = this.getConfig('DHUD_HA_ACCESS_TOKEN')
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    if(!response.ok) {
      throw new Error(`Error ${response.status}: ` + await response.text())
    }
    const json = await response.json()
    return json
  }


}

module.exports = RoomService