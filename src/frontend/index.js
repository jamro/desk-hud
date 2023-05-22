import Widget from "./Widget.js"
import FontFaceObserver from 'fontfaceobserver'

var font = new FontFaceObserver('MajorMonoDisplay-Regular');
font.load().then(function () {
  console.log('MajorMonoDisplay-Regular has loaded.');
}).catch(function () {
  console.log('MajorMonoDisplay-Regular failed to load.');
});

const app = new PIXI.Application({
    width: 1480,
    height: 320,
    antialias: true,
})
document.body.appendChild(app.view)

function addCircle(x, y, scale=1) {
  setTimeout(() => {
    const widget = new Widget()
    widget.x = app.view.width*x
    widget.y = app.view.height*y
    widget.size = scale
    app.stage.addChild(widget);
  }, 500)
}


let panel = PIXI.Sprite.from('assets/panel.png');
panel.anchor.set(0.5)
panel.x = app.view.width*0.25
panel.y = app.view.height*0.5
app.stage.addChild(panel);

addCircle(0.55, 0.5)
addCircle(0.73, 0.5)
addCircle(0.86, 0.25, 0.5)
addCircle(0.86, 0.75, 0.5)
addCircle(0.95, 0.25, 0.5)
addCircle(0.95, 0.75, 0.5)
