class Service {

  constructor(io, id) {
    this._id = id
    this._io = io
  }

  getConfig(name) {
    const result = process.env[name]
    if(!result) throw new Error(`Env ${name} not found`)
    return result
  }

  async welcomeClient(socket) {

  }

  emit(payload, socket=null) {
    (socket || this._io).emit('widget', { widgetId: this._id, payload })
  }

  start() {

  }

}

module.exports = Service