import MainScreen from '../../frontend/MainScreen.js';
import Widget from '../../frontend/Widget.js'
import ProgressCircle from '../../frontend/circles/ProgressCircle.js';
import TickCircle from '../../frontend/circles/TickCircle.js';
import ArchText from '../../frontend/components/ArchText.js';
import GaugePointer from '../../frontend/components/GaugePointer.js';
import TextField from '../../frontend/components/TextField.js';
import CalendarScreen from './CalendarScreen.js';

export default class CalendarWidget extends Widget {
  constructor() {
    super('calendar', "Calendar")
    this._dataLoadProgress = 0
    this.data = {
      lastUpdate: null,
      allEvents: null,
      todayEvents: null,
      todayEventsLeft: null,
    }

    this._statsTitle = new TextField('completed\ntoday', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 9,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._statsTitle)
    this._statsLabel = new TextField('0/0', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 15,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._statsLabel)

    this._statusProgress = new ProgressCircle()
    this._statusProgress.color = 0xff0000
    this._statusProgress.lineWidth = 2
    this._statusProgress.rotation = Math.PI/2
    this.addChild(this._statusProgress)

    this._nextLabel = new ArchText()
    this._nextLabel.color = 0xff0000
    this._nextMeetingLabel = new ArchText()
    this._nextLabel.alignOffset = 0
    this._nextMeetingLabel.alignOffset = 0
    this._nextLabel.positionOffset = -Math.PI * 0.37
    this._nextLabel.fontSize = 11
    this._nextMeetingLabel.fontSize = 11
    this.addChild(this._nextMeetingLabel)
    this.addChild(this._nextLabel)

    this._meetingClock = new PIXI.Container()
    this.addChild(this._meetingClock)

    this._clockAlert = new PIXI.Graphics()
    this._clockAlert.beginFill(0xff0000)
    this._clockAlert.drawCircle(0, 0, 40)
    this._meetingClock.addChild(this._clockAlert)
    this._clockAlert.visible = false

    this._clockScale = new TickCircle()
    this._clockScale.count = 60
    this._clockScale.length = 0.1
    this._meetingClock.addChild(this._clockScale)

    this._clockSplit = new TickCircle()
    this._clockSplit.count = 6
    this._clockSplit.length = 0.5
    this._meetingClock.addChild(this._clockSplit)

    this._clockFrame = new ProgressCircle()
    this._clockFrame.value = 1
    this._clockFrame.lineWidth = 1.5
    this._meetingClock.addChild(this._clockFrame)

    this._clockPointer = new GaugePointer()
    this._meetingClock.addChild(this._clockPointer)

    this._clockCenter = new PIXI.Graphics()
    this._clockCenter.lineStyle({
      color: 0xaaaaaa,
      width: 1,
    })
    this._clockCenter.drawCircle(0, 0, 10)
    this._clockCenter.drawCircle(0, 0, 1)
    this._clockCenter.alpha = 0
    this._meetingClock.addChild(this._clockCenter)

    this._clockTitle = new ArchText()
    this._meetingClock.addChild(this._clockTitle)

    // main screen
    this.main.title = "Calendar"
    const calendarPage = this.main.getPage(0)
   
    this._calendarScreen = new CalendarScreen()
    calendarPage.addChild(this._calendarScreen)
  }

  onMessage(events) {
    const today = Math.floor((new Date().getTime())/(1000*60*60*24))*(1000*60*60*24) + new Date().getTimezoneOffset()*60000

    this.data.allEvents = events.filter(e => e.start < today + 7*24*60*60*1000)
    this.data.todayEvents = this.data.allEvents.filter(e => e.start < today + 24*60*60*1000 && !e.allDay)
    this.data.todayEventsLeft = this.data.todayEvents.filter(e => e.end >= new Date().getTime())
    this.data.lastUpdate = new Date().getTime()
  }

  render(renderer) {
    super.render(renderer)

    if(this.data.lastUpdate && this._dataLoadProgress < 1) {
      this._dataLoadProgress = Math.min(1, this._dataLoadProgress + 0.02)
    }

    const now = new Date().getTime()

    this._statsLabel.progress = this.progress * this._dataLoadProgress
    this._statsTitle.progress = this.progress * this._dataLoadProgress
    this._statsLabel.y = 25 * this.size - 120*Math.max(0, this.size - 0.5)
    this._statsTitle.y = -20 * this.size - 80*Math.max(0, this.size - 0.5)
    this._statusProgress.progress = this.progress * this._dataLoadProgress
    this._statusProgress.size = this.size
    if(this.data.todayEvents && this.data.todayEventsLeft) {
      const completedEvents = this.data.todayEvents.length - this.data.todayEventsLeft.length
      const allEvents = this.data.todayEvents.length
      this._statsLabel.text = completedEvents + '/' + allEvents
      this._statusProgress.value = allEvents ? 0.5*((completedEvents)/allEvents) : 0
    }

    if(this.data.todayEventsLeft && this.data.todayEventsLeft.length > 0) {
      const upcomingMeetings = this.data.todayEvents.filter(e => e.start > now)
      if(upcomingMeetings.length > 0) {
        const eventTime = new Date(upcomingMeetings[0].start)
        const hh = (eventTime.getHours()).toString().padStart(2, '0')
        const mm = (eventTime.getMinutes()).toString().padStart(2, '0')
        this._nextMeetingLabel.visible = true
        this._nextMeetingLabel.radius = this.size * 105 + 5
        this._nextMeetingLabel.text = `${hh}:${mm} ${this.size === 1 ? upcomingMeetings[0].summary.substring(0, 40) : ''}`
        this._nextMeetingLabel.progress = this.progress * this._dataLoadProgress
        this._nextMeetingLabel.positionOffset = -Math.PI * 0.52 - 0.5*(1 - this.size)
        this._nextLabel.visible = true
        this._nextLabel.radius = this.size * 105 + 5
        this._nextLabel.text = 'next:'
        this._nextLabel.progress = this.progress * this._dataLoadProgress
        this._nextLabel.fontSize = 7 + this.size*4
        this._nextMeetingLabel.fontSize = 7 + this.size*4
      } else {
        this._nextMeetingLabel.visible = false
        this._nextLabel.visible = false
      }
    } else {
      this._nextMeetingLabel.visible = false
      this._nextLabel.visible = false
    }

    if(this.size === 1 && this.data.todayEvents) {
      const currentMeeting = this.data.todayEvents.find(e => e.start < now && e.end > now)
      let meetingProgress = 0
      let meetingTimeLeft = 0
      if(currentMeeting) {
        meetingTimeLeft = currentMeeting.end - now
        meetingProgress = (now - currentMeeting.start)/(currentMeeting.end - currentMeeting.start)
      }

      this._meetingClock.visible = true
      this._meetingClock.y = 40 * this.size
      this._clockScale.size = 0.4*this.size
      this._clockScale.progress = this.progress * this._dataLoadProgress
      this._clockSplit.size = 0.4 * this.size
      this._clockSplit.progress = this.progress * this._dataLoadProgress
      this._clockFrame.size = 0.45 * this.size
      this._clockFrame.progress = this.progress * this._dataLoadProgress

      this._clockPointer.size = 0.35
      this._clockPointer.progress = this.progress * this._dataLoadProgress
      this._clockCenter.alpha = this.progress * this._dataLoadProgress

      this._clockTitle.radius = 53
      this._clockTitle.progress = this.progress * this._dataLoadProgress
      this._clockTitle.text = currentMeeting ? "meeting clock" : "no meetings now"
      this._clockTitle.alpha = currentMeeting ? 1 : 0.4
      this._clockPointer.pointerRotation = 2 * Math.PI * meetingProgress
      this._clockPointer.visible = !!currentMeeting

      this._clockAlert.visible = true
      this._clockAlert.alpha = meetingTimeLeft > 0 && meetingTimeLeft < 5*60*1000 ? Math.sin(performance.now()*0.01)*0.4 + 0.4 : 0
      this._clockAlert.alpha *= this.progress * this._dataLoadProgress
    } else {
      this._meetingClock.visible = false
      this._clockAlert.visible = false
    }   
    this._calendarScreen.progress = this.main.progress * this._dataLoadProgress
    this._calendarScreen.events = this.data.todayEvents
  }
}