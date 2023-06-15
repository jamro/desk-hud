import IconButton from "./components/IconButton"
import LineArt from "./components/LineArt"
import ProgressBar from "./components/ProgressBar"
import TextField from "./components/TextField"

export default class WindowBorder extends PIXI.Container {

  constructor() {
    super()
    this.progress = 0
    this._rotationActive = false
    this.distance = 0
    this._distanceAnim = 0

    this._lines = new LineArt()
    this.addChild(this._lines)

    this._lines.addSequence([
      815, 290,
      815, 315,
      1480, 315,
    ], 1, 0x555555)
    this._lines.addSequence([
      805, 290,
      805, 315,
      660, 315,
      660, 170,
      680, 170
    ], 1, 0x555555)
    this._lines.addSequence([
      1235-33, 200,
      1235-33, 290-33,
      1235, 290,
      1480, 290,
    ], 1, 0x555555)

    this._lines.addSequence([
      1480, 30,
      1235, 30,
      1235-33, 30+33,
      1235-33, 30+33+10,
    ], 1, 0x555555)

    this._lines.addSequence([
      1480, 302,
      1225, 302,
      1225-35, 302-35,
      1225-70-12, 302+12,
    ], 3, 0x333333)

    this._lines.addSequence([
      1480, 302+10,
      1225, 302+10,
      1225-35, 302-35+10,
      1225-70-2, 302+2+10,
    ], 1, 0x555555)

    this._lines.addSequence([
      1480, 20,
      1235, 20,
      1225, 10,
      950, 10,
      950, 0,
    ], 3, 0x333333)

    this._lines.addSequence([
      945, 0,
      945, 40,
      820, 40,
      820, 30,
      600, 30,
      570, 0,
    ], 1, 0x555555)

    this._lines.addSequence([
      0, 20,
      130, 20,
      135, 25,
      1480, 25,
    ], 1, 0x555555)

    this._rotateForwardButton = new IconButton(0xe5c8)
    this._rotateForwardButton.x = 1333
    this._rotateForwardButton.y = 30
    this._rotateForwardButton.visible = false
    this._rotateForwardButton.scale.set(0.75)
    this.addChild(this._rotateForwardButton)

    this._rotateBackButton = new IconButton(0xe5c8)
    this._rotateBackButton.x = 1333
    this._rotateBackButton.y = 290
    this._rotateBackButton.visible = false
    this._rotateBackButton.scale.set(0.75)
    this.addChild(this._rotateBackButton)

    this._rotateForwardButton.on('pointertap', () => this.emit('rotate', +1))
    this._rotateBackButton.on('pointertap', () => this.emit('rotate', -1))


    this._distanceLabel = new TextField('',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._distanceLabel.x = 15
    this._distanceLabel.y = 10
    this._distanceLabel.progress = 1
    this._distanceLabel.anchor.set(0, 0.5)
    this.addChild(this._distanceLabel)

    this._distanceBar = new ProgressBar(30)
    this.addChild(this._distanceBar)
    this._distanceBar.x = 140
    this._distanceBar.y = 6
    this._distanceBar.alpha = 0.4

  }

  get rotationActive() {
    return this._rotationActive
  }

  set rotationActive(v) {
    this._rotationActive = v
    this._rotateForwardButton.visible = v
    this._rotateBackButton.visible = v
  }

  render(renderer) {
    super.render(renderer)

    this._rotateForwardButton.alpha = this.progress
    this._rotateBackButton.alpha = this.progress
    this._lines.progress = this.progress
    this._distanceAnim += (this.distance - this._distanceAnim)/20
    this._distanceLabel.text = `distance: ${this._distanceAnim.toFixed(3).padStart(7, ' ')}cm`
    this._distanceBar.value = Math.min(1, this._distanceAnim/300)
  }

}