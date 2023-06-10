const Service = require("../../backend/services/Service")
const storage = require('node-persist');

class PomodoroService extends Service {

  constructor(config, io) {
    super(config, io, 'pomodoro')
    this._history = []
  }

  async start() {
    this._history = await storage.getItem('pomodoro.history') || []
    this.emit(await this.fetchAll())
  }

  async welcomeClient(socket) {
    this.emit(await this.fetchAll(), socket)
  }

  async fetchAll() {
    return { history: this._history}
  }

  async _addPomodoro() {
    this._history.push(new Date().getTime())
    while(this._history.length > 500) {
      this._history.unshift()
    }
    await storage.setItem('pomodoro.history', this._history)
    this.emit(await this.fetchAll())
  }

  async onMessage({action, id}) {
    switch(action) {
      case 'pomodoroDone': return await this._addPomodoro()
    }
  }


}

module.exports = PomodoroService