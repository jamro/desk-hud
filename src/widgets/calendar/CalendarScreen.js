import LineArt from "../../frontend/components/LineArt"
import TextField from "../../frontend/components/TextField"

const BUSY_SCALE_STEP = 11.4

export default class CalendarScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0

    this.events = null

    this._agenda = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._agenda.anchor.set(0, 0)
    this.addChild(this._agenda)
    this._agenda.x = -270
    this._agenda.y = -80

    this._bg = new LineArt()
    this._bg.addLine(-150, -105, -150, 80, 1, 0x888888)
    this._bg.addLine(200, -105, 200, 95)
    for(let i=0; i < 15; i++) {
      this._bg.addLine(200, -76+i*BUSY_SCALE_STEP, 250, -76+i*BUSY_SCALE_STEP, 1, 0xff0000)
    }

    this.addChild(this._bg)

    const hours = Array(15).fill(1)
      .map((_, i) => `${String(i+6).padStart(2, '0')}:00`)
      .join('\n')

    this._timeScale = new TextField(hours, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 9,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'right',
    })
    this._timeScale.y = -85
    this._timeScale.x = 290
    this._timeScale.anchor.set(1, 0)
    this.addChild(this._timeScale)

    this._busyCanvas = new PIXI.Graphics()
    this._busyCanvas.x = 200
    this._busyCanvas.y = -76
    this.addChild(this._busyCanvas)

    this._busyPointer = new PIXI.Graphics()
    this._busyPointer.beginFill(0xffffff)
    this._busyPointer.moveTo(0, -5)
    this._busyPointer.lineTo(5, 0)
    this._busyPointer.lineTo(0, 5)
    this._busyPointer.lineTo(-2, 5)
    this._busyPointer.lineTo(-2, -5)
    this._busyPointer.lineTo(0, -5)
    this._busyPointer.endFill()
    this._busyPointer.lineStyle({
      width: 1,
      color: 0xffffff
    })
    this._busyPointer.moveTo(0, 0)
    this._busyPointer.lineTo(15, 0)
    this._busyPointer.x = this._busyCanvas.x
    this._busyPointer.y = this._busyCanvas.y
    this.addChild(this._busyPointer)
   
  }

  render(renderer) {
    this._agenda.progress = this.progress
    this._timeScale.progress = this.progress
    this._bg.progress = this.progress

    const now = new Date()

    const formatTime = (t) => {
      const date = new Date(t)

      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    if(this.events) {
      this._agenda.text = this.events
        .slice(0, 11)
        .filter(e => e.end >= now.getTime())
        .map(e => `${formatTime(e.start)} - ${formatTime(e.end)}   ${e.summary.substring(0, 41)}`).join('\n') || '                no more meetings today'


      this._busyCanvas.clear()
      this._busyCanvas.beginFill(0xff0000)
      for(let event of this.events) {
        if(event.allDay) continue
        let startY = new Date(event.start)
        let endY = new Date(event.end)
        startY = startY.getHours() + startY.getMinutes()/60
        startY = Math.min(20, Math.max(6, startY))
        startY = (startY-6)*BUSY_SCALE_STEP
        endY = endY.getHours() + endY.getMinutes()/60
        endY = Math.min(20, Math.max(6, endY))
        endY = (endY-6)*BUSY_SCALE_STEP
        if(startY === endY) continue

        this._busyCanvas.drawRect(5, startY, 40, endY - startY)
      }
    }
    this._busyCanvas.scale.set(this.progress, 1)
    this._busyPointer.alpha = this.progress

    let pointerY = now.getHours() + now.getMinutes()/60
    pointerY = Math.min(20, Math.max(6, pointerY))
    pointerY = (pointerY-6)*BUSY_SCALE_STEP
    this._busyPointer.y = pointerY - 76

    super.render(renderer)
  }
}