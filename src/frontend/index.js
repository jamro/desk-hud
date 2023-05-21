const app = new PIXI.Application({
    width: 1480,
    height: 320
})
document.body.appendChild(app.view)


function addCircle(x, y, scale=1) {
  let circle = PIXI.Sprite.from('assets/circle.png');
  circle.anchor.set(0.5)
  circle.x = app.view.width*x
  circle.y = app.view.height*y
  circle.scale.set(scale)
  app.stage.addChild(circle);
}


let panel = PIXI.Sprite.from('assets/panel.png');
panel.anchor.set(0.5)
panel.x = app.view.width*0.25
panel.y = app.view.height*0.5
app.stage.addChild(panel);

addCircle(0.03, 0.5)
addCircle(0.55, 0.5)
addCircle(0.73, 0.5)
addCircle(0.86, 0.25, 0.5)
addCircle(0.86, 0.75, 0.5)
addCircle(0.95, 0.25, 0.5)
addCircle(0.95, 0.75, 0.5)


