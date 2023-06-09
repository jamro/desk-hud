import GravityField from "./GravityField.js";
import FontFaceObserver from 'fontfaceobserver'
import DateTimeWidget from "./widgets/dateTime/DateTimeWidget.js";
import PomodoroWidget from "./widgets/pomodoro/PomodoroWidget.js";
import WeatherWidget from "./widgets/weather/WeatherWidget.js";
import CalendarWidget from "./widgets/calendar/CalendarWidget.js";
import TodoWidget from "./widgets/todo/TodoWidget.js";
import RoomWidget from "./widgets/room/RoomWidget.js";
import DemoSocket from "./DemoSocket.js";

const DEMO_MODE = (window.location.hash === '#demo');
console.log({DEMO_MODE});

(async () => {
  async function loadFont(name) {
    var font = new FontFaceObserver(name)
    await font.load()
    console.log(name + ' has loaded.')
  }
  
  await loadFont('weathericons-regular-webfont')
  await loadFont('MajorMonoDisplay-Regular')
  await loadFont('Material Symbols Outlined')
  
  const socket = DEMO_MODE ? new DemoSocket() : io()
  
  const app = new PIXI.Application({
      width: 1480,
      height: 320,
      antialias: false,
      useContextAlpha: false
  })
  document.body.appendChild(app.view)
  
  const gravityField = new GravityField()
  if(DEMO_MODE) {
    gravityField.infoMessage.emptyText = '[Demo Mode]'
  }
  app.stage.addChild(gravityField)
  
  const widgets = [
    new DateTimeWidget(),
    new WeatherWidget(),
    new RoomWidget(),
    new CalendarWidget(),
    new TodoWidget(),
    new PomodoroWidget(),
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
    console.log(data)
    const {
      widgetId,
      payload
    } = data
  
    gravityField.routeMessage(widgetId, payload)
  })
  socket.on('distance', async (payload) => {
    console.log(payload)
    if(payload.action === 'goSleep') {
      gravityField.goSleep()
    } else if(payload.action === 'wakeUp') {
      gravityField.wakeUp()
    } 
  })
  socket.on('config', function({widgets}) {
    const keys = Object.keys(widgets)
    for(let key of keys) {
      gravityField.routeConfig(key, widgets[key])
    }
  });
})()
