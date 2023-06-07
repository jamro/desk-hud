import TaskItem from "./TaskItem"

const TASK_MAX = 8

export default class TodoListScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.actionList = null

    this._tasks = []
    
  }

  render(renderer) {
    if(this.actionList) {
      while(this._tasks.length > this.actionList.length || this._tasks.length > TASK_MAX) {
        this.removeChild(this._tasks.pop())
      }
      while(this._tasks.length < this.actionList.length && this._tasks.length < TASK_MAX) {
        const task = new TaskItem()
        task.x = -240
        task.y = this._tasks.length*20 - 75
        this._tasks.push(task)
        this.addChild(task)
      }

      for(let i=0; i < this._tasks.length; i++) {
        this._tasks[i].progress = this.progress
        this._tasks[i].title = this.actionList[i].title
        this._tasks[i].id = this.actionList[i].id
        this._tasks[i].completed = !!this.actionList[i].completed
      }
    }

    super.render(renderer)
  }
}