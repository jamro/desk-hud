import GravityField from "./GravityField.js";
import Widget from "./Widget.js"
import FontFaceObserver from 'fontfaceobserver'
import DateTimeWidget from "./widgets/DateTimeWidget.js";
import PomodoroWidget from "./widgets/PomodoroWidget.js";
import WeatherWidget from "./widgets/WeatherWidget.js";
import CalendarWidget from "./widgets/CalendarWidget.js";
import TodoWidget from "./widgets/TodoWidget.js";


function loadFont(name) {
  var font = new FontFaceObserver(name)
  font.load().then(function () {
    console.log(name + ' has loaded.')
  }).catch(function (e) {
    console.log(name + ' failed to load.', e)
  });
}

loadFont('weathericons-regular-webfont')
loadFont('MajorMonoDisplay-Regular')

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

gravityField.addWidget(new TodoWidget())
gravityField.addWidget(new CalendarWidget())
gravityField.addWidget(new WeatherWidget())
gravityField.addWidget(new PomodoroWidget())
gravityField.addWidget(new DateTimeWidget())
gravityField.addWidget(new Widget("Room"))

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