import GravityContainer from "./GravityContainer"
import SleepToggle from "./SleepToggle"

export default class GravityField extends PIXI.Container {

  constructor() {
    super()
    this._slots = [
      { x: 810,    y: 165,   size: 1},
      { x: 1080,   y: 155,   size: 1},
      { x: 1275,   y: 80,    size: 0.5},
      { x: 1265,   y: 240,   size: 0.5},
      { x: 1410,   y: 80,    size: 0.5},
      { x: 1400,   y: 240,   size: 0.5},
    ]

    this._containers = []
    this._widgets = {}
    this._sleep = false
    this._online = false

    this._sleepToggle = new SleepToggle()
    this._sleepToggle.x = 40
    this._sleepToggle.y = 280
    this.addChild(this._sleepToggle)
    this._sleepToggle.on('pointertap', () => this._sleep = !this._sleep)
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
    this._widgets[widget.id] = widget
    const index = this._containers.length
    const container = new GravityContainer(widget)
    this._containers[index] = container
    container.x = this._slots[index].x
    container.y = this._slots[index].y
    container.targetX = container.x
    container.targetY = container.y
    container.size = this._slots[index].size
    container.targetSize = container.size
    this.addChild(container)

    widget.on('activate', () => this._activate(container))
  }

  _activate(widget) {
    const index = this._containers.indexOf(widget)
    this._containers.splice(index, 1)
    this._containers.unshift(widget)

    for(let i=0; i < this._containers.length; i++) {
      this._containers[i].targetSize = this._slots[i].size
    }
  }

  render(renderer) {
    for(let i=0; i < this._containers.length; i++) {
      const slot = this._slots[i]
      const widget = this._containers[i]
      widget.applyGravityForce(slot.x, slot.y)
      if(this._sleep) {
        widget.content.progress = Math.max(0, widget.content.progress - 0.03)
      } else {
        widget.content.progress = Math.min(1, widget.content.progress + 0.03)
      }
    }
    super.render(renderer)
  }
}