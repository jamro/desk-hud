class Service {

  constructor(config, io, id) {
    this._id = id
    this._io = io
    this._config = config
  }

  get id() {
    return this._id
  }

  get config() {
    return this._config
  }

  async onMessage(payload) {
    console.log(`Service "${this._id}" received a message`, payload)
  }

  async welcomeClient(socket) {

  }

  emit(payload, socket=null) {
    (socket || this._io).emit('widget', { widgetId: this._id, payload })
  }

  async start() {

  }

}

module.exports = Service