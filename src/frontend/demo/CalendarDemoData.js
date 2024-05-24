export default class CalendarDemoData {
  constructor() {
    const now = Math.floor((new Date().getTime())/(1000*60*60))*1000*60*60
    this._data =  {
      widgetId: 'calendar',
      payload: {
        allEvents: [
          {
            "id": "822245245",
            "summary": "Product launch discussion",
            "start": now - 5.5*60*60*1000,
            "end": now - 5*60*60*1000,
            "allDay": false
          },
          {
            "id": "63472245612",
            "summary": "Stand-up",
            "start": now - 3*60*60*1000,
            "end": now - 2*60*60*1000,
            "allDay": false
          },
          {
          "id": "345634563456345634",
          "summary": "Project kickoff meeting",
          "start": now,
          "end": now + 1.5*60*60*1000,
          "allDay": false
          },
          {
            "id": "6573456754633",
            "summary": "Marketing strategy brainstorm",
            "start": now + 2*60*60*1000,
            "end": now + 2.5*60*60*1000,
            "allDay": false
          },
          {
            "id": "567345673",
            "summary": "Weekly team sync",
            "start": now + 3*60*60*1000,
            "end": now + 3.25*60*60*1000,
            "allDay": false
          },
        ]
      }
    }
  }

  get data() {
    return this._data
  }

}