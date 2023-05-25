import Widget from '../Widget.js'
import DotCircle from '../circles/DotCircle.js'
import TickCircle from '../circles/TickCircle.js'
import ArchText from '../components/ArchText.js'
import GaugePointer from '../components/GaugePointer.js'
import PlayButton from '../components/PlayButton.js'
import TextField from '../components/TextField.js'

const WORK_DURATION= 1000 * 25 * 60
const BREAK_DURATION = 1000 * 5 * 60

export default class PomodoroWidget extends Widget {
  constructor() {
    super("Pomodoro")

    this._ticks = new TickCircle()
    this._ticks.count = 25
    this._ticks.length = 0.1
    this.addChild(this._ticks)

    this._redLight = new PIXI.Graphics()
    this._redLight.beginFill(0xff0000)
    this._redLight.drawCircle(0, 0, 100)
    this._redLight.alpha = 0
    this.addChildAt(this._redLight, 0)
    
    this._history = this._loadHistory()
    this._timerStart = Number(localStorage.getItem('Pomodoro_timerStart')) || null
    this._timerStop = Number(localStorage.getItem('Pomodoro_timerStop')) || null
    this._mode = localStorage.getItem('Pomodoro_mode') || 'work'

    this._pulse = false

    this._playButton = new PlayButton()
    this._updatePlayButtonStatus()
    this._playButton.scale.set(0)
    this._playButton.on('play', () => {
      this._timerStart = new Date().getTime()
      this._timerStop = null
      this._mode = (this._mode === 'work') ? 'break' : 'work'
      this._pulse = false
      localStorage.setItem('Pomodoro_timerStart', this._timerStart)
      localStorage.setItem('Pomodoro_timerStop', this._timerStop)
      localStorage.setItem('Pomodoro_mode', this._mode)
    })
    this._playButton.on('stop', () => {
      this._timerStop = new Date().getTime()
      this._pulse = false
      localStorage.setItem('Pomodoro_timerStop', this._timerStop)
    })

    this._workLabel = new ArchText()
    this._workLabel.text = 'Work'
    this._workLabel.positionOffset = 1.8
    this.addChild(this._workLabel)

    this._breakLabel = new ArchText()
    this._breakLabel.text = 'Break'
    this._breakLabel.color = 0xff0000
    this._breakLabel.positionOffset = 1.3
    this.addChild(this._breakLabel)

    this._modeLabel = new TextField('Work', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._modeLabel.anchor.set(0.5)
    this.addChild(this._modeLabel)

    this._pointer = new GaugePointer()
    this.addChild(this._pointer)

    this._clockCenter = new PIXI.Graphics()
    this._clockCenter.lineStyle({
      width: 2,
      alpha: 0.8,
      color: 0xffffff
    })
    this._clockCenter.drawCircle(0, 0, 10)
    this._clockCenter.beginFill(0xffffff)
    this._clockCenter.drawCircle(0, 0, 2)
    this.addChild(this._clockCenter)
    this._timeBg = new PIXI.Graphics()
    this._timeBg.beginFill(0x000000)
    this._timeBg.drawRect(-55, -9, 110, 20)
    this.addChild(this._timeBg)
   
    this._timeBgRed = new PIXI.Graphics()
    this._timeBgRed.beginFill(0xff0000)
    this._timeBgRed.drawRect(-55, -9, 110, 20)
    this._timeBgRed.alpha = 0
    this.addChild(this._timeBgRed)

    this._timeLabel = new TextField('00:00.000', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._timeLabel.anchor.set(0.5)

    this.addChild(this._timeLabel)
    this.addChild(this._playButton)


    this._dotLabel = new ArchText()
    this._dotLabel.text = 'completed:'
    this._dotLabel.color = 0xff0000
    this._dotLabel.positionOffset = -1.6
    this._dotLabel.alpha = 0
    this.addChild(this._dotLabel)

    this._dots = new DotCircle()
    this._dots.rotation = 2.1
    this._dots.count = 40
    this._dots.countMax = 0
    this.addChild(this._dots)

  }

  _loadHistory() {
    try {
      const raw = localStorage.getItem('Pomodoro_history')
      return JSON.parse(raw) || []
    } catch(err) {
      console.warn(err)
    }
    return []
  }

  _saveHistory(data) {
    while(data.length > 1000) {
      data.unshift()
    }
    try {
      const raw = localStorage.setItem('Pomodoro_history', JSON.stringify(data))
    } catch(err) {
      console.warn(err)
    }
    return []
  }

  _updatePlayButtonStatus() {
    this._playButton.mode = (this._timerStart !== null && this._timerStop === null) ? 'play' : 'stop'
  }

  _getCurrentTimeLimit() {
    return (this._mode === 'work') ? WORK_DURATION : BREAK_DURATION
  }

  _updateTimer() {
    if(!this._timerStart) return
    const now = new Date().getTime()
    let dt = (this._timerStop || now) - this._timerStart
    let timeLimit = this. _getCurrentTimeLimit()
    if(dt > timeLimit) {
      this._timerStop = this._timerStart + timeLimit
      localStorage.setItem('Pomodoro_timerStop', this._timerStop)
      this._updatePlayButtonStatus()
      this._pulse = true
      if(this._mode === 'work') {
        // pomodoro completed
        this._history.push(new Date().getTime())
        this._saveHistory(this._history)
      }
    }
    return dt / timeLimit
  }

  render(renderer) {
    super.render(renderer)

    const timeProggress = this._updateTimer()

    const now = new Date().getTime()
    let dt = this._timerStart ? (this._timerStop || now) - this._timerStart : 0
    dt = this. _getCurrentTimeLimit() - dt
    
    this._playButton.scale.set(this.progress*2*Math.max(0, this.size-0.5))
    this._playButton.visible = (this.size > 0.8)
    this._playButton.x = -100*this.size * Math.cos(Math.PI*0.25)
    this._playButton.y = 100*this.size * Math.sin(Math.PI*0.25)

    this._timeLabel.progress = this.progress
    this._timeBg.alpha = this.progress
    this._timeLabel.y = -this.size * 40
    this._timeBg.y = this._timeLabel.y 
    this._timeBg.scale.x = 0.2 + 0.8*this.size
    this._timeBgRed.y = this._timeBg.y
    this._timeBgRed.scale.x = this._timeBg.scale.x
    if(this._pulse) {
      this._timeLabel.alpha = 0.6 + 0.4 * Math.sin(performance.now()*0.01)
      this._redLight.alpha =  (0.8 - 0.4 + 0.4 * Math.sin(performance.now()*0.01))*this.progress
      
    } else {
      this._timeLabel.alpha = 1
      this._redLight.alpha = 0
    }
    this._timeBgRed.alpha = this._redLight.alpha

    const mm = Math.floor(dt / (1000*60))
    const ss = Math.floor((dt - mm * 1000 * 60) / 1000)
    const ms = dt % 1000

    let timeText = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
    if(this.size > 0.8) {
      timeText += `.${ms.toString().padStart(3, '0')}`
    }
    this._timeLabel.text = timeText

    this._modeLabel.progress = this.progress
    this._modeLabel.style.fontSize = this.size * 26
    this._modeLabel.y = this.size * 20
    this._modeLabel.visible = (this.size <= 0.65)
    if(this._mode === 'work') {
      this._modeLabel.text = 'work'
      this._modeLabel.style.fill = 0xffffff
      this._modeLabel.style.stroke = 0xffffff
      this._ticks.count = 25
    } else {
      this._modeLabel.text = 'break'
      this._modeLabel.style.fill = 0xff0000
      this._modeLabel.style.stroke = 0xff0000
      this._ticks.count = 5
    }

    this._workLabel.radius = 110*this.size
    this._workLabel.progress = this.progress
    this._workLabel.fontSize = 12 * this.size
    this._workLabel.alpha = this._mode === 'work' ? 1 : 0.25
    this._workLabel.visible = (this.size > 0.65)
    this._breakLabel.radius = 110*this.size
    this._breakLabel.progress = this.progress
    this._breakLabel.fontSize = 12 * this.size
    this._breakLabel.alpha = this._mode === 'break' ? 1 : 0.25
    this._breakLabel.visible = (this.size > 0.65)

    this._pointer.progress = this.progress
    this._pointer.size = this.size*0.8
    this._pointer.alpha = Math.max(0, 2*(this.size-0.5))
    this._pointer.pointerRotation = Math.PI*2*timeProggress
    this._clockCenter.alpha = this.progress * 0.8 * Math.max(0, 2*(this.size-0.5))
    this._clockCenter.scale.set(this.size)

    this._redLight.scale.set(this.size*1.15)

    this._ticks.size = this.size*0.9
    this._ticks.progress = this.progress
    this._dots.size = this.size*1.1
    this._dots.progress = this.progress
    this._dots.visible = (this.size > 0.8)
    this._dotLabel.progress = this.progress
    this._dotLabel.radius = this.size * 113
    this._dotLabel.fontSize = 12 * this.size
    this._dotLabel.visible = (this.size > 0.8)
    const dayStart = Math.floor(now / (1000*60*60*24))*(1000*60*60*24)
    this._dots.countMax = Math.min(10, this._history.filter(p => p > dayStart ).length)
    this._dotLabel.alpha = this._dots.countMax > 0 ? 1 : 0
    
  }
}