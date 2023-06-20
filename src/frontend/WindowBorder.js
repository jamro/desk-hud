import CpuFan from "./CpuFan"
import IconButton from "./components/IconButton"
import LineArt from "./components/LineArt"
import ProgressBar from "./components/ProgressBar"
import TextField from "./components/TextField"
import Thermometer from "./components/Thermometer"

export default class WindowBorder extends PIXI.Container {

  constructor() {
    super()
    this.progress = 0
    this._rotationActive = false
    this.distance = 0
    this.cpuLoad = 0
    this.memLoad = 0
    this.cpuTemp = 0
    this.cpuFanMode = 'off'
    this._distanceAnim = 0
    this._fps = 0
    this._frameCount = 0

    setInterval(() => {
      this._fps = this._frameCount*2
      this._frameCount = 0
    }, 500)

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
      600-10, 30-10,
      600-10+5, 30-10,
      600-10+5+10, 30-10-17,
      573, 3,
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

    this._distanceBar = new ProgressBar(45)
    this._distanceBar.progress = 1
    this.addChild(this._distanceBar)
    this._distanceBar.x = 140
    this._distanceBar.y = 6
    this._distanceBar.alpha = 0.4

    this._cpuLabel = new TextField('cpu:  0.0%',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._cpuLabel.anchor.set(0, 0.5)

    this.addChild(this._cpuLabel)
    this._cpuLabel.y = 293
    this._cpuLabel.x = 820

    this._memLabel = new TextField('mem:  0.0%',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._memLabel.anchor.set(0, 0.5)

    this.addChild(this._memLabel)
    this._memLabel.y = 306
    this._memLabel.x = 820

    this._tempLabel = new TextField('cpu temp:',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._tempLabel.anchor.set(0, 0.5)
    this.addChild(this._tempLabel)
    this._tempLabel.y = 306
    this._tempLabel.x = 685

    this._fanLabel = new TextField('cpu fan:',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._fanLabel.anchor.set(0, 0.5)
    this.addChild(this._fanLabel)
    this._fanLabel.y = 293
    this._fanLabel.x = 685

    this._tempLine = new LineArt()
    // temp scale 0 - 110
    this._tempLine.addLine(670-7, 303-125*0.5, 670+7, 303-125*0.5, 1, 0x888888) // 55'C
    this.addChild(this._tempLine)

    this._tempBar = new Thermometer(125, 0.77)
    this.addChild(this._tempBar)
    this._tempBar.y = 303
    this._tempBar.x = 670

    this._cpuBar = new ProgressBar(23, 2)
    this.addChild(this._cpuBar)
    this._cpuBar.x = 900
    this._cpuBar.y = 293
    this._cpuBar.alpha = 0.75

    this._memBar = new ProgressBar(23, 2)
    this.addChild(this._memBar)
    this._memBar.x = 900
    this._memBar.y = 306
    this._memBar.alpha = 0.75

    this._cpuFan = new CpuFan()
    this._cpuFan.x = 695
    this._cpuFan.y = 270
    this._cpuFan.progress = 1
    this.addChild(this._cpuFan)

    this._cpuFan.interactive = true
    this._cpuFan.on('pointertap', () => {
      if(this.cpuFanMode === 'off') {
        this.emit('cpuFanMode', 'auto')
      } else if(this.cpuFanMode === 'auto') {
        this.emit('cpuFanMode', 'on')
      } else {
        this.emit('cpuFanMode', 'off')
      }
    })

    this._fpsLabel = new TextField('fps: ',{
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#888888',
      stroke: "#888888",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._fpsLabel.anchor.set(0, 0.5)
    this._fpsLabel.x = 825
    this._fpsLabel.y = 32
    this.addChild(this._fpsLabel)
    this._fpsLabel.progress = 1
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
    this._distanceBar.alpha = 0.2 + 0.8 * this.progress

    this._cpuLabel.progress = this.progress
    this._cpuLabel.text = `cpu: ${(100*this.cpuLoad).toFixed(1).padStart(5, ' ')}%`
    this._cpuBar.progress = this.progress
    this._cpuBar.value = this.cpuLoad
    this._memLabel.progress = this.progress
    this._memLabel.text = `mem: ${(100*this.memLoad).toFixed(1).padStart(5, ' ')}%`
    this._memBar.progress = this.progress
    this._memBar.value = this.memLoad

    this._tempLabel.progress = this.progress
    this._tempLabel.text = `cpu temp: ${(this.cpuTemp).toFixed(1).padStart(7, ' ')}°c`

    this._tempBar.progress = this.progress
    this._tempBar.value = Math.min(1, this.cpuTemp/110)
    this._tempLine.progress = this.progress
    this._cpuFan.alpha = this.progress
    this._fanLabel.progress = this.progress
    this._fanLabel.text = `fan mode: ${this.cpuFanMode.padStart(9, ' ')}`
    if(this.cpuFanMode === 'on') {
      this._cpuFan.speed = 1
    } else if(this.cpuFanMode === 'off') {
      this._cpuFan.speed = 0
    } else {
      this._cpuFan.speed = 0.3
    }
    this._fpsLabel.text = `fps: ${this._fps} (${PIXI.RENDERER_TYPE[renderer.type].toLowerCase()})`
    this._fpsLabel.y = 10 + 22*this.progress
    this._frameCount++
  }

}