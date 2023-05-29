const Service = require('./Service.js')
const fetch = require('node-fetch');
const hass = require("home-assistant-js-websocket")
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
    myEntitiesMap[ this.config.getProp('hass.entities.cover1')] = 'cover1'
    myEntitiesMap[ this.config.getProp('hass.entities.cover2')] = 'cover2'
    myEntitiesMap[ this.config.getProp('hass.entities.cover3')] = 'cover3'
    myEntitiesMap[ this.config.getProp('hass.entities.cover4')] = 'cover4'
    myEntitiesMap[ this.config.getProp('hass.entities.cover5')] = 'cover5'

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


      const getTimeHash = (entitiesObj) => {
        return Object.values(myEntitiesMap)
          .map(k => entitiesObj[k] ? entitiesObj[k].last_updated : 'miss')
          .join('|')
      }

      const oldHash = getTimeHash(this._entities)
      const newHash = getTimeHash(newEntities)

      if(newHash !== oldHash) {
        this._entities = newEntities
        this.emit(this._entities)
      }

    });
  }

  async onMessage({target, value}) {
    if(!this._entities[target]) throw new Error(`Unknown target: '${target}'`)
    if(!this._connection) throw new Error('Not connected')
    const entityId = this._entities[target].entity_id
    await this._connection.sendMessagePromise({
      "type": "call_service",
      "domain": "cover",
      "service": "set_cover_position",
      "service_data": {
          "entity_id": entityId,
          "position": value
      }
    })
  }

  async welcomeClient(socket) {
    this.emit(this._entities, socket)
  }

}

module.exports = RoomService