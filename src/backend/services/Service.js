class Service {

  constructor(config, io, id) {
    this._id = id
    this._io = io
    this._config = config
    this._logger = this.config.coreLogger.createChild(id)
  }

  get logger() {
    return this._logger
  }

  get id() {
    return this._id
  }

  get config() {
    return this._config
  }

  async onMessage(payload) {
    this.logger.log(`Service "${this._id}" received a message`, payload)
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