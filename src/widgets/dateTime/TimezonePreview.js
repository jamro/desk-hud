import LineArt from "../../frontend/components/LineArt"
import TextField from "../../frontend/components/TextField"
import TimelineSegment from "./TimelineSegment"


const SHOW_SEGMENTS = 11
const SEGMENT_WIDTH = 30
const SEGMENT_HEIGHT = 34

function getTimezoneMs(options={}) {
  return new Date ((new Date()).toLocaleString('en-GB', {hour12: false, ...options}).replace(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4}), (.*)$/, "$3-$2-$1T$4")).getTime()
}

export default class TimezonePreview extends PIXI.Container {
  constructor(timezones) {
    super()

    this._timezones = timezones 
    this._dragging = false
    this._offsetX = 0
    this._dragStartX = 0
    this.progress = 0
    this._dragV = 0
    this._lastDragTime = -10000

    this._timezones = timezones.map(t => {
      const localTimestamp = getTimezoneMs()
      const remoteTimestamp = getTimezoneMs({timeZone: t.id})
      let offset = (remoteTimestamp - localTimestamp)/(1000*60*60)
      return {
        ...t,
        offset
      }
    }) 

    this._container = new PIXI.Container()
    this._container.x = 120
    this.addChild(this._container)

    this._maskShape = new PIXI.Graphics()
    this._maskShape.beginFill(0x0000ff, 0.5)
    this._maskShape.drawRect(-1, -1, SHOW_SEGMENTS*SEGMENT_WIDTH+2, 4*SEGMENT_HEIGHT+5)
    this._maskShape.x = 120
    this._maskShape.y = -20
    this.addChild(this._maskShape)
    this._container.mask = this._maskShape

    this._nameLabels = this._timezones
      .map(({name}, i) => {
        const txt = new TextField(name, {
          fontFamily: 'MajorMonoDisplay-Regular',
          fontSize: 11,
          fill: '#ffffff',
          stroke: "#ffffff",
          strokeThickness: 0.5,
          align: 'left',
        })
        txt.anchor.set(0, 0.5)
        txt.y = SEGMENT_HEIGHT*i
        this.addChild(txt)
        return txt
      })

    this._timeLabels = this._timezones
      .map((_, i) => {
        const txt = new TextField('00:00:00', {
          fontFamily: 'MajorMonoDisplay-Regular',
          fontSize: 11,
          fill: '#ffffff',
          stroke: "#ffffff",
          strokeThickness: 0.5,
          align: 'right',
        })
        txt.anchor.set(1, 0.5)
        txt.y = SEGMENT_HEIGHT*i
        txt.x = 540
        this.addChild(txt)
        return txt
      })

    this._segments = this._timezones
      .map(({offset}, i) => {
        const segment = new TimelineSegment()
        segment.x = (-offset) * SEGMENT_WIDTH
        segment.y = SEGMENT_HEIGHT*i
        this._container.addChild(segment)
        return [segment]
      })

    this._pointer = new LineArt()
    this.addChild(this._pointer)
    this._pointer.addSequence([
      120 + 5.5*SEGMENT_WIDTH, -SEGMENT_HEIGHT/2-5,
      120 + 5.5*SEGMENT_WIDTH, SEGMENT_HEIGHT*this._timezones.length-SEGMENT_HEIGHT/2+5,
    ], 4, 0xff0000)
    this._pointer.alpha = 0.8
    
    this._dragBox = new PIXI.Graphics()
    this._dragBox.beginFill(0x000000, 0.0001)
    this._dragBox.drawRect(-SHOW_SEGMENTS*SEGMENT_WIDTH/2, -2*SEGMENT_HEIGHT, SHOW_SEGMENTS*SEGMENT_WIDTH, 4*SEGMENT_HEIGHT)
    this._dragBox.x = 120+SHOW_SEGMENTS*SEGMENT_WIDTH/2
    this._dragBox.y = -20+2*SEGMENT_HEIGHT
    this._dragBox.interactive = true
    this.addChild(this._dragBox)
    this._dragBox.on('mousedown', (e) => this._startDrag(e.data.global.x))
    this._dragBox.on('mouseup', (e) => this._stopDrag(e.data.global.x))
    this._dragBox.on('pointerdown', (e) => this._startDrag(e.data.global.x))
    this._dragBox.on('pointermove', (e) => this._updateDrag(e.data.global.x))
    this._dragBox.on('pointerup', (e) => this._stopDrag(e.data.global.x))
  }

  _startDrag(x) {
    this._offsetX = x - this._dragBox.x
    this._dragStartX = this._container.x
    this._dragBox.scale.set(100)
    this._dragging = true
  }

  _updateDrag(x) {
    if (this._dragging) {
      this._dragBox.x = x - this._offsetX
      const newPos = this._dragStartX + x - this._offsetX-120-SEGMENT_WIDTH*5.5
      this._dragV = Math.max(-SEGMENT_WIDTH, Math.min(SEGMENT_WIDTH, newPos - this._container.x))
      this._container.x = newPos
    }
  }

  _stopDrag(x) {
    if(!this._dragging) return
    this._dragBox.x = 120+SHOW_SEGMENTS*30/2
    this._dragBox.scale.set(1)
    this._dragging = false
    this._lastDragTime = performance.now()
  }

  get name() {
    return this._nameLabel.text
  }

  set name(v) {
    this._nameLabel.text = v
  }

  render(renderer) {
    this._nameLabels.forEach(t => t.progress = this.progress)
    let newSegment
    for(let i=0; i < this._segments.length; i++) {
      const segmentRow = this._segments[i]
      for(let j=0; j < segmentRow.length; j++) {
        const segment = segmentRow[j]
        segment.progress = this.progress
      }
      if(segmentRow.length > 0) {
        const absoluteStartX = segmentRow[0].x + this._container.x - 120
        const absoluteEndX = absoluteStartX + 24*SEGMENT_WIDTH*segmentRow.length
        if(absoluteEndX <= SHOW_SEGMENTS*SEGMENT_WIDTH) {
          newSegment = new TimelineSegment()
          newSegment.x = segmentRow[segmentRow.length-1].x + 24*SEGMENT_WIDTH
          newSegment.y = segmentRow[segmentRow.length-1].y
          this._container.addChild(newSegment)
          segmentRow.push(newSegment)
        }
        if(absoluteStartX > 0) {
          newSegment = new TimelineSegment()
          newSegment.x = segmentRow[0].x - 24*SEGMENT_WIDTH
          newSegment.y = segmentRow[0].y
          this._container.addChild(newSegment)
          segmentRow.unshift(newSegment)
        }
        if(absoluteStartX + 24*SEGMENT_WIDTH < 0) {
          this._container.removeChild(segmentRow.shift())
        } else if(absoluteEndX -  24*SEGMENT_WIDTH > SHOW_SEGMENTS*SEGMENT_WIDTH) {
          this._container.removeChild(segmentRow.pop())
        }
      }
    }
    let timePos = -((this._container.x-120)/SEGMENT_WIDTH-6)
    if(timePos < 0) {
      timePos += Math.ceil(-timePos/24)*24
    }
    timePos = timePos % 24
    this._pointer.progress = this.progress
    this._dragBox.visible = this.progress > 0

    for(let i=0; i < this._timezones.length; i++) {
      this._timeLabels[i].progress = this.progress
      const t = (timePos + this._timezones[i].offset + 24) % 24
      const hh = Math.floor(t)
      const mm = Math.floor(t*60) % 60
      const ss = Math.floor(t*60*60) % 60
      this._timeLabels[i].text = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    }

    if(!this._dragging) {
      let targetPos = this._container.x
      if(performance.now() - this._lastDragTime > 3000) {
        const now = new Date()
        targetPos = 120 - (now.getHours()-1-5 + now.getMinutes()/60 + now.getSeconds()/(60*60))*SEGMENT_WIDTH
        const targetDrag = Math.max(-SEGMENT_WIDTH*0.2, Math.min(SEGMENT_WIDTH*0.2, (targetPos - this._container.x)/10))
        this._container.x = Math.abs(this._container.x - targetPos) > 0.01 ? this._container.x + this._dragV : targetPos
        this._dragV += (targetDrag - this._dragV)/10
      } else {
        this._container.x += this._dragV
        this._dragV += (0 - this._dragV)/20
      }

    }
    super.render(renderer)
  }
}