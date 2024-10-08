class Service {

  constructor(config, io, webApp, id) {
    this._id = id
    this._io = io
    this._webApp = webApp
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
    if(this.logger) {
      this.logger.log(`Emitting event (widgetId:${this._id})`)
    }
    (socket || this._io).emit('widget', { widgetId: this._id, payload })
  }

}

module.exports = Service