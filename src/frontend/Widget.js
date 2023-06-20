import MainScreen from "./MainScreen"
import TitleCircle from "./circles/TitleCircle"

export default class Widget extends PIXI.Container {

  constructor(id, title) {
    super()
    this._id = id
    this._container = new PIXI.Container()
    super.addChild(this._container)
    this._title = title
    this._frame = new TitleCircle(title)
    this.addChild(this._frame)
    this._progress = 0
    this.size = 1
    this.index = 0
    this._bg = new PIXI.Graphics()
    this._bg.beginFill(0x000000, 0.01)
    this._bg.drawCircle(0, 0, 100)
    this.addChild(this._bg)
    this.interactive = true
    this.main = new MainScreen()
    this.dataLoadProgress = 1
    this._lastRenderTime = performance.now()
    this._state = null

    this.on('pointertap', () => {
      this.emit('activate')
    });
    this.movement = {
      timeLeft: 0,
      index1: 0,
      x1: 0,
      y1: 0,
      size1: 1,
      index2: 0,
      x2: 0,
      y2: 0,
      size2: 1,
      flickTime: 0
    }
  }

  get state() {
    return this._state
  }

  initState(obj) {
    this.log('State initialized', obj)
    this.dataLoadProgress = 0
    this._state = {
      ...obj,
      lastUpdate: null
    }
  }

  updateState(obj) {
    this.log('State updated', obj)
    this._state = {
      ...this._state,
      ...obj,
      lastUpdate: new Date().getTime()
    }
  }

  get id() {
    return this._id
  }

  addChild(c) {
    this._container.addChild(c)
  }
  addChildAt(c, n) {
    this._container.addChildAt(c, n)
  }
  removeChild(c) {
    this._container.removeChild(c)
  }

  get progress() {
    return this._progress
  }

  set progress(v) {
    this._progress = v
  }

  moveTo(slot, timePos=0) {
    this.movement.timeLeft = 1-timePos
    this.movement.x1 = this.x
    this.movement.y1 = this.y
    this.movement.size1 = this.size
    this.movement.x2 = slot.x
    this.movement.y2 = slot.y
    this.movement.size2 = slot.size
    this.movement.index1 = this.index
    this.movement.index2 = slot.index
    this.movement.flickTime = Math.random()
  }

  render(renderer) {
    const dt = performance.now() - this._lastRenderTime
    this._lastRenderTime = performance.now()
    const animStep = (Math.min(1, dt/500))

    if(this._state && this._state.lastUpdate && this.dataLoadProgress < 1) {
      this.dataLoadProgress = Math.min(1, this.dataLoadProgress + 0.02)
    }

    this._bg.scale.set(this.size)
    this._frame.size = this.size
    this._frame.progress = this._progress

    const rescaleTime = (t, min, max) => Math.min(1, Math.max(0, t - min)/(max-min))

    if(this.movement.timeLeft > 0) {
      const {x1, y1, size1, x2, y2, size2} = this.movement
      this.movement.timeLeft = Math.max(0, this.movement.timeLeft - animStep)
      const timeLeft = this.movement.timeLeft 

      const t1 = rescaleTime(timeLeft, 0, 0.4)
      const t2 = rescaleTime(timeLeft, 0.4, 0.6)
      const t3 = rescaleTime(timeLeft, 0.6, 1)

      this.x = x1*t2 + x2*(1-t2)
      this.y = y1*t2 + y2*(1-t2)
      this.size = size1*t2 + size2*(1-t2)

      if(this.movement.index2 === 0) {
        this.main.progress = (1-t1) * this.progress
        this.alpha = (t3 > 0) ? 0.2+0.8*Math.random() : 1
      }
      if(this.movement.index1 === 0) {
        this.main.progress = t3 * this.progress
      }

      if(timeLeft === 0) {
        this.index = this.movement.index2
        if(this.index !== 0 && this.main.parent) {
          const toRemove = this.main
          setTimeout(() => {
            if(toRemove.parent) {
              toRemove.parent.removeChild(toRemove)
            }
          })
          
        }
      }
    } else {
      if(this.index === 0) {
        this.main.progress = this.progress
      } else {
        this.main.progress = 0
      }
    }
    if(this.x < 1500) {
      super.render(renderer)
    }
  }

  msg2state(msg) {
    return null
  }

  onMessage(msg) {
    const newState = this.msg2state(msg)
    if(newState) {
      this.updateState(newState)
    }
  }

  onConfig(config) {

  }

  sendMessage(payload) {
    const msg = {serviceId: this._id, payload}
    this.log('Sending message:', msg)
    this.emit('service', msg)
  }

  log(...args) {
    console.log(`[${this._id}]`, ...args)
  }

  toString() {
    return `[Widget title="${this._title}"]`
  }

}