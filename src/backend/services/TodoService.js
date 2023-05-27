const GoogleService = require('./GoogleService.js')
const { google } = require('googleapis');

class TodoService extends GoogleService {

  constructor(io) {
    super(io, 'todo')
    this._loop = null

    this.tasks = google.tasks({ version: 'v1', auth: this.auth });
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
    const inbox = await this._queryTodo('DHUD_GOOGLE_INBOX_TASKLIST_ID')
    const action = await this._queryTodo('DHUD_GOOGLE_ACTION_TASKLIST_ID')
    const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
    return {
      inbox: inbox.filter(t => !t.completed && !t.due),
      action: action.filter(t => !t.due && (!t.completed || t.completed > today)),
    }
  }

  async _queryTodo(id) {
    const response = await this.tasks.tasks.list({
      tasklist: this.getConfig(id)
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
      .sort((a, b) => String(a.position).localeCompare(String(b.position)))
  }

}

module.exports = TodoService