import GravityField from "./GravityField.js";
import FontFaceObserver from 'fontfaceobserver'
import DemoSocket from "./DemoSocket.js";
import widgets from "../widgets/widgets.js";

const DEMO_MODE = (window.location.hash === '#demo');
const LOG_STYLE = 'font-weight:bold;background-color:green;color:white'
const LOG_PREFIX = '[core]';

if(DEMO_MODE) {
  console.log(LOG_PREFIX, "DEMO MODE is turned on")
}

(async () => {
  async function loadFont(name) {
    var font = new FontFaceObserver(name)
    await font.load()
    console.log(LOG_PREFIX, `Font "${name}" has been loaded`)
  }
  
  console.groupCollapsed(`%c${LOG_PREFIX} Loading fonts....`, LOG_STYLE)
  await loadFont('weathericons-regular-webfont')
  await loadFont('MajorMonoDisplay-Regular')
  await loadFont('Material Symbols Outlined')
  console.groupEnd()
  
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
  
  const widgetsInstances = widgets.map((Def) => new Def())
  
  widgetsInstances.forEach((w) => {
    gravityField.addWidget(w)
    w.on('service', (msg) => {
      socket.emit('service', msg)
    })
  })
  
  socket.on('connect', () => {
    console.log(`%c${LOG_PREFIX} Socket connected`, LOG_STYLE)
    gravityField.online = true
  })
  socket.on('disconnect', () => {
    console.log(`${LOG_PREFIX} Socket disconnected`, LOG_STYLE)
    gravityField.online = false
  })
  
  socket.on('widget', function(data) {
    console.log(`%c[${data.widgetId || 'core'}] Socket message "widget":`, LOG_STYLE, data)
    const {
      widgetId,
      payload
    } = data
  
    gravityField.routeMessage(widgetId, payload)
  })
  socket.on('distance', async (payload) => {
    if(payload.action) {
      console.log(`%c${LOG_PREFIX} Socket message "distance":`, LOG_STYLE, payload)
    }
    if(payload.action === 'goSleep') {
      gravityField.goSleep()
    } else if(payload.action === 'wakeUp') {
      gravityField.wakeUp()
    } 
    if(payload.distance !== undefined) {
      gravityField.distance = payload.distance
    }
  })
  socket.on('config', function(data) {
    console.log(`%c${LOG_PREFIX} Socket message "config":`, LOG_STYLE, data)
    const {widgets} = data
    const keys = Object.keys(widgets)
    for(let key of keys) {
      gravityField.routeConfig(key, widgets[key])
    }
  });
})()
