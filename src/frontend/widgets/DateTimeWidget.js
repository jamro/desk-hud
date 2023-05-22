import Widget from '../Widget.js'
import ProgressCircle from '../circles/ProgressCircle.js';
import ArchText from '../components/ArchText.js';
import TextField from '../components/TextField.js';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export default class DateTimeWidget extends Widget {
  constructor() {
    super("Date & Time")

    this._secPointer = new ProgressCircle()
    this._secPointer.color = 0xff0000
    this.addChild(this._secPointer)
    this._minPointer = new ProgressCircle()
    this._minPointer.color = 0xff0000
    this.addChild(this._minPointer)
    this._hourPointer = new ProgressCircle()
    this._hourPointer.color = 0xff0000
    this.addChild(this._hourPointer)

    this._timeLabel = new TextField('00:00:00', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 10,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._timeLabel.anchor.set(0.5)
    this.addChild(this._timeLabel)

    this._dateLabel = new TextField('???', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 10,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._dateLabel.anchor.set(0.5)
    this.addChild(this._dateLabel)

    this._weekDays = []
    for(let i=0; i < days.length; i++) {
      const day = days[i]
      const label = new ArchText()
      this._weekDays.push(label)
      label.text = day
      label.positionOffset = 1.35 * Math.PI - ((i+6) % 7) * 0.4 
      label.progress = 1
      this.addChild(label)
    }
  }

  render(renderer) {
    super.render(renderer)

    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    const ss = now.getSeconds().toString().padStart(2, '0')

    this._timeLabel.style.fontSize = 2 + this.size * 20
    let clockText = `${hh}:${mm}` 
    if(this.size > 0.5) {
      clockText += `:${ss}`
      this._timeLabel.y = - this.size * 15
    } else {
      this._timeLabel.y = 0
      this._timeLabel.style.fontSize *= 1.5
    }
    this._timeLabel.text = clockText
    this._timeLabel.progress = this._progress
    

    this._dateLabel.style.fontSize = 2 + this.size * 18
    this._dateLabel.text = `${months[now.getMonth()]} ${now.getDate()}` 
    this._dateLabel.y = + this.size * 15
    this._dateLabel.visible = (this.size > 0.5)
    this._dateLabel.progress = this._progress

    this._secPointer.value = now.getSeconds()/60
    this._secPointer.progress = this._progress
    this._secPointer.size = this.size*((this.size > 0.5) ? 0.86 : 0.80)

    this._minPointer.value = now.getMinutes()/60
    this._minPointer.progress = this._progress
    this._minPointer.size = this.size*0.83
    this._minPointer.visible = (this.size > 0.75)

    this._hourPointer.value = now.getHours()/24
    this._hourPointer.progress = this._progress
    this._hourPointer.size = this.size*0.80
    this._hourPointer.visible = (this.size > 0.75)

    for(let i=0; i < this._weekDays.length; i++) {
      const day = this._weekDays[i]
      day.radius = this.size * 94
      day.fontSize = 4 + this.size * 5
      day.alpha = i == now.getDay() ? 1 : 0.4
      day.visible = (this.size > 0.9 && this.progress > ((i+6) % 7)/7)
    }
  }
}