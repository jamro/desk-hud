const GoogleService = require('../../backend/services/GoogleService.js')
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
    try {
      this.emit(await this.fetchAll(), socket)
    } catch (err) {
      this.logger.error(err)
    }
  }

  async update() {
    try {
      this.emit(await this.fetchAll())
    } catch (err) {
      this.logger.error(err)
    }
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

  async completeNextAction(taskId) {
    const actionListId = this.config.getProp('google.tasks.actionsId')
    this.logger.log(`Complete task ${taskId} from list ${actionListId}`)
    await this.tasks.tasks.patch({requestBody: {status: 'completed'}, tasklist: actionListId, task: taskId})
    this.emit(await this.fetchAll())
  }

  async uncompleteNextAction(taskId) {
    const actionListId = this.config.getProp('google.tasks.actionsId')
    this.logger.log(`Un-complete task ${taskId} from list ${actionListId}`)
    await this.tasks.tasks.patch({requestBody: {status: 'needsAction', completed: undefined}, tasklist: actionListId, task: taskId})
    this.emit(await this.fetchAll())
  }

  async onMessage({action, id}) {
    switch(action) {
      case 'completeNextAction': return await this.completeNextAction(id)
      case 'uncompleteNextAction': return await this.uncompleteNextAction(id)
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
        return String(a.position).localeCompare(String(b.position))
      })
  }

}

module.exports = TodoService