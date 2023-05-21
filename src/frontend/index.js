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

addCircle(0, 0.5)
addCircle(0.49, 0.5)
addCircle(0.63, 0.25, 0.6)
addCircle(0.63, 0.75, 0.6)
addCircle(0.73, 0.25, 0.6)
addCircle(0.73, 0.75, 0.6)
addCircle(0.82, 0.16, 0.4)
addCircle(0.82, 0.50, 0.4)
addCircle(0.82, 0.84, 0.4)
addCircle(0.89, 0.16, 0.4)
addCircle(0.89, 0.50, 0.4)
addCircle(0.89, 0.84, 0.4)
addCircle(0.96, 0.16, 0.4)
addCircle(0.96, 0.50, 0.4)
addCircle(0.96, 0.84, 0.4)
