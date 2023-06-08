import BarChart from "../../components/BarChart"
import LineArt from "../../components/LineArt"
import TextField from "../../components/TextField"

const ICONS = {
  '01d': '',    '01n': '',
  '02d': '',    '02n': '',
  '03d': '',    '03n': '',
  '04d': '',    '04n': '',
  '09d': '',    '09n': '',
  '10d': '',    '10n': '',
  '11d': '',    '11n': '',
  '13d': '',    '13n': '',
  '50d': '',    '50n': '',
}

const COL_WIDTH = 73.2 

export default class ForecastScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.dragging = false
    this.offsetX = 0
    this._startTime = 0
    this._icons = []
    this._pop = []
    this._rain = []
    this._temp = []

    this._container = new PIXI.Container()
    this._container.x = -280
    this.addChild(this._container)

    this._containerMask = new PIXI.Graphics()
    this._containerMask.beginFill(0x0000ff)
    this._containerMask.drawRect(-290, -90, 580, 180)
    this.addChild(this._containerMask)
    this._container.mask = this._containerMask

    this._scroller = new PIXI.Graphics()
    this._scroller.beginFill(0x000000, 0.0001)
    this._scroller.drawRect(-290, -90, 580, 180)
    this._scroller.interactive = true
    this._scroller.on('mousedown', (e) => this._startDrag(e.data.global.x))
    this._scroller.on('mouseup', (e) => this._stopDrag(e.data.global.x))
    this._scroller.on('pointerdown', (e) => this._startDrag(e.data.global.x))
    this._scroller.on('pointermove', (e) => this._updateDrag(e.data.global.x))
    this._scroller.on('pointerup', (e) => this._stopDrag(e.data.global.x))
    this.addChild(this._scroller)


    this._daySeparators = new LineArt()
    this._container.addChild(this._daySeparators)
    
    this._timelineHours = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._timelineHours.y = 20
    this._timelineHours.anchor.set(0, 0.5)
    this._container.addChild(this._timelineHours)

    this._timelineIcons = Array(24).fill(1).map((_, i) => {
      const ico = new TextField('', {
        fontFamily: 'weathericons-regular-webfont',
        fontSize: 21,
        fill: '#ffffff',
        stroke: "#ffffff",
        strokeThickness: 0.5,
        align: 'center',
      })
      ico.x = i * COL_WIDTH + 22
      ico.y = 50

      this._container.addChild(ico)
      return ico
    })

    this._timelinePop = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    })
    this._timelinePop.y = 80
    this._timelinePop.anchor.set(0, 0.5)
    this._container.addChild(this._timelinePop)

    this._rainChart = new BarChart({
      height: 50,
      width: 24 * 73.2,
      scaleMax: 2.5,
      scaleMin: 0,
      showScale: false,
      colFill: 0.15
    })
    this._rainChart.y = -40
    this._rainChart.x = -COL_WIDTH*0.2
    this._container.addChild(this._rainChart)

    this._tempLine = new LineArt()
    this._tempLine.y = 0
    this._tempLine.x = COL_WIDTH*0.25
    this._container.addChild(this._tempLine)

    this._tempLabels = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'center',
    })
    this._tempLabels.y = -80
    this._tempLabels.anchor.set(0, 0.5)
    this._container.addChild(this._tempLabels)

  }

  get pop() {
    return this._pop
  }

  set pop(v) {
    if(v === this._pop) return
    this._pop = v

    const pops = Array(24)
      .fill(1)
      .map((_, i) => {
        let txt
        const val = v[i]
        if(val === 0) {
          txt = ''
        } else if(val === 1) {
          txt = '100'
        } else {
          txt = Math.round(val*100) + '%'
        }
        while(txt.length < 5) {
          txt = ' ' + txt
          if(txt.length < 5) {
            txt += ' '
          }
        }
        return txt
      })
      .join('    ')
    this._timelinePop.text = pops
    
  }

  get rain() {
    return this._rain
  }

  set rain(v) {
    if(v === this._rain) return
    this._rain = v
    this._rainChart.data = v.slice(0, 24)
  }

  get temp() {
    return this._temp
  }

  set temp(v) {
    if(v === this._temp) return
    this._temp = v
    const temp24 = v.slice(0, 24)
    this._tempLine.clear()

    let valMin = temp24[0]
    let valMax = temp24[0]
    const chartHeight = 60

    for(let t of temp24) {
      valMin = Math.min(valMin, t)
      valMax = Math.max(valMax, t)
    }

    const coord = []
    for(let i=0; i < temp24.length; i++) {
      coord.push(
        i * COL_WIDTH, 
        -chartHeight*(temp24[i] - valMin)/(valMax-valMin)
      )
    }

    this._tempLine.addSequence(coord, 3, 0xff0000)

    this._tempLabels.text = Array(24)
      .fill(1)
      .map((_, i) => {
        let txt
        const val = v[i]
        txt = Math.round(val) + "°c"
        while(txt.length < 5) {
          txt = ' ' + txt
          if(txt.length < 5) {
            txt += ' '
          }
        }
        return txt
      })
      .join('    ')

  }

  get icons() {
    return this._icons
  }

  set icons(v) {
    if(v === this._icons) return
    this._icons = v
    for(let i=0; i < this._timelineIcons.length; i++) {
      this._timelineIcons[i].text = v[i] ? ICONS[v[i]] : ''
    }
  }

  get startTime() {
    return this._startTime
  }

  set startTime(v) {
    if(v === this._startTime) return 
    this._startTime = v

    const startHour = new Date(v).getHours()

    const hours = Array(24)
      .fill(1)
      .map((_, i) => ((startHour + 3*i) % 24))

    const hoursLabels = hours
      .map(h => h.toString().padStart(2, '0') + ':00')
      .join('    ')

    this._daySeparators.clear()
    for(let i=1; i<hours.length; i++) {
      if(hours[i] < hours[i-1]) {
        this._daySeparators.addLine((i-0.2)*COL_WIDTH, -90, (i-0.2)*COL_WIDTH, 90, 1, 0x888888)
      }
    }
    
    
    this._timelineHours.text = hoursLabels
  }

  _boundX(x) {
    return Math.max(-1450, Math.min(-280, x))
  }

  _startDrag(x) {
    this.offsetX = x - this._container.x
    this._scroller.scale.set(100)
    this.dragging = true
  }

  _updateDrag(x) {
    if (this.dragging) {
      this._container.x = this._boundX(x- this.offsetX)
    }
  }

  _stopDrag(x) {
    if(!this.dragging) return
    this._container.x = this._boundX(x - this.offsetX)
    this._scroller.scale.set(1)
    this._scroller.x = 0
    this.dragging = false
  }

  render(renderer) {
    this._daySeparators.progress = this.progress
    this._timelineHours.progress = this.progress
    this._tempLabels.progress = this.progress
    this._timelinePop.progress = this.progress
    this._timelineIcons.forEach(i => i.progress = this.progress)
    if(this.progress === 0) {
      this._container.x = -280
    }
    this._rainChart.progress = this.progress
    this._tempLine.progress = this.progress < 1 ? this.progress*0.4 : 1
    super.render(renderer)
  }
}