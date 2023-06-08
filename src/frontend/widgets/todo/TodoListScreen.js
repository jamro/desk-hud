import TaskItem from "./TaskItem"

const TASK_MAX = 8
const ITEM_HEIGHT = 50

export default class TodoListScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.actionList = null
    this.offsetY = 0
    this.dragging = false

    this._tasks = []

    this._taskMask = new PIXI.Graphics()
    this._taskMask.beginFill(0x0000ff)
    this._taskMask.moveTo(-290, -90)
    this._taskMask.lineTo(-257, -90)
    this._taskMask.lineTo(-242, -105)
    this._taskMask.lineTo(250, -105)
    this._taskMask.lineTo(265, -90)
    this._taskMask.lineTo(280, -90)
    this._taskMask.lineTo(280, 95)
    this._taskMask.lineTo(150, 95)
    this._taskMask.lineTo(135, 110)
    this._taskMask.lineTo(15, 110)
    this._taskMask.lineTo(0, 95)
    this._taskMask.lineTo(-250, 95)
    this._taskMask.lineTo(-265, 80)
    this._taskMask.lineTo(-290, 80)
    this._taskMask.lineTo(-290, -90)
    this.addChild(this._taskMask)
    this._taskContainer = new PIXI.Container()
    this._taskContainer.mask = this._taskMask
    this.addChild(this._taskContainer)

    this._scroller = new PIXI.Graphics()
    this._scroller.beginFill(0x000000, 0.0001)
    this._scroller.drawRect(-240, -100, 520, 200)
    this.addChild(this._scroller)
    this._scroller.interactive = true
    this._scroller.on('mousedown', (e) => this._startDrag(e.data.global.y))
    this._scroller.on('mouseup', (e) => this._stopDrag(e.data.global.y))
    this._scroller.on('pointerdown', (e) => this._startDrag(e.data.global.y))
    this._scroller.on('pointermove', (e) => this._updateDrag(e.data.global.y))
    this._scroller.on('pointerup', (e) => this._stopDrag(e.data.global.y))
  }


  _boundY(y) {
    return Math.max(-this._tasks.length*ITEM_HEIGHT+160, Math.min(0, y))
  }

  _startDrag(y) {
    this.offsetY = y - this._taskContainer.y
    this._scroller.scale.set(100)
    this.dragging = true
  }

  _updateDrag(y) {
    if (this.dragging) {
      this._taskContainer.y = this._boundY(y - this.offsetY)
    }
  }

  _stopDrag(y) {
    if(!this.dragging) return
    this._taskContainer.y = this._boundY(y - this.offsetY)
    this._scroller.scale.set(1)
    this._scroller.y = 0
    this.dragging = false
  }

  render(renderer) {
    if(this.actionList) {
      while(this._tasks.length > this.actionList.length || this._tasks.length > TASK_MAX) {
        this._taskContainer.removeChild(this._tasks.pop())
      }
      while(this._tasks.length < this.actionList.length && this._tasks.length < TASK_MAX) {
        const task = new TaskItem()
        task.on('complete', (id) => this.emit('complete', id))
        task.on('uncomplete', (id) => this.emit('uncomplete', id))
        task.x = -280
        task.y = this._tasks.length*ITEM_HEIGHT - 60
        this._tasks.push(task)
        this._taskContainer.addChild(task)
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