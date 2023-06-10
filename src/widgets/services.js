const CalendarService = require("./calendar/CalendarService")
const PomodoroService = require("./pomodoro/PomodoroService")
const RoomService = require("./room/RoomService")
const TodoService = require("./todo/TodoService")
const WeatherService = require("./weather/WeatherService")

const services = [
  WeatherService,
  RoomService,
  CalendarService,
  TodoService,
  PomodoroService,
]
module.exports = services