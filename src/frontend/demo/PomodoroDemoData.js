export default class PomodoroDemoData {
  constructor() {
    const now = new Date().getTime()

    const hour = 60*60*1000
    const day = 24*hour
    this._data =  {
      widgetId: 'pomodoro',
      payload: {
        history: [
          now - hour,
          now - day,
          now - day,
          now - day,
          now - day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 3*day,
          now - 4*day,
          now - 4*day,
          now - 6*day,
          now - 6*day,
          now - 6*day,
        ]
      }
    }
  }

  get data() {
    return this._data
  }

  onMessage(payload) {
    if(payload.action === 'pomodoroDone') {
      this._data.payload.history.push(new Date().getTime())
    }
  }

}