class Service {

  constructor(io, id) {
    this._id = id
    this._io = io
  }

  get id() {
    return this._id
  }

  getConfig(name) {
    const result = process.env[name]
    if(!result) throw new Error(`Env ${name} not found`)
    return result
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