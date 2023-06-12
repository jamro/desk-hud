const Service = require('../../backend/services/Service.js')
const fetch = require('node-fetch');
const hass = require("home-assistant-js-websocket");
const storage = require('node-persist');
globalThis.WebSocket = require("ws");

class RoomService extends Service {

  constructor(config, io) {
    super(config, io, 'room')
    this._loop = null
    this._entities = {}
    this._connection = null
  }

  async start() {

    const auth = hass.createLongLivedTokenAuth(
      this.config.getProp('hass.url'),
      this.config.getProp('hass.token')
    );

    const myEntitiesMap = {}
    myEntitiesMap[ this.config.getProp('hass.entities.ac')] = 'ac'
    myEntitiesMap[ this.config.getProp('hass.entities.temp')] = 'temp'
    myEntitiesMap[ this.config.getProp('hass.entities.tempBattery')] = 'tempBattery'
    myEntitiesMap[ this.config.getProp('hass.entities.cover1')] = 'cover1'
    myEntitiesMap[ this.config.getProp('hass.entities.cover2')] = 'cover2'
    myEntitiesMap[ this.config.getProp('hass.entities.cover3')] = 'cover3'
    myEntitiesMap[ this.config.getProp('hass.entities.cover4')] = 'cover4'
    myEntitiesMap[ this.config.getProp('hass.entities.cover5')] = 'cover5'
    myEntitiesMap[ this.config.getProp('hass.entities.door1')] = 'door1'
    myEntitiesMap[ this.config.getProp('hass.entities.door2')] = 'door2'
    myEntitiesMap[ this.config.getProp('hass.entities.door3')] = 'door3'
    myEntitiesMap[ this.config.getProp('hass.entities.cover1Battery')] = 'cover1Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.cover2Battery')] = 'cover2Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.cover3Battery')] = 'cover3Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.cover4Battery')] = 'cover4Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.cover5Battery')] = 'cover5Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.door1Battery')] = 'door1Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.door2Battery')] = 'door2Battery'
    myEntitiesMap[ this.config.getProp('hass.entities.door3Battery')] = 'door3Battery'

    this._connection = await hass.createConnection({ auth });
    hass.subscribeEntities(this._connection, (entities) => {

      const keys = Object.keys(entities).filter(k => myEntitiesMap[k])
      const newEntities = keys
        .map(k => ({
          ...(entities[k]), 
          id: myEntitiesMap[k]
        }))
        .reduce((result, value) => {
          result[value.id] = value
          return result
        }, {})

      if(newEntities.temp) {
        newEntities.temp.history = []
      }

      const getTimeHash = (entitiesObj) => {
        return Object.values(myEntitiesMap)
          .map(k => entitiesObj[k] ? entitiesObj[k].last_updated : 'miss')
          .join('|')
      }

      const oldHash = getTimeHash(this._entities)
      const newHash = getTimeHash(newEntities)

      if(newHash !== oldHash) {
        const tempHistory = this._entities.temp ? this._entities.temp.history : []
        this._entities = newEntities
        if(!this._entities.temp) {
          this._entities.temp = {}
        }
        this._entities.temp.history = tempHistory
        this.emit(this._entities)
      }

    });

    setInterval(() => this._updateHistory(), 30*60*1000)
    if(!this._entities.temp) {
      this._entities.temp = {  }
    }
    this._entities.temp.history = await storage.getItem('room.tempHistory') || []
  }

  async _updateHistory() {
    if(!this._entities.temp) return
    if(!this._entities.temp.history) {
      this._entities.temp.history = []
    }
    this._entities.temp.history.push(this._entities.temp.state)
    while(this._entities.temp.history.length > 48) {
      this._entities.temp.history.shift()
    }
    storage.setItem('room.tempHistory', this._entities.temp.history)
    this.emit(this._entities)
  }

  async setCoverPos(target, value) {
    if(!this._entities[target]) throw new Error(`Unknown target: '${target}'`)
    if(!this._connection) throw new Error('Not connected')
    const coverIndex = Number(target.replace(/^cover/, ''))
    const doorTarget = 'door' + coverIndex

    const coverEntity = this._entities[target]
    const doorEntity = this._entities[doorTarget] || null

    if(doorEntity && doorEntity.state === 'on') {
      console.log(`Door of ${target} open. skipping...`)
      return
    }
  
    await this._connection.sendMessagePromise({
      "type": "call_service",
      "domain": "cover",
      "service": "set_cover_position",
      "service_data": {
        "entity_id": coverEntity.entity_id,
        "position": value
      }
    })

  }

  async setTemperature(value) {
    await this._connection.sendMessagePromise({
      "type": "call_service",
      "domain": "climate",
      "service": "set_temperature",
      "service_data": {
          "entity_id": this._entities.ac.entity_id,
          "temperature": value
      }
    })
  }

  async setAcMode(mode) {
    if(mode === 'off' || mode === 'on') {
      await this._connection.sendMessagePromise({
        "type": "call_service",
        "domain": "climate",
        "service": "turn_" + mode,
        "service_data": {
          "entity_id": this._entities.ac.entity_id,
        }
      })
    } else {
      await this._connection.sendMessagePromise({
        "type": "call_service",
        "domain": "climate",
        "service": "set_hvac_mode",
        "service_data": {
          "hvac_mode": mode,
          "entity_id": this._entities.ac.entity_id
        }
      })
    }
  }

  async setFanMode(mode) {
    await this._connection.sendMessagePromise({
      "type": "call_service",
      "domain": "climate",
      "service": "set_fan_mode",
      "service_data": {
        "fan_mode": mode,
        "entity_id": this._entities.ac.entity_id
      }
    })
  }

  async onMessage({action, target, value}) {
    switch(action) {
      case 'cover': return await this.setCoverPos(target, value)
      case 'temperature': return await this.setTemperature(value)
      case 'acMode': return await this.setAcMode(value)
      case 'fanMode': return await this.setFanMode(value)
      default: console.warn(`Unknown action ${action}`)
    }
    
  }

  async welcomeClient(socket) {
    if(Object.keys(this._entities).length) {
      this.emit(this._entities, socket)
    }
  }

}

module.exports = RoomService