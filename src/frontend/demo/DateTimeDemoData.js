export default class DateTimeDemoData {
  constructor() {

    this.config = {
      countdown: {
        name: "Vacations",
        date: new Date(Math.floor((new Date().getTime()+17*24*60*60*1000)/(24*60*60*1000))*(24*60*60*1000)).toISOString()
      },
      timezones: [
        {
          id: "europe/warsaw",
          name: "Kraków"
        },
        {
          id: "america/new_york",
          name: "New York"
        },
        {
          id: "america/los_angeles",
          name: "Los Angeles"
        },
        {
          id: "asia/tokyo",
          name: "Tokyo"
        }
      ]
    }
  }


}