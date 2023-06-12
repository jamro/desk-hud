import TextField from "../../frontend/components/TextField"
import TaskItem from "./TaskItem"
import ScrollContainer from '../../frontend/components/ScrollContainer'

const TASK_MAX = 20
const ITEM_HEIGHT = 50

export default class TodoListScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.actionList = null
    this.offsetY = 0
    this.dragging = false

    this._tasks = []

    this._taskContainer = new ScrollContainer(580, 180)
    this._taskContainer.contentRect.x=0
    this._taskContainer.contentRect.y=0
    this._taskContainer.contentRect.height=0
    this._taskContainer.contentRect.width=0
    this._taskContainer.contentMask.clear()
    this._taskContainer.contentMask.beginFill(0x0000ff)
    this._taskContainer.contentMask.moveTo(-290, -90)
    this._taskContainer.contentMask.lineTo(-257, -90)
    this._taskContainer.contentMask.lineTo(-242, -105)
    this._taskContainer.contentMask.lineTo(250, -105)
    this._taskContainer.contentMask.lineTo(265, -90)
    this._taskContainer.contentMask.lineTo(280, -90)
    this._taskContainer.contentMask.lineTo(280, 95)
    this._taskContainer.contentMask.lineTo(150, 95)
    this._taskContainer.contentMask.lineTo(135, 110)
    this._taskContainer.contentMask.lineTo(15, 110)
    this._taskContainer.contentMask.lineTo(0, 95)
    this._taskContainer.contentMask.lineTo(-250, 95)
    this._taskContainer.contentMask.lineTo(-265, 80)
    this._taskContainer.contentMask.lineTo(-290, 80)
    this._taskContainer.contentMask.lineTo(-290, -90)
    this.addChild(this._taskContainer)

    this._taskContainer.scroller.clear()
    this._taskContainer.scroller.beginFill(0x000000, 0.0001)
    this._taskContainer.scroller.drawRect(-240, -100, 520, 200)

    this._statsLabel = new TextField(' todo | show | all ', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'left',
    })
    this._statsLabel.x = 202
    this._statsLabel.y = 101
    this.addChild(this._statsLabel)

    this._statsValues = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 10.5,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._statsValues.x = 203
    this._statsValues.y = 118
    this.addChild(this._statsValues)
  }

  render(renderer) {
    this._taskContainer.contentRect.height=this._tasks.length*ITEM_HEIGHT+20
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

      this._statsValues.text = [
        this.actionList.filter(a => !a.completed).length, 
        Math.min(this.actionList.length, TASK_MAX), 
        this.actionList.length
      ].map(v => String(v).padStart(3, ' ')).join('  ')
    }
    this._statsLabel.progress = this.progress
    this._statsValues.progress = this.progress

    super.render(renderer)
  }
}