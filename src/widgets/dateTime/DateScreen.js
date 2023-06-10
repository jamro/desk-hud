import LineArt from "../../frontend/components/LineArt"
import TextField from "../../frontend/components/TextField"

export default class DateScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this._lastCalendarUpdate = 0

    this.countdownName = ''
    this.coundownDate = new Date(0)

    const header = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].join(' ')

    this._pointer = new PIXI.Graphics()
    this._pointer.beginFill(0xff0000)
    this._pointer.drawRect(-2, -1, 22, 16)
    this.addChild(this._pointer)

    this._currentMonthField = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._currentMonthField.anchor.set(0, 0)
    this._currentMonthField.x = -230
    this._currentMonthField.y = -40
    this.addChild(this._currentMonthField)

    this._nextMonthField = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._nextMonthField.anchor.set(0, 0)
    this._nextMonthField.x = 50
    this._nextMonthField.y = -40
    this.addChild(this._nextMonthField)

    this._currentMonthHeader = new TextField(header, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'left',
    });
    this._currentMonthHeader.anchor.set(0, 0)
    this._currentMonthHeader.x = -230
    this._currentMonthHeader.y = -60
    this.addChild(this._currentMonthHeader)

    this._nexttMonthHeader = new TextField(header, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'left',
    });
    this._nexttMonthHeader.anchor.set(0, 0)
    this._nexttMonthHeader.x = 50
    this._nexttMonthHeader.y = -60
    this.addChild(this._nexttMonthHeader)

    this._currentMonthTitle = new TextField(header, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._currentMonthTitle.x = -150
    this._currentMonthTitle.y = -75
    this.addChild(this._currentMonthTitle)

    this._nextMonthTitle = new TextField(header, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._nextMonthTitle.x = 130
    this._nextMonthTitle.y = -75
    this.addChild(this._nextMonthTitle)

    this._countdownTitle = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._countdownTitle.x = -140
    this._countdownTitle.y = 60
    this.addChild(this._countdownTitle)

    this._countdownLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 16,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'center',
    });
    this._countdownLabel.x = -140
    this._countdownLabel.y = 78
    this.addChild(this._countdownLabel)

    this._lines = new LineArt()
    this._lines.addSequence([
      -300, 50,
      -45, 50,
      0, 95,
    ])
    this.addChild(this._lines)

    this._refreshCalendar()
  }

  _getCalendarData(now) {
    const monthStart = new Date(now.getFullYear(), now.getMonth())
    const nextMonth = new Date(monthStart.getTime() + 40*24*60*60*1000 )
    const nextMonthStart = new Date(nextMonth.getFullYear(), nextMonth.getMonth())
    const monthEnd = new Date(nextMonthStart.getTime()-24*60*60*1000)

    const data = [
      []
    ]

    const day = monthStart.getDay()-1
    for(let i=0; i < day; i++) {
      if(data[data.length-1].length === 7) {
        data.push([])
      }
      data[data.length-1].push(' ')
    }

    const dayCount = monthEnd.getDate()
    for(let i=1; i <= dayCount; i++) {
      if(data[data.length-1].length === 7) {
        data.push([])
      }
      data[data.length-1].push(i)
    }
    return data
  }

  _refreshCalendar() {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth())
    const nextMonthDate = new Date(monthStart.getTime() + 40*24*60*60*1000 )
    const currentMonth = this._getCalendarData(now)
    const nextMonth = this._getCalendarData(nextMonthDate)

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    this._currentMonthTitle.text = months[now.getMonth()]
    this._nextMonthTitle.text = months[nextMonthDate.getMonth()]
    this._nextMonthField.text = nextMonth.map(r => r.map(c => String(c).padStart(2, ' ')).join(' ')).join('\n')
    this._currentMonthField.text = currentMonth.map(r => r.map(c => String(c).padStart(2, ' ')).join(' ')).join('\n')

    for(let i = 0; i < currentMonth.length; i++) {
      for(let j = 0; j < currentMonth[i].length; j++) {
        if(currentMonth[i][j] === now.getDate()) {
          this._pointer.x = -230 + 24.5*j
          this._pointer.y = -40 + 14*i
        }
      }
    }
  }

  render(renderer) {
    const now = performance.now()
    if(now > this._lastCalendarUpdate + 1000) {
      this._lastCalendarUpdate = now
      this._refreshCalendar()
    }
    this._currentMonthField.progress = this.progress
    this._nextMonthField.progress = this.progress
    this._currentMonthHeader.progress = this.progress
    this._nexttMonthHeader.progress = this.progress
    this._currentMonthTitle.progress = this.progress
    this._nextMonthTitle.progress = this.progress
    this._pointer.alpha = this.progress
    this._countdownTitle.progress = this.progress
    this._countdownLabel.progress = this.progress
    this._lines.progress = this.progress

    const nowDate = new Date()
    if(nowDate.getTime() > this.coundownDate.getTime()) {
      this.countdownName = 'New Year'
      this.coundownDate = new Date(nowDate.getFullYear()+1, 0, 0)
    }

    this._countdownTitle.text = `${this.countdownName} in:`

    const dt = Math.max(0, this.coundownDate.getTime() - nowDate.getTime())
    const dd = Math.floor(dt/(1000*60*60*24))
    const hh = Math.floor(dt/(1000*60*60)) % 24
    const mm = Math.floor(dt/(1000*60)) % 60
    const ss = Math.floor(dt/(1000)) % 60
    const ms = Math.floor(dt) % 1000


    this._countdownLabel.text = `${String(dd).padStart(2, '0')}:${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(ms).padStart(3, '0')}`


    super.render(renderer)
  }
}