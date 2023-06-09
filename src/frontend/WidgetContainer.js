import InfoMessage from "./InfoMessage"
import SleepToggle from "./SleepToggle"
import WindowBorder from "./WindowBorder"
import IconButton from "./components/IconButton"


const HELLO = ['hi', 'hello', 'hey there', 'what\'s up?', 'howdy', 'greetings', 'what\'s going on?', 'how\'s everything?', 'good to see you', 'nice to see you', 'what\'s new?', 'look who it is?', 'yo!', 'hello my friend', 'good day']
const BYE = ['bye, bye...', 'see ya!', 'goodbye', 'have a nice day', 'take care', 'cheers', 'keep in touch', 'have fun', 'have a good one', 'ciao', 'adios', 'peace out', 'catch you later', 'take it easy']

export default class WidgetContainer extends PIXI.Container {

  constructor() {
    super()
    this._slots = [
      { index: 0, x: 810,    y: 165,   size: 1},
      { index: 1, x: 1080,   y: 165,   size: 1},
      { index: 2, x: 1400,   y: 100,   size: 0.5},
      { index: 3, x: 1265,   y: 100,   size: 0.5},
      { index: 4, x: 1265,   y: 220,   size: 0.5},
      { index: 5, x: 1400,   y: 220,   size: 0.5},
      { index: 6, x: 1600,   y: 160,   size: 0.5},
    ]

    this.progress = 0
    this.distance = 0
    this.memLoad = 0
    this.cpuLoad = 0
    this.cpuTemp = 0
    this.cpuFanMode = 'off'
    this._widgets = {}
    this._widgetList = []
    this._sleep = !localStorage.getItem('isAwake')
    this._online = false
    this._lastRenderTime = performance.now()

    this._sleepToggle = new SleepToggle()
    this._sleepToggle.x = 30
    this._sleepToggle.y = 300
    this.addChild(this._sleepToggle)
    this._sleepToggle.on('pointertap', () => {
      this._sleep = !this._sleep
      if(this._sleep) {
        this.goSleep()
      } else {
        this.wakeUp()
      }
    })

    this._infoMessage = new InfoMessage()
    this._infoMessage.x = 55
    this._infoMessage.y = 298
    this.addChild(this._infoMessage)

    this._border = new WindowBorder()
    this.addChild(this._border)

    this._border.on('rotate', (direction) => this._rotateWidgets(direction))
    this._border.on('cpuFanMode', (...args) => this.emit('cpuFanMode', ...args))

    this._reloadButton = new IconButton(0xe863)
    this._reloadButton.x = 30
    this._reloadButton.y = 50
    this._reloadButton.alpha = 0.3
    this._reloadButton.scale.set(0.7)
    this._reloadButton.on('pointertap', () => this.emit('reload'))
    this.addChild(this._reloadButton)
  }

  _rotateWidgets(direction) {

    if(direction > 0 && this._widgetList.length > 2) {
      const firstWidget =  this._widgetList[2]
      for(let i=3; i < this._widgetList.length; i++) {
        this._widgetList[i-1] = this._widgetList[i]
      }
      this._widgetList[this._widgetList.length-1] = firstWidget
    } else {
      const lastWidget =  this._widgetList[this._widgetList.length-1]
      for(let i=this._widgetList.length-1; i >= 3; i--) {
        this._widgetList[i] = this._widgetList[i-1]
      }
      this._widgetList[2] = lastWidget
    }

    for(let i=2; i < this._widgetList.length; i++) {
      this._widgetList[i].moveTo(this._slots[i], 0.3)
    }
  }

  get infoMessage() {
    return this._infoMessage
  }

  goSleep() {
    this._sleep = true
    this._infoMessage.text = BYE[Math.floor(Math.random()*BYE.length)]
    localStorage.removeItem('isAwake')
  }

  wakeUp() {
    this._sleep = false
    this._infoMessage.text = HELLO[Math.floor(Math.random()*HELLO.length)]
    localStorage.setItem('isAwake', true)
  }


  set online(v) {
    this._online = v
    this._sleepToggle.pulse = !v
  }

  get online() {
    return this._online
  }

  routeMessage(widgetId, msg) {
    if(!this._widgets[widgetId]) {
      console.warn(`Widget "${widgetId}" not found. Ignoring incoming message`)
      return
    }
    this._widgets[widgetId].onMessage(msg)
  }

  routeConfig(widgetId, msg) {
    if(!this._widgets[widgetId]) {
      console.warn(`Widget "${widgetId}" not found. Ignoring incoming config`)
      return
    }
    this._widgets[widgetId].onConfig(msg)
  }

  addWidget(widget) {
    const index = this._widgetList.length
    this._widgetList.push(widget)
    this._widgets[widget.id] = widget

    while(this._slots.length < index+1) {
      this._slots.push({
        ...this._slots[this._slots.length-1],
        index: this._slots.length
      })
    }

    widget.x = this._slots[index].x
    widget.y = this._slots[index].y
    widget.index = this._slots[index].index
    widget.size = this._slots[index].size
    this.addChild(widget)

    widget.main.x = 350
    widget.main.y = 160
    if(index === 0) {
      this.addChild(widget.main)
    }

    widget.on('activate', () => this._activate(widget))
  }

  _activate(widget) {
    let sourceWidget = widget
    let index = this._widgetList.indexOf(widget)
    if(index === 0) {
      index = 1
      sourceWidget = this._widgetList[index]
    }

    this._widgetList[index] = this._widgetList[0]
    this._widgetList[0] = sourceWidget

    this.addChild(sourceWidget.main)

    this._widgetList[0].moveTo(this._slots[0])
    this._widgetList[index].moveTo(this._slots[index])
  }

  render(renderer) {
    const dt = performance.now() - this._lastRenderTime
    this._lastRenderTime = performance.now()
    const animStep = (Math.min(1, dt/500))

    if(this._sleep) {
      this.progress = Math.max(0, this.progress - animStep)
    } else {
      this.progress = Math.min(1, this.progress + animStep)
    }
    for(let i=0; i < this._widgetList.length; i++) {
      const widget = this._widgetList[i]
      widget.progress = this.progress
    }
    if(this._sleepToggle.pulse) {
      this._infoMessage.text = "conNecting..."
    }
    this._border.progress = this.progress
    this._border.rotationActive = (this._widgetList.length > 6)
    this._border.distance = this.distance
    this._border.cpuLoad = this.cpuLoad
    this._border.memLoad = this.memLoad
    this._border.cpuTemp = this.cpuTemp
    this._border.cpuFanMode = this.cpuFanMode
    this._reloadButton.alpha += (this.progress*0.3 * (this.online ? 1 : 0) - this._reloadButton.alpha)/10
    this._reloadButton.interactive = this.online
    super.render(renderer)
  }
}