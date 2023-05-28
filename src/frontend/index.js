import GravityField from "./GravityField.js";
import Widget from "./Widget.js"
import FontFaceObserver from 'fontfaceobserver'
import DateTimeWidget from "./widgets/DateTimeWidget.js";
import PomodoroWidget from "./widgets/PomodoroWidget.js";
import WeatherWidget from "./widgets/WeatherWidget.js";
import CalendarWidget from "./widgets/CalendarWidget.js";
import TodoWidget from "./widgets/TodoWidget.js";
import RoomWidget from "./widgets/RoomWidget.js";

(async () => {
  async function loadFont(name) {
    var font = new FontFaceObserver(name)
    await font.load()
    console.log(name + ' has loaded.')
  }
  
  await loadFont('weathericons-regular-webfont')
  await loadFont('MajorMonoDisplay-Regular')
  await loadFont('Material Symbols Outlined')
  
  const socket = io();
  
  const app = new PIXI.Application({
      width: 1480,
      height: 320,
      antialias: false,
      useContextAlpha: false
  })
  document.body.appendChild(app.view)
  
  const gravityField = new GravityField()
  app.stage.addChild(gravityField)
  
  const widgets = [
    new RoomWidget(),
    new PomodoroWidget(),
    new TodoWidget(),
    new CalendarWidget(),
    new WeatherWidget(),
    new DateTimeWidget()
  ]
  
  widgets.forEach((w) => {
    gravityField.addWidget(w)
    w.on('service', (msg) => {
      socket.emit('service', msg)
    })
  })
  
  socket.on('connect', () => {
    gravityField.online = true
  })
  socket.on('disconnect', () => {
    gravityField.online = false
  })
  
  socket.on('widget', function(data) {
    const {
      widgetId,
      payload
    } = data
  
    gravityField.routeMessage(widgetId, payload)
  });
})()
