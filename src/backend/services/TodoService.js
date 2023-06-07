const GoogleService = require('./GoogleService.js')
const { google } = require('googleapis');

class TodoService extends GoogleService {

  constructor(config, io) {
    super(config, io, 'todo')
    this._loop = null

    this.tasks = google.tasks({ version: 'v1', auth: this.auth });
  }

  async start() {
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
    const inbox = await this._queryTodo(this.config.getProp('google.tasks.inboxId'))
    const action = await this._queryTodo(this.config.getProp('google.tasks.actionsId'))
    const endOfToday = Math.ceil((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
    const startOfToday = endOfToday - 1000*60*60*24
    return {
      inbox: inbox.filter(t => !t.completed && !t.due),
      action: action.filter(t => ((!t.due || t.due < endOfToday) && (!t.completed || t.completed > startOfToday))),
    }
  }

  async _queryTodo(id) {
    const response = await this.tasks.tasks.list({
      tasklist: id,
      maxResults: 100
    });

    return response.data.items
      .map(t => ({
        id: t.id,
        title: t.title,
        updated: new Date(t.updated).getTime(),
        position: t.position,
        status: t.status,
        completed: new Date(t.completed).getTime() || null,
        due: new Date(t.due).getTime() || null,
      }))
      .sort((a, b) => {
        if(a.completed && b.completed) return a.completed - b.completed
        if(a.completed && !b.completed) return 1
        if(!a.completed && b.completed) return -1
        return String(a.position).localeCompare(String(b.position))
      })
  }

}

module.exports = TodoService