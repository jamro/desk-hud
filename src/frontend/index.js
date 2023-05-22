import GravityField from "./GravityField.js";
import Widget from "./Widget.js"
import FontFaceObserver from 'fontfaceobserver'
import DateTimeWidget from "./widgets/DateTimeWidget.js";

var font = new FontFaceObserver('MajorMonoDisplay-Regular');
font.load().then(function () {
  console.log('MajorMonoDisplay-Regular has loaded.');
}).catch(function () {
  console.log('MajorMonoDisplay-Regular failed to load.');
});

const app = new PIXI.Application({
    width: 1480,
    height: 320,
    antialias: false,
    useContextAlpha: false
})
document.body.appendChild(app.view)

const gravityField = new GravityField()
app.stage.addChild(gravityField)


gravityField.addWidget(new Widget("Blinds"))
gravityField.addWidget(new DateTimeWidget())
gravityField.addWidget(new Widget("Todos"))
gravityField.addWidget(new Widget("Calendar"))
gravityField.addWidget(new Widget("Weather"))
gravityField.addWidget(new Widget("Pomodoro"))