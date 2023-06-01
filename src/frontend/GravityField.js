import InfoMessage from "./InfoMessage"
import SleepToggle from "./SleepToggle"


const HELLO = ['hi', 'hello', 'hey there', 'what\'s up?', 'howdy', 'greetings', 'what\'s going on?', 'how\'s everything?', 'good to see you', 'nice to see you', 'what\'s new?', 'look who it is?', 'yo!', 'hello my friend', 'good day']
const BYE = ['bye, bye...', 'see ya!', 'goodbye', 'have a nice day', 'take care', 'cheers', 'keep in touch', 'have fun', 'have a good one', 'ciao', 'adios', 'peace out', 'catch you later', 'take it easy']

export default class GravityField extends PIXI.Container {

  constructor() {
    super()
    this._slots = [
      { index: 0, x: 810,    y: 165,   size: 1},
      { index: 1, x: 1080,   y: 155,   size: 1},
      { index: 2, x: 1275,   y: 80,    size: 0.5},
      { index: 3, x: 1265,   y: 240,   size: 0.5},
      { index: 4, x: 1410,   y: 80,    size: 0.5},
      { index: 5, x: 1400,   y: 240,   size: 0.5},
    ]

    this._widgets = {}
    this._widgetList = []
    this._sleep = !localStorage.getItem('isAwake')
    this._online = false

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
    this._widgets[widgetId].onMessage(msg)
  }

  addWidget(widget) {
    const index = this._widgetList.length
    this._widgetList.push(widget)
    this._widgets[widget.id] = widget

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
    const index = this._widgetList.indexOf(widget)
    if(index === 0) return
    this._widgetList.splice(index, 1)
    this._widgetList.unshift(widget)

    this.addChild(widget.main)

    for(let i=0; i < this._widgetList.length; i++) {
      this._widgetList[i].moveTo(this._slots[i])
    }
  }

  render(renderer) {
    for(let i=0; i < this._widgetList.length; i++) {
      const widget = this._widgetList[i]
      if(this._sleep) {
        widget.progress = Math.max(0, widget.progress - 0.08)
      } else {
        widget.progress = Math.min(1, widget.progress + 0.08)
      }
    }
    if(this._sleepToggle.pulse) {
      this._infoMessage.text = "conNecting..."
    }
    super.render(renderer)
  }
}