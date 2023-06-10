import Widget from '../../frontend/Widget.js'
import TimelineCircle from '../../frontend/circles/TimelineCircle.js'
import TickCircle from '../../frontend/circles/TickCircle.js'
import DotCluster from '../../frontend/components/DotCluster.js'
import ScaleCircle from '../../frontend/circles/ScaleCircle.js'
import ProgressCircle from '../../frontend/circles/ProgressCircle.js'
import TodoListScreen from './TodoListScreen.js'
import MainScreen from '../../frontend/MainScreen.js'

export default class TodoWidget extends Widget {
  constructor() {
    super('todo', "Tasks")
    this._dataLoadProgress = 0
    this.data = {
      lastUpdate: null,
      inboxList: null,
      actionList: null,
    }

    this._scaleLarge = new TickCircle()
    this._scaleLarge.count = 8
    this._scaleLarge.countMax = 7
    this._scaleLarge.rotation = Math.PI/4
    this._scaleLarge.length = 0.2
    this.addChild(this._scaleLarge)

    this._inboxFrame = new ProgressCircle()
    this._inboxFrame.size = 0.51
    this._inboxFrame.value = 1
    this._inboxFrame.lineWidth = 1
    this._inboxFrame.alpha = 0.5
    this.addChild(this._inboxFrame)

    this._timeScale = new ScaleCircle(0, 24, 'h', 7, Math.PI*1.5)
    this._timeScale.rotation = Math.PI*0.25
    this.addChild(this._timeScale)

    this._dotCluster = new DotCluster()
    this._dotCluster.title = 'inbox'
    this.addChild(this._dotCluster)

    this._timeline = new TimelineCircle(0, 1000*60*60*24, Math.PI*1.5)

    this.addChild(this._timeline)

  }

  createMainScreen() {
    const screen = new MainScreen()
    screen.title = "Getting Things Done"
    const page = screen.getPage(0)
   
    this._todoListScreen = new TodoListScreen()
    page.addChild(this._todoListScreen)

    this._todoListScreen.on('complete', (id) => {
      this.sendMessage({action: 'completeNextAction', id})
    })
    this._todoListScreen.on('uncomplete', (id) => {
      this.sendMessage({action: 'uncompleteNextAction', id})
    })

    return screen
  }

  onMessage(tasks) {

    this.data.lastUpdate = new Date().getTime()
    this.data.inboxList = tasks.inbox
    this.data.actionList = tasks.action
    this.data.todayLeft = this.data.actionList.filter(t => t.status === 'needsAction')

    const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000
    this._timeline.setPoints(this.data.actionList.map(i => i.completed ? i.completed - today : null))  
  }

  render(renderer) {
    super.render(renderer)

    const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000

    if(this.data.lastUpdate && this._dataLoadProgress < 1) {
      this._dataLoadProgress = Math.min(1, this._dataLoadProgress + 0.02)
    }

    this._dotCluster.count = this.data.inboxList ? this.data.inboxList.length : 0
    this._dotCluster.progress = this.progress * this._dataLoadProgress

    this._timeline.progress = this.progress * this._dataLoadProgress
    this._timeline.size = this.size
    this._timeline.now = new Date().getTime() - today

    this._scaleLarge.progress = this.progress
    this._scaleLarge.size = this.size
    this._scaleLarge.visible = this.size === 1

    this._timeScale.progress = this.progress
    this._timeScale.size = this.size*1.05

    this._timeScale.value = (this._timeline.now)/(1000*60*60)
    this._timeScale.visible = this.size === 1
    
    this._inboxFrame.progress = this.progress
    this._inboxFrame.visible = this.size === 1

    if(this._todoListScreen && this.main) {      
      this._todoListScreen.progress = this.main.progress * this._dataLoadProgress
    }
    this._todoListScreen.actionList = this.data.actionList
  }
}